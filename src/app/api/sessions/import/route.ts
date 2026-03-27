import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase-server'
import { fanoutToFollowers } from '../../../lib/fanout'
import { requireAuth } from '../../../lib/auth'
import { parseGpx } from '../../../lib/gpx-parser'
import { generateTrackThumbnail } from '../../../lib/track-thumbnail'
import { SPORT_TYPES } from '../../../lib/constants'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
const DEDUP_TIME_TOLERANCE_SEC = 10
const SPOT_MATCH_RADIUS_KM = 5

export async function POST(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const sportType = (formData.get('type') as string) || 'windsurfing'
    const spotId = formData.get('spot_id') as string | null

    if (!file) {
        return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.gpx')) {
        return NextResponse.json({ error: 'Only .gpx files are supported' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 400 })
    }

    if (!SPORT_TYPES.includes(sportType as typeof SPORT_TYPES[number])) {
        return NextResponse.json({ error: `type must be one of: ${SPORT_TYPES.join(', ')}` }, { status: 400 })
    }

    const gpxContent = await file.text()

    let parsed
    try {
        parsed = parseGpx(gpxContent)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to parse GPX file'
        return NextResponse.json({ error: message }, { status: 400 })
    }

    const { metadata, track } = parsed
    const supabase = createAdminClient()

    // Auto-match spot by proximity if not provided
    let resolvedSpotId = spotId ? parseInt(spotId, 10) : null
    if (!resolvedSpotId) {
        resolvedSpotId = await findNearestSpot(supabase, metadata.startLat, metadata.startLon)
    }

    // Check for duplicate session (same user, similar start time and location)
    const existingSession = await findDuplicateSession(
        supabase, userId, metadata.startTime, metadata.startLat, metadata.startLon
    )

    const sessionData = {
        user_id: userId,
        spot_id: resolvedSpotId,
        type: sportType,
        duration_minutes: metadata.durationMinutes,
        max_speed_kts: metadata.maxSpeedKts,
        avg_speed_kts: metadata.avgSpeedKts,
        distance_km: metadata.distanceKm,
        max_hr: metadata.maxHr,
        avg_hr: metadata.avgHr,
        start_time: metadata.startTime,
        start_lat: metadata.startLat,
        start_lon: metadata.startLon,
        source: 'gpx_import',
        source_file_name: file.name,
    }

    let session
    if (existingSession) {
        // Replace existing session
        const { data, error } = await supabase
            .from('sessions')
            .update(sessionData)
            .eq('id', existingSession.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
        }
        session = data
    } else {
        // Create new session
        const { data, error } = await supabase
            .from('sessions')
            .insert(sessionData)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
        }
        session = data
    }

    // Upload GeoJSON track to Supabase Storage
    const trackPath = `${userId}/${session.id}.json`
    const trackJson = JSON.stringify(track)
    const trackBuffer = Buffer.from(trackJson, 'utf-8')

    const { error: storageError } = await supabase.storage
        .from('tracks')
        .upload(trackPath, trackBuffer, {
            upsert: true,
            contentType: 'application/json',
        })

    if (storageError) {
        // Clean up session if track upload fails and it was a new session
        if (!existingSession) {
            await supabase.from('sessions').delete().eq('id', session.id)
        }
        return NextResponse.json({ error: 'Failed to upload track data' }, { status: 500 })
    }

    // Generate and upload track thumbnail
    const thumbnailPath = `${userId}/${session.id}.png`
    let thumbnailUploaded = false
    try {
        const thumbnailBuffer = await generateTrackThumbnail(track)
        const { error: thumbError } = await supabase.storage
            .from('tracks')
            .upload(thumbnailPath, thumbnailBuffer, {
                upsert: true,
                contentType: 'image/png',
            })
        if (thumbError) {
            console.error('Thumbnail upload error:', thumbError)
        } else {
            thumbnailUploaded = true
        }
    } catch (err) {
        console.error('Thumbnail generation error:', err)
    }

    // Save track URL and thumbnail URL on the session
    const { data: urlData } = supabase.storage.from('tracks').getPublicUrl(trackPath)
    const updateData: Record<string, string> = { track_url: urlData.publicUrl }
    if (thumbnailUploaded) {
        const { data: thumbUrlData } = supabase.storage.from('tracks').getPublicUrl(thumbnailPath)
        updateData.track_thumbnail_url = thumbUrlData.publicUrl
    }
    await supabase
        .from('sessions')
        .update(updateData)
        .eq('id', session.id)

    // Fanout to feed only for new sessions
    if (!existingSession) {
        await fanoutToFollowers(supabase, userId, 'session', session.id, session.created_at)
    }

    return NextResponse.json({
        ...session,
        track_url: urlData.publicUrl,
        replaced: !!existingSession,
    }, { status: existingSession ? 200 : 201 })
}

async function findNearestSpot(
    supabase: ReturnType<typeof createAdminClient>,
    lat: number,
    lon: number
): Promise<number | null> {
    // Use the PostGIS nearby_spots function if available, otherwise fall back to manual query
    const { data: spots } = await supabase
        .from('spots')
        .select('id, lat, lon')
        .not('lat', 'is', null)
        .not('lon', 'is', null)

    if (!spots || spots.length === 0) return null

    let nearestId: number | null = null
    let nearestDist = Infinity

    for (const spot of spots) {
        const dist = haversineKm(lat, lon, spot.lat, spot.lon)
        if (dist < nearestDist && dist <= SPOT_MATCH_RADIUS_KM) {
            nearestDist = dist
            nearestId = spot.id
        }
    }

    return nearestId
}

async function findDuplicateSession(
    supabase: ReturnType<typeof createAdminClient>,
    userId: string,
    startTime: string,
    startLat: number,
    startLon: number
): Promise<{ id: string } | null> {
    const startDate = new Date(startTime)
    const minTime = new Date(startDate.getTime() - DEDUP_TIME_TOLERANCE_SEC * 1000).toISOString()
    const maxTime = new Date(startDate.getTime() + DEDUP_TIME_TOLERANCE_SEC * 1000).toISOString()

    const { data } = await supabase
        .from('sessions')
        .select('id, start_lat, start_lon')
        .eq('user_id', userId)
        .gte('start_time', minTime)
        .lte('start_time', maxTime)

    if (!data || data.length === 0) return null

    // Check location proximity (within ~500m)
    for (const session of data) {
        if (session.start_lat && session.start_lon) {
            const dist = haversineKm(startLat, startLon, session.start_lat, session.start_lon)
            if (dist < 0.5) {
                return { id: session.id }
            }
        }
    }

    return null
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const toRad = (deg: number) => deg * Math.PI / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

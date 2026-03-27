/**
 * Server-side GPX parser.
 * Parses GPX 1.1 files (with optional Garmin TrackPoint extensions)
 * into session metadata + GeoJSON track data.
 */

interface GpxPoint {
    lat: number
    lon: number
    time: string
    speed: number  // m/s
    course: number
    hr: number
    ele: number
}

export interface SessionMetadata {
    startTime: string          // ISO 8601
    durationMinutes: number
    distanceKm: number
    maxSpeedKts: number
    avgSpeedKts: number
    maxHr: number
    avgHr: number
    startLat: number
    startLon: number
}

export interface GeoJsonTrack {
    type: 'FeatureCollection'
    features: [{
        type: 'Feature'
        geometry: {
            type: 'LineString'
            coordinates: [number, number][]  // [lon, lat]
        }
        properties: {
            times: string[]
            speeds: number[]      // m/s
            heartRates: number[]
            courses: number[]
        }
    }]
}

export interface ParsedGpx {
    metadata: SessionMetadata
    track: GeoJsonTrack
}

const MS_TO_KNOTS = 1.94384

/**
 * Parse a GPX XML string into session metadata and GeoJSON track.
 */
export function parseGpx(gpxContent: string): ParsedGpx {
    const points = extractPoints(gpxContent)

    if (points.length < 2) {
        throw new Error('GPX file must contain at least 2 track points')
    }

    const metadata = computeMetadata(points)
    const track = toGeoJson(points)

    return { metadata, track }
}

function extractPoints(xml: string): GpxPoint[] {
    const points: GpxPoint[] = []
    const trkptRegex = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)">([\s\S]*?)<\/trkpt>/g
    let match

    while ((match = trkptRegex.exec(xml)) !== null) {
        const lat = parseFloat(match[1])
        const lon = parseFloat(match[2])
        const inner = match[3]

        const time = extractTag(inner, 'time') || ''
        const ele = parseFloat(extractTag(inner, 'ele') || '0')
        const speed = parseFloat(extractExtension(inner, 'speed') || '0')
        const course = parseFloat(extractExtension(inner, 'course') || '0')
        const hr = parseInt(extractExtension(inner, 'hr') || '0', 10)

        points.push({ lat, lon, time, speed, course, hr, ele })
    }

    return points
}

function extractTag(xml: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`)
    const match = regex.exec(xml)
    return match ? match[1].trim() : null
}

function extractExtension(xml: string, field: string): string | null {
    // Match both gpxtpx: prefixed and unprefixed
    const regex = new RegExp(`<(?:gpxtpx:)?${field}>([^<]*)</(?:gpxtpx:)?${field}>`)
    const match = regex.exec(xml)
    return match ? match[1].trim() : null
}

function computeMetadata(points: GpxPoint[]): SessionMetadata {
    const startTime = points[0].time
    const endTime = points[points.length - 1].time
    const startMs = new Date(startTime).getTime()
    const endMs = new Date(endTime).getTime()
    const durationMinutes = Math.round((endMs - startMs) / 60000)

    // Compute total distance using Haversine
    let totalDistanceM = 0
    for (let i = 1; i < points.length; i++) {
        totalDistanceM += haversineDistance(
            points[i - 1].lat, points[i - 1].lon,
            points[i].lat, points[i].lon
        )
    }

    // Speed stats (filter out zero speeds for averages)
    const speeds = points.map(p => p.speed)
    const nonZeroSpeeds = speeds.filter(s => s > 0)
    const maxSpeedMs = Math.max(...speeds)
    const avgSpeedMs = nonZeroSpeeds.length > 0
        ? nonZeroSpeeds.reduce((a, b) => a + b, 0) / nonZeroSpeeds.length
        : 0

    // Heart rate stats (filter out zero HR)
    const heartRates = points.map(p => p.hr).filter(hr => hr > 0)
    const maxHr = heartRates.length > 0 ? Math.max(...heartRates) : 0
    const avgHr = heartRates.length > 0
        ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
        : 0

    return {
        startTime,
        durationMinutes,
        distanceKm: Math.round(totalDistanceM / 10) / 100, // 2 decimal places
        maxSpeedKts: Math.round(maxSpeedMs * MS_TO_KNOTS * 100) / 100,
        avgSpeedKts: Math.round(avgSpeedMs * MS_TO_KNOTS * 100) / 100,
        maxHr,
        avgHr,
        startLat: points[0].lat,
        startLon: points[0].lon,
    }
}

function toGeoJson(points: GpxPoint[]): GeoJsonTrack {
    return {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: points.map(p => [p.lon, p.lat]),
            },
            properties: {
                times: points.map(p => p.time),
                speeds: points.map(p => p.speed),
                heartRates: points.map(p => p.hr),
                courses: points.map(p => p.course),
            },
        }],
    }
}

/**
 * Haversine distance between two points in meters.
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000 // Earth radius in meters
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

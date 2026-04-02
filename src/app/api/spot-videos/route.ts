import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase-server'
import { requireAuth, isAdmin } from '../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const spotId = request.nextUrl.searchParams.get('spot_id')
    if (!spotId) {
        return NextResponse.json({ error: 'spot_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: videos, error } = await supabase
        .from('spot_videos')
        .select('*')
        .eq('spot_id', spotId)
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
    }

    const userIds = [...new Set(videos.map((v: { user_id: string }) => v.user_id))]
    const { data: profiles } = userIds.length > 0
        ? await supabase
            .from('user_profiles')
            .select('user_id, username, full_name, avatar_url')
            .in('user_id', userIds)
        : { data: [] }

    const profileMap = new Map((profiles || []).map((p: { user_id: string }) => [p.user_id, p]))
    const videosWithProfiles = videos.map((video: { user_id: string }) => ({
        ...video,
        user_profile: profileMap.get(video.user_id) || null,
    }))

    return NextResponse.json(videosWithProfiles)
}

export async function POST(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const body = await request.json()
    const { spot_id, youtube_id, title } = body

    if (!spot_id || !youtube_id) {
        return NextResponse.json({ error: 'spot_id and youtube_id are required' }, { status: 400 })
    }

    const cleanYoutubeId = youtube_id.trim()
    if (!/^[a-zA-Z0-9_-]{11}$/.test(cleanYoutubeId)) {
        return NextResponse.json({ error: 'Invalid YouTube video ID' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: video, error } = await supabase
        .from('spot_videos')
        .insert({
            spot_id: parseInt(spot_id),
            user_id: userId,
            youtube_id: cleanYoutubeId,
            title: title?.trim() || null,
        })
        .select('*')
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to save video', details: error.message }, { status: 500 })
    }

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name, avatar_url')
        .eq('user_id', userId)
        .single()

    return NextResponse.json({ ...video, user_profile: profile || null }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const { id } = await request.json()
    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: existing } = await supabase
        .from('spot_videos')
        .select('user_id')
        .eq('id', id)
        .single()

    if (!existing) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const admin = await isAdmin()
    if (!admin && existing.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
        .from('spot_videos')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

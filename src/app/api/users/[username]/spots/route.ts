import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../../lib/supabase-server'
import { requireAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params

    const supabase = createAdminClient()

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name, avatar_url, location_text, location_lat, location_lon')
        .eq('username', username)
        .single()

    if (!profile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data, error } = await supabase
        .from('user_spots')
        .select('spot_id, spots(id, slug, title, image, location_id, lat, lon, locations(name))')
        .eq('user_id', profile.user_id)

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch spots' }, { status: 500 })
    }

    const location = profile.location_text
        ? { text: profile.location_text, lat: profile.location_lat, lon: profile.location_lon }
        : null

    return NextResponse.json({
        user: {
            id: profile.user_id,
            fullName: profile.full_name,
            imageUrl: profile.avatar_url,
            username: profile.username,
            location,
        },
        spots: data,
    })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const { username } = await params

    const supabase = createAdminClient()

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('username', username)
        .single()

    if (!profile || profile.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { spot_id } = await request.json()

    const { error } = await supabase
        .from('user_spots')
        .delete()
        .eq('user_id', userId)
        .eq('spot_id', spot_id)

    if (error) {
        return NextResponse.json({ error: 'Failed to remove spot' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}

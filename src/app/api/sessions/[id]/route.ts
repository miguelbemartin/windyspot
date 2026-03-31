import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase-server'
import { requireAuth } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const supabase = createAdminClient()

    const { data: session, error } = await supabase
        .from('sessions')
        .select('*, spots(id, title, slug, image, lat, lon, locations(name))')
        .eq('id', id)
        .single()

    if (error || !session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Fetch actor profile
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name, avatar_url')
        .eq('user_id', session.user_id)
        .single()

    return NextResponse.json({ ...session, actor: profile || null })
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const { id } = await params
    const supabase = createAdminClient()

    // Fetch session and verify ownership
    const { data: session, error } = await supabase
        .from('sessions')
        .select('id, user_id')
        .eq('id', id)
        .single()

    if (error || !session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete track file and thumbnail from storage
    const trackPath = `${userId}/${id}.json`
    const thumbnailPath = `${userId}/${id}.png`
    await supabase.storage.from('tracks').remove([trackPath, thumbnailPath])

    // Delete feed items referencing this session
    await supabase
        .from('feed_items')
        .delete()
        .eq('item_type', 'session')
        .eq('item_id', id)

    // Delete the session row
    const { error: deleteError } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id)

    if (deleteError) {
        return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
    }

    return NextResponse.json({ deleted: true })
}

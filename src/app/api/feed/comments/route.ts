import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase-server'
import { createNotification } from '../../../lib/notifications'
import { requireAuth } from '../../../lib/auth'

export async function GET(request: NextRequest) {
    const feedItemId = request.nextUrl.searchParams.get('feed_item_id')
    if (!feedItemId) {
        return NextResponse.json({ error: 'feed_item_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: comments, error } = await supabase
        .from('comments')
        .select('*, user_profiles(user_id, username, full_name, avatar_url)')
        .eq('feed_item_id', feedItemId)
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    return NextResponse.json(comments)
}

export async function POST(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const { feed_item_id, text } = await request.json()

    if (!feed_item_id || !text?.trim()) {
        return NextResponse.json({ error: 'feed_item_id and text are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: comment, error } = await supabase
        .from('comments')
        .insert({ feed_item_id, user_id: userId, text: text.trim() })
        .select('*, user_profiles(user_id, username, full_name, avatar_url)')
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    const { data: feedItem } = await supabase
        .from('feed_items')
        .select('actor_id')
        .eq('id', feed_item_id)
        .single()

    if (feedItem) {
        await createNotification(supabase, feedItem.actor_id, userId, 'comment', feed_item_id)
    }

    return NextResponse.json(comment, { status: 201 })
}

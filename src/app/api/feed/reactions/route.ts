import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '../../../lib/supabase-server'
import { createNotification } from '../../../lib/notifications'

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { feed_item_id } = await request.json()
    if (!feed_item_id) {
        return NextResponse.json({ error: 'feed_item_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('reactions')
        .insert({ feed_item_id, user_id: userId, type: 'like' })

    if (error) {
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Already liked' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 })
    }

    const { data: feedItem } = await supabase
        .from('feed_items')
        .select('actor_id')
        .eq('id', feed_item_id)
        .single()

    if (feedItem) {
        await createNotification(supabase, feedItem.actor_id, userId, 'like', feed_item_id)
    }

    return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { feed_item_id } = await request.json()
    if (!feed_item_id) {
        return NextResponse.json({ error: 'feed_item_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('feed_item_id', feed_item_id)
        .eq('user_id', userId)
        .eq('type', 'like')

    if (error) {
        return NextResponse.json({ error: 'Failed to remove reaction' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

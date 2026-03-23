import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '../../lib/supabase-server'
import { createNotification } from '../../lib/notifications'

const BACKFILL_LIMIT = 50

export async function GET(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const targetUserId = request.nextUrl.searchParams.get('user_id')
    if (!targetUserId) {
        return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const [followingRes, followersRes, isFollowingRes] = await Promise.all([
        supabase.from('user_follows').select('id', { count: 'exact', head: true }).eq('follower_id', targetUserId),
        supabase.from('user_follows').select('id', { count: 'exact', head: true }).eq('following_id', targetUserId),
        supabase.from('user_follows').select('id').eq('follower_id', userId).eq('following_id', targetUserId).maybeSingle(),
    ])

    return NextResponse.json({
        following_count: followingRes.count || 0,
        followers_count: followersRes.count || 0,
        is_following: !!isFollowingRes.data,
    })
}

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { following_id } = await request.json()
    if (!following_id) {
        return NextResponse.json({ error: 'following_id is required' }, { status: 400 })
    }

    if (following_id === userId) {
        return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: userId, following_id })

    if (error) {
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Already following' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Failed to follow' }, { status: 500 })
    }

    await createNotification(supabase, following_id, userId, 'follow')

    const { data: recentItems } = await supabase
        .from('feed_items')
        .select('actor_id, type, reference_id, created_at')
        .eq('user_id', following_id)
        .eq('actor_id', following_id)
        .order('created_at', { ascending: false })
        .limit(BACKFILL_LIMIT)

    if (recentItems && recentItems.length > 0) {
        const backfillRows = recentItems.map(item => ({
            user_id: userId,
            actor_id: item.actor_id,
            type: item.type,
            reference_id: item.reference_id,
            created_at: item.created_at,
        }))
        await supabase.from('feed_items').insert(backfillRows)
    }

    return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { following_id } = await request.json()
    if (!following_id) {
        return NextResponse.json({ error: 'following_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', following_id)

    if (error) {
        return NextResponse.json({ error: 'Failed to unfollow' }, { status: 500 })
    }

    await supabase
        .from('feed_items')
        .delete()
        .eq('user_id', userId)
        .eq('actor_id', following_id)

    return NextResponse.json({ success: true })
}

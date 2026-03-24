import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase-server'
import { requireAuth } from '../../lib/auth'
import { FEED_PAGE_SIZE } from '../../lib/constants'

export async function GET(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const cursor = request.nextUrl.searchParams.get('cursor')
    const scope = request.nextUrl.searchParams.get('scope') || 'all'

    const supabase = createAdminClient()

    let query = supabase
        .from('feed_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(FEED_PAGE_SIZE)

    if (scope === 'you') {
        query = query.eq('actor_id', userId)
    } else {
        query = query.eq('user_id', userId)
    }

    if (cursor) {
        query = query.lt('created_at', cursor)
    }

    const { data: feedItems, error } = await query

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
    }

    if (!feedItems || feedItems.length === 0) {
        return NextResponse.json({ items: [], nextCursor: null })
    }

    const referenceIds = feedItems.map(f => f.reference_id)
    const actorIds = [...new Set(feedItems.map(f => f.actor_id))]

    const [sessions, posts, spotGuides, forecasts, profiles, userReactions] = await Promise.all([
        supabase.from('sessions').select('*, spots(id, title, slug, image, locations(name))').in('id', referenceIds),
        supabase.from('user_posts').select('*').in('id', referenceIds),
        supabase.from('spot_guide_events').select('*, spots(id, title, slug, image)').in('id', referenceIds),
        supabase.from('forecast_events').select('*, spots(id, title, slug)').in('id', referenceIds),
        supabase.from('user_profiles').select('*').in('user_id', actorIds),
        supabase.from('reactions').select('feed_item_id').eq('user_id', userId).in('feed_item_id', feedItems.map(f => f.id)),
    ])

    const sessionMap = Object.fromEntries((sessions.data || []).map(s => [s.id, s]))
    const postMap = Object.fromEntries((posts.data || []).map(p => [p.id, p]))
    const spotGuideMap = Object.fromEntries((spotGuides.data || []).map(sg => [sg.id, sg]))
    const forecastMap = Object.fromEntries((forecasts.data || []).map(f => [f.id, f]))
    const profileMap = Object.fromEntries((profiles.data || []).map(p => [p.user_id, p]))
    const likedSet = new Set((userReactions.data || []).map(r => r.feed_item_id))

    const items = feedItems.map(fi => {
        let content = null
        switch (fi.type) {
            case 'session': content = sessionMap[fi.reference_id] || null; break
            case 'post': content = postMap[fi.reference_id] || null; break
            case 'spot_guide': content = spotGuideMap[fi.reference_id] || null; break
            case 'forecast': content = forecastMap[fi.reference_id] || null; break
        }
        return {
            ...fi,
            content,
            actor: profileMap[fi.actor_id] || null,
            liked: likedSet.has(fi.id),
        }
    })

    const nextCursor = feedItems.length === FEED_PAGE_SIZE
        ? feedItems[feedItems.length - 1].created_at
        : null

    return NextResponse.json({ items, nextCursor })
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase-server'
import { requireAuth } from '../../lib/auth'
import { NOTIFICATIONS_PAGE_SIZE } from '../../lib/constants'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const cursor = request.nextUrl.searchParams.get('cursor')

    const supabase = createAdminClient()

    let query = supabase
        .from('notifications')
        .select('*, user_profiles!notifications_actor_id_fkey(user_id, username, full_name, avatar_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(NOTIFICATIONS_PAGE_SIZE)

    if (cursor) {
        query = query.lt('created_at', cursor)
    }

    const { data, error } = await query

    if (error) {
        const fallbackQuery = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(NOTIFICATIONS_PAGE_SIZE)

        const { data: notifications } = cursor
            ? await fallbackQuery.lt('created_at', cursor)
            : await fallbackQuery

        if (notifications && notifications.length > 0) {
            const actorIds = [...new Set(notifications.map(n => n.actor_id))]
            const { data: profiles } = await supabase
                .from('user_profiles')
                .select('*')
                .in('user_id', actorIds)

            const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]))
            const items = notifications.map(n => ({ ...n, actor: profileMap[n.actor_id] || null }))

            const nextCursor = items.length === NOTIFICATIONS_PAGE_SIZE ? items[items.length - 1].created_at : null
            return NextResponse.json({ items, nextCursor })
        }

        return NextResponse.json({ items: [], nextCursor: null })
    }

    const items = (data || []).map(n => {
        const { user_profiles, ...rest } = n
        return { ...rest, actor: user_profiles || null }
    })

    const nextCursor = items.length === NOTIFICATIONS_PAGE_SIZE ? items[items.length - 1].created_at : null
    return NextResponse.json({ items, nextCursor })
}

export async function PATCH() {
    const { userId, response } = await requireAuth()
    if (response) return response

    const supabase = createAdminClient()

    await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

    return NextResponse.json({ success: true })
}

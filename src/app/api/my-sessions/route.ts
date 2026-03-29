import { NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase-server'
import { requireAuth } from '../../lib/auth'

export async function GET() {
    const { userId, response } = await requireAuth()
    if (response) return response

    const supabase = createAdminClient()

    const { data: sessions, error } = await supabase
        .from('sessions')
        .select('id, type, duration_minutes, max_speed_kts, max_hr, distance_km, notes, track_url, track_thumbnail_url, start_time, created_at, spots(id, title, slug, image, lat, lon, locations(name))')
        .eq('user_id', userId)
        .order('start_time', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }

    // Also fetch activity graph data (last 52 weeks)
    const since = new Date()
    since.setDate(since.getDate() - 364)

    const { data: activityRows } = await supabase
        .from('sessions')
        .select('created_at, start_time')
        .eq('user_id', userId)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: true })

    const activity: Record<string, number> = {}
    for (const row of activityRows || []) {
        const date = (row.start_time || row.created_at).slice(0, 10)
        activity[date] = (activity[date] || 0) + 1
    }

    return NextResponse.json({ sessions, activity })
}

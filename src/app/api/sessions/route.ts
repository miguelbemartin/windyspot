import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase-server'
import { fanoutToFollowers } from '../../lib/fanout'
import { requireAuth } from '../../lib/auth'
import { SPORT_TYPES } from '../../lib/constants'

export async function POST(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const body = await request.json()
    const { spot_id, type, duration_minutes, avg_wind_kts, max_speed_kts, distance_km, notes } = body

    if (!spot_id || !type) {
        return NextResponse.json({ error: 'spot_id and type are required' }, { status: 400 })
    }

    if (!SPORT_TYPES.includes(type)) {
        return NextResponse.json({ error: `type must be one of: ${SPORT_TYPES.join(', ')}` }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: session, error } = await supabase
        .from('sessions')
        .insert({
            user_id: userId,
            spot_id,
            type,
            duration_minutes: duration_minutes || null,
            avg_wind_kts: avg_wind_kts || null,
            max_speed_kts: max_speed_kts || null,
            distance_km: distance_km || null,
            notes: notes || null,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    await fanoutToFollowers(supabase, userId, 'session', session.id, session.created_at)

    return NextResponse.json(session, { status: 201 })
}

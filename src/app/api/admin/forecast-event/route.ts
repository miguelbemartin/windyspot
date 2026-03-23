import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '../../../lib/supabase-server'

const SYSTEM_ACTOR = 'system_windyspot'

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { spot_id, title, forecast_days } = await request.json()
    if (!spot_id || !title || !forecast_days) {
        return NextResponse.json({ error: 'spot_id, title, and forecast_days are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: event, error } = await supabase
        .from('forecast_events')
        .insert({ spot_id, title, forecast_days })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to create forecast event' }, { status: 500 })
    }

    const { data: allUsers } = await supabase
        .from('user_profiles')
        .select('user_id')

    if (allUsers && allUsers.length > 0) {
        const rows = allUsers.map(u => ({
            user_id: u.user_id,
            actor_id: SYSTEM_ACTOR,
            type: 'forecast',
            reference_id: event.id,
            created_at: event.created_at,
        }))
        await supabase.from('feed_items').insert(rows)
    }

    return NextResponse.json(event, { status: 201 })
}

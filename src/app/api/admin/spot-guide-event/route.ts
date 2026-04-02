import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase-server'
import { requireAdmin } from '../../../lib/auth'
import { SYSTEM_ACTOR } from '../../../lib/constants'

export async function POST(request: NextRequest) {
    const { userId, response } = await requireAdmin()
    if (response) return response

    const { spot_id, title, description, image_url } = await request.json()
    if (!spot_id || !title) {
        return NextResponse.json({ error: 'spot_id and title are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: event, error } = await supabase
        .from('spot_guide_events')
        .insert({ spot_id, title, description: description || null, image_url: image_url || null })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to create spot guide event' }, { status: 500 })
    }

    const { data: allUsers } = await supabase
        .from('user_profiles')
        .select('user_id')

    if (allUsers && allUsers.length > 0) {
        const rows = allUsers.map(u => ({
            user_id: u.user_id,
            actor_id: SYSTEM_ACTOR,
            type: 'spot_guide',
            reference_id: event.id,
            created_at: event.created_at,
        }))
        await supabase.from('feed_items').insert(rows)
    }

    return NextResponse.json(event, { status: 201 })
}

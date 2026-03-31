import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase-server'
import { requireAuth } from '../../../lib/auth'

export async function PUT(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const { location_text, location_lat, location_lon } = await request.json()

    const supabase = createAdminClient()
    const { error } = await supabase
        .from('user_profiles')
        .update({
            location_text: location_text || null,
            location_lat: location_lat ?? null,
            location_lon: location_lon ?? null,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

    if (error) {
        return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}

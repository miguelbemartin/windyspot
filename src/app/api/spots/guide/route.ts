import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase-server'
import { requireAuth } from '../../../lib/auth'

export async function PATCH(request: NextRequest) {
    const { response } = await requireAuth()
    if (response) return response

    const body = await request.json()
    const { id, spot_guide } = body

    if (!id) {
        return NextResponse.json({ error: 'Spot ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: spot, error } = await supabase
        .from('spots')
        .update({ spot_guide: spot_guide || null })
        .eq('id', id)
        .select('*')
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to update spot guide' }, { status: 500 })
    }

    return NextResponse.json(spot)
}

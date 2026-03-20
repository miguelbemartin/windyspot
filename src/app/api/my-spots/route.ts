import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '../../lib/supabase-server'

export async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('user_spots')
        .select('spot_id')
        .eq('user_id', userId)

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch spots' }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { spot_id } = await request.json()
    if (!spot_id) {
        return NextResponse.json({ error: 'spot_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
        .from('user_spots')
        .upsert({ user_id: userId, spot_id }, { onConflict: 'user_id,spot_id' })

    if (error) {
        return NextResponse.json({ error: 'Failed to add spot' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { spot_id } = await request.json()
    if (!spot_id) {
        return NextResponse.json({ error: 'spot_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
        .from('user_spots')
        .delete()
        .eq('user_id', userId)
        .eq('spot_id', spot_id)

    if (error) {
        return NextResponse.json({ error: 'Failed to remove spot' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}

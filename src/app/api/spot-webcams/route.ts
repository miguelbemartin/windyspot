import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase-server'
import { requireAuth } from '../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const spotId = request.nextUrl.searchParams.get('spot_id')
    if (!spotId) {
        return NextResponse.json({ error: 'spot_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: webcams, error } = await supabase
        .from('spot_webcams')
        .select('*')
        .eq('spot_id', spotId)
        .order('sort_order')
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch webcams' }, { status: 500 })
    }

    return NextResponse.json(webcams)
}

export async function POST(request: NextRequest) {
    const { response } = await requireAuth()
    if (response) return response

    const body = await request.json()
    const { spot_id, type, url, title } = body

    if (!spot_id || !type || !url) {
        return NextResponse.json({ error: 'spot_id, type, and url are required' }, { status: 400 })
    }

    const validTypes = ['youtube', 'image', 'iframe']
    if (!validTypes.includes(type)) {
        return NextResponse.json({ error: `type must be one of: ${validTypes.join(', ')}` }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: webcam, error } = await supabase
        .from('spot_webcams')
        .insert({
            spot_id: parseInt(spot_id),
            type,
            url: url.trim(),
            title: title?.trim() || null,
        })
        .select('*')
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to save webcam', details: error.message }, { status: 500 })
    }

    return NextResponse.json(webcam, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const { response } = await requireAuth()
    if (response) return response

    const { id } = await request.json()
    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('spot_webcams')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: 'Failed to delete webcam' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

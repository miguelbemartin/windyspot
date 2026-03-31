import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const limit = searchParams.get('limit')

    if (!lat || !lon) {
        return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase.rpc('nearby_spots', {
        user_lat: parseFloat(lat),
        user_lon: parseFloat(lon),
        max_results: limit ? parseInt(limit, 10) : 10,
    })

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch nearby spots' }, { status: 500 })
    }

    return NextResponse.json(data)
}

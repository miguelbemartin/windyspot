import { NextResponse } from 'next/server'
import { getLocations } from '../../lib/spots'

export async function GET() {
    const locations = await getLocations()
    return NextResponse.json(locations)
}

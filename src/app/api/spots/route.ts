import { NextResponse } from 'next/server'
import { getSpots } from '../../lib/spots'

export async function GET() {
    const spots = await getSpots()
    return NextResponse.json(spots)
}

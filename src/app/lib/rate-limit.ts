import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const hits = new Map<string, number[]>()

export async function rateLimit(
    key: string,
    { limit = 100, windowMs = 60_000 } = {}
): Promise<NextResponse | null> {
    const { userId } = await auth()
    if (userId) return null

    const now = Date.now()
    const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs)
    timestamps.push(now)
    hits.set(key, timestamps)

    if (timestamps.length > limit) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil(windowMs / 1000)) } }
        )
    }
    return null
}

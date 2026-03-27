import { NextResponse } from 'next/server'

const hits = new Map<string, number[]>()

export function rateLimit(
    key: string,
    { limit = 30, windowMs = 60_000 } = {}
): NextResponse | null {
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

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../lib/rate-limit'

const ALLOWED_URLS: Record<string, string> = {
  'elmedano': 'https://cdn.skylinewebcams.com/live427.jpg',
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const limited = rateLimit(`webcam:${ip}`, { limit: 20, windowMs: 60_000 })
  if (limited) return limited

  const cam = request.nextUrl.searchParams.get('cam')
  if (!cam || !ALLOWED_URLS[cam]) {
    return NextResponse.json({ error: 'Invalid camera' }, { status: 400 })
  }

  const res = await fetch(ALLOWED_URLS[cam], {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 502 })
  }

  const buffer = await res.arrayBuffer()
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=300',
    },
  })
}

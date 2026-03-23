import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, importPKCS8 } from 'jose'

async function getWeatherKitToken() {
    const teamId = process.env.APPLE_TEAM_ID!
    const keyId = process.env.APPLE_WEATHERKIT_KEY_ID!
    const serviceId = process.env.APPLE_WEATHERKIT_SERVICE_ID!
    const privateKeyPem = process.env.APPLE_WEATHERKIT_PRIVATE_KEY!.replace(/\\n/g, '\n')

    const privateKey = await importPKCS8(privateKeyPem, 'ES256')

    const now = Math.floor(Date.now() / 1000)
    const token = await new SignJWT({})
        .setProtectedHeader({ alg: 'ES256', kid: keyId, id: `${teamId}.${serviceId}` })
        .setIssuer(teamId)
        .setSubject(serviceId)
        .setIssuedAt(now)
        .setExpirationTime(now + 3600)
        .sign(privateKey)

    return token
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
        return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 })
    }

    try {
        const token = await getWeatherKitToken()

        const dataSets = searchParams.get('dataSets') || 'currentWeather'

        const now = new Date()
        const end = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000)
        const hourlyParams = dataSets.includes('forecastHourly')
            ? `&hourlyStart=${now.toISOString()}&hourlyEnd=${end.toISOString()}`
            : ''

        const res = await fetch(
            `https://weatherkit.apple.com/api/v1/weather/en/${lat}/${lon}?dataSets=${dataSets}${hourlyParams}`,
            {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 600 },
            }
        )

        if (!res.ok) {
            const text = await res.text()
            return NextResponse.json({ error: 'WeatherKit request failed', detail: text }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('WeatherKit error:', message)
        return NextResponse.json({ error: 'Failed to fetch weather', detail: message }, { status: 500 })
    }
}

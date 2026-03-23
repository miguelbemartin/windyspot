'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

import NavbarLight from '../components/navbar/navbar-light'
import WeatherForecastTable from '../components/weather-forecast-table'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { FaLocationDot, FaWind, FaTemperatureHalf, FaDroplet, FaEye, FaCompass, FaCloudSun, FaGauge } from 'react-icons/fa6'
import { WiSunrise, WiSunset, WiCloudDown } from 'react-icons/wi'

const DEFAULT_SPOT_IMAGE = 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/akira-hojo-ZxGdri2EWzk-unsplash.jpg'

interface NearbySpot {
    id: number
    slug: string
    title: string
    image: string
    lat: number
    lon: number
    distance_km: number
    location_name: string
    windguru_forecast_id: string | null
    windguru_live_station_id: string | null
}

interface CurrentWeather {
    asOf: string
    conditionCode: string
    daylight: boolean
    humidity: number
    precipitationIntensity: number
    pressure: number
    pressureTrend: string
    temperature: number
    temperatureApparent: number
    temperatureDewPoint: number
    uvIndex: number
    visibility: number
    windDirection: number
    windGust: number
    windSpeed: number
    cloudCover: number
}

interface HourlyData {
    forecastStart: string
    temperature: number
    windSpeed: number
    windGust: number
    windDirection: number
    precipitationChance: number
    conditionCode: string
    daylight: boolean
    humidity: number
    cloudCover: number
}

interface SpotDayForecast {
    spotId: number
    spotTitle: string
    spotSlug: string
    windMax: number
    gustMax: number
    windDir: number
    isWindsurfable: boolean
    conditionCode: string
}

interface DayWindAlert {
    dateKey: string
    shortLabel: string
    spots: SpotDayForecast[]
    hasWind: boolean
    conditionCode: string
}

function conditionLabel(code: string): string {
    const map: Record<string, string> = {
        Clear: 'Clear', MostlyClear: 'Mostly Clear', PartlyCloudy: 'Partly Cloudy',
        MostlyCloudy: 'Mostly Cloudy', Cloudy: 'Cloudy', Haze: 'Haze', Foggy: 'Foggy',
        ScatteredThunderstorms: 'Scattered Thunderstorms', Breezy: 'Breezy', Windy: 'Windy',
        Drizzle: 'Drizzle', HeavyRain: 'Heavy Rain', Rain: 'Rain', Flurries: 'Flurries',
        HeavySnow: 'Heavy Snow', Snow: 'Snow', Sleet: 'Sleet',
        FreezingDrizzle: 'Freezing Drizzle', FreezingRain: 'Freezing Rain',
        Thunderstorms: 'Thunderstorms', StrongStorms: 'Strong Storms',
        SmokyHaze: 'Smoky Haze', BlowingDust: 'Blowing Dust',
        TropicalStorm: 'Tropical Storm', Hurricane: 'Hurricane',
    }
    return map[code] || code
}

function conditionIcon(code: string): string {
    const map: Record<string, string> = {
        Clear: '☀️', MostlyClear: '🌤️', PartlyCloudy: '⛅',
        MostlyCloudy: '🌥️', Cloudy: '☁️', Rain: '🌧️', HeavyRain: '🌧️',
        Drizzle: '🌦️', Thunderstorms: '⛈️', ScatteredThunderstorms: '⛈️',
        Snow: '🌨️', HeavySnow: '🌨️', Flurries: '🌨️',
        Foggy: '🌫️', Haze: '🌫️', Windy: '💨', Breezy: '💨',
    }
    return map[code] || '🌤️'
}

function windDirectionLabel(deg: number): string {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return dirs[Math.round(deg / 22.5) % 16]
}

function kphToKnots(kph: number): number {
    return Math.round(kph / 1.852)
}

function pressureTrendLabel(trend: string): string {
    if (trend === 'rising') return 'Rising'
    if (trend === 'falling') return 'Falling'
    return 'Steady'
}

const windStops: [number, number, number, number][] = [
    [0, 255, 255, 255], [5, 255, 255, 255], [8.9, 103, 247, 241],
    [13.5, 0, 255, 0], [18.8, 255, 240, 0], [24.7, 255, 50, 44],
    [31.7, 255, 10, 200], [38, 255, 0, 255], [45, 150, 50, 255],
    [60, 60, 60, 255], [70, 0, 0, 255],
]

function windColor(knots: number): string {
    if (knots <= 0) return 'rgb(255,255,255)'
    if (knots >= 70) return 'rgb(0,0,255)'
    let lo = windStops[0], hi = windStops[1]
    for (let i = 1; i < windStops.length; i++) {
        if (knots <= windStops[i][0]) { lo = windStops[i - 1]; hi = windStops[i]; break }
    }
    const t = (knots - lo[0]) / (hi[0] - lo[0])
    const r = Math.round(lo[1] + t * (hi[1] - lo[1]))
    const g = Math.round(lo[2] + t * (hi[2] - lo[2]))
    const b = Math.round(lo[3] + t * (hi[3] - lo[3]))
    return `rgb(${r},${g},${b})`
}

function buildSpotDayForecasts(spot: NearbySpot, hours: HourlyData[]): { dateKey: string; forecast: SpotDayForecast }[] {
    const dayMap = new Map<string, HourlyData[]>()
    const dayOrder: string[] = []
    for (const h of hours) {
        const key = new Date(h.forecastStart).toDateString()
        if (!dayMap.has(key)) { dayMap.set(key, []); dayOrder.push(key) }
        dayMap.get(key)!.push(h)
    }
    return dayOrder.map(key => {
        const dh = dayMap.get(key)!
        const windMax = kphToKnots(Math.max(...dh.map(h => h.windSpeed)))
        const gustMax = kphToKnots(Math.max(...dh.map(h => h.windGust)))
        const isWindsurfable = dh.some(h => kphToKnots(h.windSpeed) >= 6 && kphToKnots(h.windGust) > 10)
        const peakHour = dh.reduce((best, h) => h.windSpeed > best.windSpeed ? h : best, dh[0])
        const peakDir = peakHour.windDirection
        const condCounts = new Map<string, number>()
        for (const h of dh) { condCounts.set(h.conditionCode, (condCounts.get(h.conditionCode) || 0) + 1) }
        let topCond = 'Clear'; let topCount = 0
        for (const [code, count] of condCounts) { if (count > topCount) { topCond = code; topCount = count } }
        return {
            dateKey: key,
            forecast: {
                spotId: spot.id,
                spotTitle: spot.title,
                spotSlug: spot.slug,
                windMax,
                gustMax,
                windDir: peakDir,
                isWindsurfable,
                conditionCode: topCond,
            },
        }
    })
}

function buildDayAlerts(allSpotForecasts: { dateKey: string; forecast: SpotDayForecast }[][]): DayWindAlert[] {
    const dayMap = new Map<string, SpotDayForecast[]>()
    const dayOrder: string[] = []
    for (const spotDays of allSpotForecasts) {
        for (const { dateKey, forecast } of spotDays) {
            if (!dayMap.has(dateKey)) { dayMap.set(dateKey, []); dayOrder.push(dateKey) }
            dayMap.get(dateKey)!.push(forecast)
        }
    }
    const today = new Date()
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
    return dayOrder.map(key => {
        const spots = dayMap.get(key)!
        const d = new Date(key)
        const isToday = d.toDateString() === today.toDateString()
        const isTomorrow = d.toDateString() === tomorrow.toDateString()
        const condCounts = new Map<string, number>()
        for (const s of spots) { condCounts.set(s.conditionCode, (condCounts.get(s.conditionCode) || 0) + 1) }
        let topCond = 'Clear'; let topCount = 0
        for (const [code, count] of condCounts) { if (count > topCount) { topCond = code; topCount = count } }
        return {
            dateKey: key,
            shortLabel: isToday ? 'Today' : isTomorrow ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
            spots,
            hasWind: spots.some(s => s.isWindsurfable),
            conditionCode: topCond,
        }
    })
}

export default function ForecastPage() {
    const { user, isLoaded } = useUser()
    const [spots, setSpots] = useState<NearbySpot[]>([])
    const [weather, setWeather] = useState<CurrentWeather | null>(null)
    const [dayAlerts, setDayAlerts] = useState<DayWindAlert[]>([])
    const [alertsLoading, setAlertsLoading] = useState(true)
    const [weatherLoading, setWeatherLoading] = useState(true)
    const [loading, setLoading] = useState(true)
    const [noLocation, setNoLocation] = useState(false)
    const [locationText, setLocationText] = useState('')
    const [userLat, setUserLat] = useState<number | null>(null)
    const [userLon, setUserLon] = useState<number | null>(null)

    useEffect(() => {
        if (!isLoaded) return

        const locationMeta = (user?.unsafeMetadata as Record<string, unknown>)?.location as
            { text?: string; lat?: number; lon?: number } | undefined

        if (!locationMeta?.lat || !locationMeta?.lon) {
            setNoLocation(true)
            setLoading(false)
            setWeatherLoading(false)
            return
        }

        const lat = locationMeta.lat
        const lon = locationMeta.lon
        setLocationText(locationMeta.text || '')
        setUserLat(lat)
        setUserLon(lon)

        async function loadAll() {
            const [spotsRes, weatherRes] = await Promise.all([
                fetch(`/api/spots/nearby?lat=${lat}&lon=${lon}&limit=5`).then(r => r.ok ? r.json() : []).catch(() => []),
                fetch(`/api/weather?lat=${lat}&lon=${lon}&dataSets=currentWeather`).then(r => r.ok ? r.json() : null).catch(() => null),
            ])

            setSpots(spotsRes)
            setLoading(false)

            if (weatherRes?.currentWeather) setWeather(weatherRes.currentWeather)
            setWeatherLoading(false)

            console.log('Spots loaded:', spotsRes.length)

            if (spotsRes.length > 0) {
                const allForecasts = await Promise.all(
                    spotsRes.map((spot: NearbySpot) =>
                        fetch(`/api/weather?lat=${spot.lat}&lon=${spot.lon}&dataSets=forecastHourly`)
                            .then(r => {
                                console.log(`Weather fetch ${spot.title}: status=${r.status}`)
                                return r.ok ? r.json() : null
                            })
                            .then(data => {
                                if (data?.forecastHourly?.hours) {
                                    const forecasts = buildSpotDayForecasts(spot, data.forecastHourly.hours)
                                    console.log(`${spot.title}: ${data.forecastHourly.hours.length} hours, ${forecasts.filter(f => f.forecast.isWindsurfable).length} windsurfable days`)
                                    return forecasts
                                }
                                console.log(`${spot.title}: no hourly data`)
                                return []
                            })
                            .catch((err) => { console.error(`Weather error ${spot.title}:`, err); return [] as { dateKey: string; forecast: SpotDayForecast }[] })
                    )
                )
                const alerts = buildDayAlerts(allForecasts)
                console.log('Day alerts:', alerts.length, alerts.map(a => `${a.shortLabel}: ${a.hasWind ? 'WIND' : 'no wind'} (${a.spots.filter(s => s.isWindsurfable).map(s => s.spotTitle).join(', ')})`))
                setDayAlerts(alerts)
                console.log('dayAlerts state set, alertsLoading about to be set false')
            }
            setAlertsLoading(false)
            console.log('alertsLoading set to false')
        }

        loadAll()
    }, [isLoaded, user])

    return (
        <>
            <NavbarLight />

            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10 col-lg-11 col-md-12">

                            <div className="mb-4 mt-5">
                                <h3 className="fw-bold">Forecast</h3>
                                <p className="text-muted">
                                    {locationText
                                        ? <>Current conditions in <strong>{locationText}</strong></>
                                        : 'Wind forecast for the spots closest to you.'}
                                </p>
                            </div>

                            {noLocation ? (
                                <div className="text-center py-5">
                                    <FaLocationDot className="text-muted mb-3" size={32} />
                                    <h5>Set your location to see nearby forecasts</h5>
                                    <p className="text-muted">Go to your <Link href="/profile" className="text-primary">profile</Link> and add your location.</p>
                                </div>
                            ) : (
                                <>
                                    <h5 className="fw-semibold mb-3">Current Weather</h5>
                                    {weatherLoading ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center mb-4" style={{ minHeight: '160px' }}>
                                            <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                            <div className="text-muted mt-1" style={{ fontSize: '12px' }}>Loading current weather...</div>
                                        </div>
                                    ) : weather ? (
                                        <div className="card rounded-3 border-0 shadow-sm mb-4">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <div>
                                                        <h5 className="mb-1 d-flex align-items-center gap-2">
                                                            <FaCloudSun className="text-warning" />
                                                            {conditionLabel(weather.conditionCode)}
                                                        </h5>
                                                        <small className="text-muted">
                                                            Updated {new Date(weather.asOf).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </small>
                                                    </div>
                                                    <div className="text-end">
                                                        <span className="display-6 fw-bold">{Math.round(weather.temperature)}°C</span>
                                                        <div className="text-muted" style={{ fontSize: '13px' }}>
                                                            Feels like {Math.round(weather.temperatureApparent)}°C
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row g-3">
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaWind className="text-primary" />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Wind</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{kphToKnots(weather.windSpeed)} kts</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaWind className="text-danger" />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Gusts</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{kphToKnots(weather.windGust)} kts</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaCompass className="text-info" />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Direction</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{windDirectionLabel(weather.windDirection)} ({Math.round(weather.windDirection)}°)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaDroplet className="text-primary" />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Humidity</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{Math.round(weather.humidity * 100)}%</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaGauge className="text-secondary" />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Pressure</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{Math.round(weather.pressure)} hPa</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaTemperatureHalf className="text-warning" />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Pressure Trend</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{pressureTrendLabel(weather.pressureTrend)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaEye className="text-muted" />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Visibility</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{Math.round(weather.visibility / 1000)} km</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <WiCloudDown className="text-info" size={20} />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Cloud Cover</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{Math.round(weather.cloudCover * 100)}%</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaTemperatureHalf className="text-info" />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Dew Point</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{Math.round(weather.temperatureDewPoint)}°C</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <WiSunrise className="text-warning" size={20} />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>UV Index</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{weather.uvIndex}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <WiCloudDown className="text-secondary" size={20} />
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Precipitation</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{weather.precipitationIntensity} mm/h</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            {weather.daylight ? <WiSunrise className="text-warning" size={20} /> : <WiSunset className="text-secondary" size={20} />}
                                                            <div>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>Daylight</div>
                                                                <div className="fw-semibold" style={{ fontSize: '14px' }}>{weather.daylight ? 'Daytime' : 'Nighttime'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <h5 className="fw-semibold mb-3">Wind Outlook</h5>
                                    {alertsLoading ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center mb-4" style={{ minHeight: '100px' }}>
                                            <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                            <div className="text-muted mt-1" style={{ fontSize: '12px' }}>Checking wind conditions...</div>
                                        </div>
                                    ) : dayAlerts.length > 0 ? (
                                        <div className="row g-2 mb-4">
                                                {dayAlerts.map((day) => {
                                                    const windSpots = day.spots.filter(s => s.isWindsurfable)
                                                    return (
                                                        <div key={day.dateKey} className="col-12 col-md-4 col-lg-3 col-xl-2">
                                                            <div
                                                                className="card border-0 shadow-sm h-100"
                                                                style={{
                                                                    borderRadius: '10px',
                                                                    borderLeft: day.hasWind ? '3px solid #4aad4e' : '3px solid #ddd',
                                                                }}
                                                            >
                                                                <div className="card-body p-2">
                                                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                                                        <span className="fw-semibold" style={{ fontSize: '12px' }}>{day.shortLabel}</span>
                                                                        <span style={{ fontSize: '14px' }}>{conditionIcon(day.conditionCode)}</span>
                                                                    </div>
                                                                    {day.hasWind ? (
                                                                        <div className="d-flex flex-column gap-1">
                                                                            {windSpots.map(s => (
                                                                                <Link
                                                                                    key={s.spotId}
                                                                                    href={`/spots/${s.spotSlug}`}
                                                                                    className="text-decoration-none"
                                                                                >
                                                                                    <div className="d-flex align-items-center justify-content-between rounded px-1 py-1" style={{ background: '#f8f9fa', fontSize: '11px' }}>
                                                                                        <span className="fw-medium text-dark text-truncate me-1">{s.spotTitle}</span>
                                                                                        <div className="d-flex align-items-center gap-1 flex-shrink-0">
                                                                                            <span className="fw-bold px-1 rounded" style={{ background: windColor(s.windMax), color: s.windMax > 18.8 ? '#fff' : '#333', fontSize: '10px' }}>
                                                                                                {s.windMax}
                                                                                            </span>
                                                                                            <span className="fw-bold px-1 rounded" style={{ background: windColor(s.gustMax), color: s.gustMax > 18.8 ? '#fff' : '#333', fontSize: '10px' }}>
                                                                                                {s.gustMax}
                                                                                            </span>
                                                                                            <span style={{ display: 'inline-block', transform: `rotate(${s.windDir + 180}deg)`, fontSize: '10px', lineHeight: 1 }}>↑</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-muted" style={{ fontSize: '10px' }}>No wind</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                    ) : (
                                        <div className="text-muted mb-4" style={{ fontSize: '13px' }}>No wind expected nearby.</div>
                                    )}

                                    <h5 className="fw-semibold mb-3">Nearby Spots</h5>
                                    {loading ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center mb-4" style={{ minHeight: '100px' }}>
                                            <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                            <div className="text-muted mt-1" style={{ fontSize: '12px' }}>Finding nearby spots...</div>
                                        </div>
                                    ) : spots.length === 0 ? (
                                        <div className="text-muted mb-4" style={{ fontSize: '13px' }}>No spots found nearby.</div>
                                    ) : (
                                        <>
                                            <div className="d-flex flex-column gap-4">
                                                {spots.map((spot) => (
                                                    <div key={spot.id} className="card rounded-3 border-0 shadow-sm overflow-hidden">
                                                        <div className="position-relative" style={{ height: '120px' }}>
                                                            <Image
                                                                src={spot.image || DEFAULT_SPOT_IMAGE}
                                                                fill
                                                                sizes="100vw"
                                                                className="object-fit-cover"
                                                                alt={spot.title}
                                                            />
                                                            <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                                                                <h6 className="mb-0 text-white fw-semibold">
                                                                    <Link href={`/spots/${spot.slug}`} className="text-white text-decoration-none">{spot.title}</Link>
                                                                </h6>
                                                                <span className="text-white" style={{ fontSize: '12px', opacity: 0.85 }}>
                                                                    <FaLocationDot className="me-1" />{spot.location_name} &middot; {Math.round(spot.distance_km)} km away
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="card-body p-3">
                                                            <WeatherForecastTable lat={spot.lat} lon={spot.lon} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <BackToTop />
        </>
    )
}

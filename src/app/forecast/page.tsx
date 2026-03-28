'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

import NavbarLight from '../components/navbar/navbar-light'
import WeatherForecastTable from '../components/weather-forecast-table'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { FaLocationDot, FaWind, FaTemperatureHalf, FaDroplet, FaEye, FaCompass, FaCloudSun, FaGauge } from 'react-icons/fa6'
import { WiSunrise, WiSunset, WiCloudDown } from 'react-icons/wi'
import { BsSearch, BsGeoAlt, BsXCircle } from 'react-icons/bs'
import ForecastPromo from '../components/forecast-promo'

interface NominatimResult {
    display_name: string
    lat: string
    lon: string
}

const SESSION_KEY = 'windyspot_forecast_location'

function getSavedLocation(): { text: string; lat: number; lon: number } | null {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY)
        if (!raw) return null
        return JSON.parse(raw)
    } catch { return null }
}

function saveLocation(loc: { text: string; lat: number; lon: number }) {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(loc)) } catch {}
}

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

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([])
    const [searching, setSearching] = useState(false)
    const [geolocating, setGeolocating] = useState(false)

    const loadForecast = useCallback(async (lat: number, lon: number, text: string) => {
        setLocationText(text)
        setUserLat(lat)
        setUserLon(lon)
        setNoLocation(false)
        setLoading(true)
        setWeatherLoading(true)
        setAlertsLoading(true)
        setSpots([])
        setWeather(null)
        setDayAlerts([])

        const [spotsRes, weatherRes] = await Promise.all([
            fetch(`/api/spots/nearby?lat=${lat}&lon=${lon}&limit=5`).then(r => r.ok ? r.json() : []).catch(() => []),
            fetch(`/api/weather?lat=${lat}&lon=${lon}&dataSets=currentWeather`).then(r => r.ok ? r.json() : null).catch(() => null),
        ])

        const nearbySpots = spotsRes.filter((s: NearbySpot) => s.distance_km <= 70)
        setSpots(nearbySpots)
        setLoading(false)

        if (weatherRes?.currentWeather) setWeather(weatherRes.currentWeather)
        setWeatherLoading(false)

        if (nearbySpots.length > 0) {
            const allForecasts = await Promise.all(
                nearbySpots.map((spot: NearbySpot) =>
                    fetch(`/api/weather?lat=${spot.lat}&lon=${spot.lon}&dataSets=forecastHourly`)
                        .then(r => r.ok ? r.json() : null)
                        .then(data => {
                            if (data?.forecastHourly?.hours) {
                                return buildSpotDayForecasts(spot, data.forecastHourly.hours)
                            }
                            return []
                        })
                        .catch(() => [] as { dateKey: string; forecast: SpotDayForecast }[])
                )
            )
            const alerts = buildDayAlerts(allForecasts)
            setDayAlerts(alerts)
        }
        setAlertsLoading(false)
    }, [])

    function handleLocationSelect(result: NominatimResult) {
        const loc = {
            text: result.display_name.split(',').slice(0, 2).join(',').trim(),
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
        }
        saveLocation(loc)
        setSearchResults([])
        setSearchQuery('')
        loadForecast(loc.lat, loc.lon, loc.text)
    }

    async function handleSearch() {
        const q = searchQuery.trim()
        if (!q) return
        setSearching(true)
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`,
                { headers: { 'Accept-Language': 'en' } }
            )
            if (res.ok) setSearchResults(await res.json())
        } catch {}
        setSearching(false)
    }

    function handleGeolocate() {
        if (!navigator.geolocation) return
        setGeolocating(true)
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords
                let text = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                        { headers: { 'Accept-Language': 'en' } }
                    )
                    if (res.ok) {
                        const data = await res.json()
                        const addr = data.address
                        text = [addr?.city || addr?.town || addr?.village, addr?.country].filter(Boolean).join(', ') || text
                    }
                } catch {}
                const loc = { text, lat: latitude, lon: longitude }
                saveLocation(loc)
                setGeolocating(false)
                loadForecast(loc.lat, loc.lon, loc.text)
            },
            () => { setGeolocating(false) },
            { enableHighAccuracy: false, timeout: 10000 }
        )
    }

    function clearLocation() {
        try { sessionStorage.removeItem(SESSION_KEY) } catch {}
        setNoLocation(true)
        setSpots([])
        setWeather(null)
        setDayAlerts([])
        setLocationText('')
        setUserLat(null)
        setUserLon(null)
    }

    useEffect(() => {
        // Try sessionStorage first (works for both logged-in and anonymous)
        const saved = getSavedLocation()
        if (saved) {
            loadForecast(saved.lat, saved.lon, saved.text)
            return
        }

        // For logged-in users, try profile location
        if (!isLoaded) return

        const locationMeta = (user?.unsafeMetadata as Record<string, unknown>)?.location as
            { text?: string; lat?: number; lon?: number } | undefined

        if (locationMeta?.lat && locationMeta?.lon) {
            loadForecast(locationMeta.lat, locationMeta.lon, locationMeta.text || '')
            return
        }

        // No location found
        setNoLocation(true)
        setLoading(false)
        setWeatherLoading(false)
        setAlertsLoading(false)
    }, [isLoaded, user, loadForecast])

    return (
        <>
            <NavbarLight />

            {noLocation ? (
                <>
                    <div className='bg-light'>
                        <ForecastPromo />
                    </div>

                    <div className="container mt-5 pb-5">
                        <div className="row justify-content-center">
                            <div className="col-xl-7 col-lg-8 col-md-10 col-12 text-center">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-8">
                                        <div className="input-group mb-3">
                                            <input
                                                type="text"
                                                className="form-control rounded-start-pill border-0 bg-light ps-4"
                                                placeholder="Search a location..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                                            />
                                            <button
                                                className="btn btn-primary rounded-end-pill d-flex align-items-center gap-1"
                                                onClick={handleSearch}
                                                disabled={searching || !searchQuery.trim()}
                                            >
                                                <BsSearch size={14} />
                                                {searching ? 'Searching...' : 'Search'}
                                            </button>
                                        </div>

                                        <button
                                            className="btn btn-outline-secondary rounded-pill btn-sm d-inline-flex align-items-center gap-1"
                                            onClick={handleGeolocate}
                                            disabled={geolocating}
                                        >
                                            <BsGeoAlt size={14} />
                                            {geolocating ? 'Locating...' : 'Use my current location'}
                                        </button>

                                        {searchResults.length > 0 && (
                                            <div className="list-group mt-3 text-start">
                                                {searchResults.map((r, i) => (
                                                    <button
                                                        key={i}
                                                        className="list-group-item list-group-item-action d-flex align-items-center gap-2"
                                                        onClick={() => handleLocationSelect(r)}
                                                    >
                                                        <FaLocationDot className="text-primary flex-shrink-0" size={14} />
                                                        <span className="text-truncate">{r.display_name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10 col-lg-11 col-md-12">

                                    {weatherLoading ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center mb-4 mt-3" style={{ minHeight: '160px' }}>
                                            <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                            <div className="text-muted mt-1" style={{ fontSize: '12px' }}>Loading current weather...</div>
                                        </div>
                                    ) : weather ? (
                                        <div className="card rounded-3 border-0 shadow-sm mb-4 mt-3">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <div>
                                                        <p className="d-flex align-items-center gap-2 flex-wrap">{locationText
                                                            ? <>Current conditions in <strong>{locationText}</strong>
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-1"
                                                                    onClick={clearLocation}
                                                                    style={{ fontSize: '12px' }}
                                                                >
                                                                    <BsXCircle size={10} /> Change
                                                                </button>
                                                            </>
                                                            : 'Wind forecast for the spots closest to you.'}
                                                        </p>
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

                        </div>
                    </div>
                </div>
            </section>
            )}

            <Footer />
            <BackToTop />
        </>
    )
}

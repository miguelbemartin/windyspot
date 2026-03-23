'use client'

import { useState, useEffect } from 'react'

interface HourlyForecast {
    forecastStart: string
    temperature: number
    temperatureApparent: number
    humidity: number
    windSpeed: number
    windGust: number
    windDirection: number
    precipitationChance: number
    precipitationIntensity: number
    pressure: number
    cloudCover: number
    conditionCode: string
    daylight: boolean
}

interface Column {
    hourLabel: string
    wind: number
    gusts: number
    windDir: number
    temp: number
    humidity: number
    rainChance: number
    pressure: number
    cloudCover: number
    conditionCode: string
    daylight: boolean
    dayIndex: number
    isFirstOfDay: boolean
}

interface WeatherForecastTableProps {
    lat: number
    lon: number
}

function kphToKnots(kph: number): number {
    return Math.round(kph / 1.852)
}

function windDirectionLabel(deg: number): string {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return dirs[Math.round(deg / 22.5) % 16]
}

const windStops: [number, number, number, number][] = [
    [0, 255, 255, 255],
    [5, 255, 255, 255],
    [8.9, 103, 247, 241],
    [13.5, 0, 255, 0],
    [18.8, 255, 240, 0],
    [24.7, 255, 50, 44],
    [31.7, 255, 10, 200],
    [38, 255, 0, 255],
    [45, 150, 50, 255],
    [60, 60, 60, 255],
    [70, 0, 0, 255],
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

function windTextColor(knots: number): string {
    if (knots <= 5) return '#333'
    if (knots <= 13.5) return '#155'
    if (knots <= 24.7) return '#333'
    return '#fff'
}

function conditionIcon(code: string, daylight: boolean): string {
    const map: Record<string, string> = {
        Clear: daylight ? '☀️' : '🌙',
        MostlyClear: daylight ? '🌤️' : '🌙',
        PartlyCloudy: daylight ? '⛅' : '☁️',
        MostlyCloudy: '🌥️',
        Cloudy: '☁️',
        Rain: '🌧️',
        HeavyRain: '🌧️',
        Drizzle: '🌦️',
        Thunderstorms: '⛈️',
        ScatteredThunderstorms: '⛈️',
        Snow: '🌨️',
        HeavySnow: '🌨️',
        Flurries: '🌨️',
        Foggy: '🌫️',
        Haze: '🌫️',
        Windy: '💨',
        Breezy: '💨',
    }
    return map[code] || '🌤️'
}

function directionArrow(deg: number): string {
    const arrows = ['↓', '↙', '←', '↖', '↑', '↗', '→', '↘']
    return arrows[Math.round(deg / 45) % 8]
}

function avgDir(hours: HourlyForecast[]): number {
    let sinSum = 0, cosSum = 0
    for (const h of hours) {
        const rad = h.windDirection * Math.PI / 180
        sinSum += Math.sin(rad)
        cosSum += Math.cos(rad)
    }
    let avg = Math.atan2(sinSum, cosSum) * 180 / Math.PI
    if (avg < 0) avg += 360
    return avg
}

function buildColumns(hours: HourlyForecast[]): { dayLabels: { label: string; colSpan: number }[]; columns: Column[] } {
    const dayMap = new Map<string, HourlyForecast[]>()
    const dayOrder: string[] = []
    for (const h of hours) {
        const d = new Date(h.forecastStart)
        const dayKey = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
        if (!dayMap.has(dayKey)) {
            dayMap.set(dayKey, [])
            dayOrder.push(dayKey)
        }
        dayMap.get(dayKey)!.push(h)
    }

    const columns: Column[] = []
    const dayLabels: { label: string; colSpan: number }[] = []

    dayOrder.forEach((dayKey, dayIndex) => {
        const dayHours = dayMap.get(dayKey)!
        const isCompact = dayIndex >= 5

        if (!isCompact) {
            dayLabels.push({ label: dayKey, colSpan: dayHours.length })
            dayHours.forEach((h, hi) => {
                columns.push({
                    hourLabel: new Date(h.forecastStart).getHours().toString().padStart(2, '0'),
                    wind: kphToKnots(h.windSpeed),
                    gusts: kphToKnots(h.windGust),
                    windDir: h.windDirection,
                    temp: Math.round(h.temperature),
                    humidity: Math.round(h.humidity * 100),
                    rainChance: h.precipitationChance,
                    pressure: Math.round(h.pressure),
                    cloudCover: h.cloudCover,
                    conditionCode: h.conditionCode,
                    daylight: h.daylight,
                    dayIndex,
                    isFirstOfDay: hi === 0 && dayIndex > 0,
                })
            })
        } else {
            const chunks: HourlyForecast[][] = []
            for (let i = 0; i < dayHours.length; i += 3) {
                chunks.push(dayHours.slice(i, i + 3))
            }
            dayLabels.push({ label: dayKey, colSpan: chunks.length })
            chunks.forEach((chunk, ci) => {
                const startHour = new Date(chunk[0].forecastStart).getHours()
                const endHour = new Date(chunk[chunk.length - 1].forecastStart).getHours() + 1
                const mid = chunk[Math.floor(chunk.length / 2)]
                columns.push({
                    hourLabel: `${startHour.toString().padStart(2, '0')}-${endHour.toString().padStart(2, '0')}`,
                    wind: kphToKnots(Math.max(...chunk.map(h => h.windSpeed))),
                    gusts: kphToKnots(Math.max(...chunk.map(h => h.windGust))),
                    windDir: avgDir(chunk),
                    temp: Math.round(chunk.reduce((s, h) => s + h.temperature, 0) / chunk.length),
                    humidity: Math.round(chunk.reduce((s, h) => s + h.humidity, 0) / chunk.length * 100),
                    rainChance: Math.max(...chunk.map(h => h.precipitationChance)),
                    pressure: Math.round(chunk.reduce((s, h) => s + h.pressure, 0) / chunk.length),
                    cloudCover: chunk.reduce((s, h) => s + h.cloudCover, 0) / chunk.length,
                    conditionCode: mid.conditionCode,
                    daylight: mid.daylight,
                    dayIndex,
                    isFirstOfDay: ci === 0 && dayIndex > 0,
                })
            })
        }
    })

    return { dayLabels, columns }
}

export default function WeatherForecastTable({ lat, lon }: WeatherForecastTableProps) {
    const [hours, setHours] = useState<HourlyForecast[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(`/api/weather?lat=${lat}&lon=${lon}&dataSets=forecastHourly`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.forecastHourly?.hours) {
                    setHours(data.forecastHourly.hours)
                } else {
                    setError(true)
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [lat, lon])

    if (loading) {
        return (
            <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-secondary" role="status" />
            </div>
        )
    }

    if (error || hours.length === 0) return null

    const { dayLabels, columns } = buildColumns(hours)

    const cellBase: React.CSSProperties = {
        minWidth: '26px',
        textAlign: 'center',
        padding: '2px 2px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
    }
    const labelStyle: React.CSSProperties = {
        ...cellBase,
        minWidth: '70px',
        position: 'sticky',
        left: 0,
        background: '#fff',
        zIndex: 2,
        textAlign: 'left',
        fontWeight: 600,
        fontSize: '10px',
        color: '#888',
        borderRight: '1px solid #eee',
    }

    return (
        <div>
            <div className="overflow-auto" style={{ borderRadius: '6px', border: '1px solid #eee' }}>
                <table style={{ borderCollapse: 'collapse', width: 'max-content', minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ ...labelStyle, background: '#fafafa', borderBottom: '1px solid #eee' }}></th>
                            {dayLabels.map((day, di) => (
                                <th
                                    key={di}
                                    colSpan={day.colSpan}
                                    style={{
                                        textAlign: 'center',
                                        padding: '4px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#666',
                                        background: '#fafafa',
                                        borderBottom: '1px solid #eee',
                                        borderLeft: di > 0 ? '1px solid #ddd' : undefined,
                                    }}
                                >
                                    {day.label}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th style={{ ...labelStyle, background: '#fafafa', fontSize: '9px', color: '#aaa', borderBottom: '1px solid #eee' }}>hr</th>
                            {columns.map((col, i) => (
                                <th key={i} style={{ ...cellBase, background: '#fafafa', fontSize: '9px', color: '#aaa', fontWeight: 400, borderBottom: '1px solid #eee', borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined }}>
                                    {col.hourLabel}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={labelStyle}></td>
                            {columns.map((col, i) => (
                                <td key={i} style={{ ...cellBase, fontSize: '13px', borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined }} title={col.conditionCode}>
                                    {conditionIcon(col.conditionCode, col.daylight)}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={labelStyle}>Wind</td>
                            {columns.map((col, i) => (
                                <td key={i} style={{ ...cellBase, background: windColor(col.wind), color: windTextColor(col.wind), fontWeight: 700, borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined }}>
                                    {col.wind}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={labelStyle}>Gusts</td>
                            {columns.map((col, i) => (
                                <td key={i} style={{ ...cellBase, background: windColor(col.gusts), color: windTextColor(col.gusts), fontWeight: 700, borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined }}>
                                    {col.gusts}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={labelStyle}>Dir</td>
                            {columns.map((col, i) => (
                                <td key={i} style={{ ...cellBase, lineHeight: 1.1, borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined }}>
                                    <div style={{ fontSize: '13px' }}>{directionArrow(col.windDir)}</div>
                                    <div style={{ fontSize: '8px', color: '#999' }}>{windDirectionLabel(col.windDir)}</div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={labelStyle}>°C</td>
                            {columns.map((col, i) => (
                                <td key={i} style={{ ...cellBase, borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined }}>{col.temp}</td>
                            ))}
                        </tr>
                        <tr>
                            <td style={labelStyle}>Hum %</td>
                            {columns.map((col, i) => (
                                <td key={i} style={{ ...cellBase, color: '#999', borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined }}>{col.humidity}</td>
                            ))}
                        </tr>
                        <tr>
                            <td style={labelStyle}>Rain %</td>
                            {columns.map((col, i) => {
                                const pct = Math.round(col.rainChance * 100)
                                return (
                                    <td key={i} style={{
                                        ...cellBase,
                                        background: `rgb(${Math.round(255 - col.rainChance * 210)},${Math.round(255 - col.rainChance * 120)},255)`,
                                        color: col.rainChance > 0.5 ? '#fff' : '#666',
                                        borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined,
                                    }}>
                                        {pct > 0 ? pct : '-'}
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td style={labelStyle}>hPa</td>
                            {columns.map((col, i) => (
                                <td key={i} style={{ ...cellBase, color: '#aaa', fontSize: '10px', borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined }}>{col.pressure}</td>
                            ))}
                        </tr>
                        <tr>
                            <td style={labelStyle}>Cloud %</td>
                            {columns.map((col, i) => (
                                <td key={i} style={{
                                    ...cellBase,
                                    background: `rgb(${Math.round(255 - col.cloudCover * 175)},${Math.round(255 - col.cloudCover * 175)},${Math.round(255 - col.cloudCover * 175)})`,
                                    color: col.cloudCover > 0.6 ? '#fff' : '#666',
                                    borderLeft: col.isFirstOfDay ? '1px solid #ddd' : undefined,
                                }}>{Math.round(col.cloudCover * 100)}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-1" style={{ fontSize: '9px', color: '#bbb' }}> Apple WeatherKit</div>
        </div>
    )
}

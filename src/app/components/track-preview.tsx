'use client'

import { useEffect, useState, useRef } from 'react'

interface TrackPreviewProps {
    trackUrl: string
    height?: number
}

/**
 * Lightweight track preview that renders the GPS track as a colored SVG path.
 * Designed for feed cards — no MapKit dependency, very fast to render.
 */
export default function TrackPreview({ trackUrl, height = 200 }: TrackPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function render() {
            const canvas = canvasRef.current
            if (!canvas) return

            try {
                const res = await fetch(trackUrl)
                if (!res.ok || cancelled) return
                const geojson = await res.json()

                const feature = geojson?.features?.[0]
                if (!feature?.geometry?.coordinates) return

                const coords: [number, number][] = feature.geometry.coordinates
                const speeds: number[] = feature.properties?.speeds || []
                if (coords.length < 2) return

                const rect = canvas.getBoundingClientRect()
                const w = rect.width * 2  // retina
                const h = height * 2
                canvas.width = w
                canvas.height = h

                const ctx = canvas.getContext('2d')
                if (!ctx) return

                // Compute bounds
                const lons = coords.map(c => c[0])
                const lats = coords.map(c => c[1])
                const minLon = Math.min(...lons)
                const maxLon = Math.max(...lons)
                const minLat = Math.min(...lats)
                const maxLat = Math.max(...lats)

                const lonRange = maxLon - minLon || 0.001
                const latRange = maxLat - minLat || 0.001

                const padding = 30
                const drawW = w - padding * 2
                const drawH = h - padding * 2

                // Maintain aspect ratio
                const scaleX = drawW / lonRange
                const scaleY = drawH / latRange
                const scale = Math.min(scaleX, scaleY)
                const offsetX = padding + (drawW - lonRange * scale) / 2
                const offsetY = padding + (drawH - latRange * scale) / 2

                function toCanvas(lon: number, lat: number): [number, number] {
                    return [
                        offsetX + (lon - minLon) * scale,
                        offsetY + (maxLat - lat) * scale,  // flip Y
                    ]
                }

                // Speed range
                const nonZeroSpeeds = speeds.filter(s => s > 0)
                const maxSpeed = nonZeroSpeeds.length > 0 ? Math.max(...nonZeroSpeeds) : 1

                // Draw track segments colored by speed
                ctx.lineCap = 'round'
                ctx.lineJoin = 'round'
                ctx.lineWidth = 4

                for (let i = 0; i < coords.length - 1; i++) {
                    const [x1, y1] = toCanvas(coords[i][0], coords[i][1])
                    const [x2, y2] = toCanvas(coords[i + 1][0], coords[i + 1][1])
                    const speed = speeds[i] || 0
                    const ratio = Math.min(speed / maxSpeed, 1)

                    ctx.beginPath()
                    ctx.strokeStyle = speedColor(ratio)
                    ctx.moveTo(x1, y1)
                    ctx.lineTo(x2, y2)
                    ctx.stroke()
                }

                // Start dot
                const [sx, sy] = toCanvas(coords[0][0], coords[0][1])
                ctx.beginPath()
                ctx.fillStyle = '#22c55e'
                ctx.arc(sx, sy, 6, 0, Math.PI * 2)
                ctx.fill()

                // End dot
                const [ex, ey] = toCanvas(coords[coords.length - 1][0], coords[coords.length - 1][1])
                ctx.beginPath()
                ctx.fillStyle = '#ef4444'
                ctx.arc(ex, ey, 6, 0, Math.PI * 2)
                ctx.fill()

                if (!cancelled) setLoaded(true)
            } catch {
                // Silent fail
            }
        }

        render()
        return () => { cancelled = true }
    }, [trackUrl, height])

    return (
        <div
            className="rounded-3 overflow-hidden position-relative"
            style={{ height, background: '#1a1a2e' }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.3s',
                }}
            />
        </div>
    )
}

function speedColor(ratio: number): string {
    if (ratio < 0.5) {
        const r = Math.round(255 * (ratio * 2))
        return `rgb(${r}, 200, 50)`
    } else {
        const g = Math.round(200 * (1 - (ratio - 0.5) * 2))
        return `rgb(255, ${g}, 50)`
    }
}

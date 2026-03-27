'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface TrackGeoJson {
    type: 'FeatureCollection'
    features: [{
        type: 'Feature'
        geometry: {
            type: 'LineString'
            coordinates: [number, number][]
        }
        properties: {
            times: string[]
            speeds: number[]
            heartRates: number[]
            courses: number[]
        }
    }]
}

interface TrackMapProps {
    trackUrl?: string
    trackData?: TrackGeoJson | null
    height?: string
    highlightIndex?: number | null
    onHoverIndex?: (index: number | null) => void
}

declare global {
    interface Window {
        mapkit: any
        _mapkitInitialized?: boolean
    }
}

type MapType = 'standard' | 'satellite' | 'hybrid'

export default function TrackMap({ trackUrl, trackData, height = '500px', highlightIndex, onHoverIndex }: TrackMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const highlightAnnotationRef = useRef<any>(null)
    const coordsRef = useRef<[number, number][]>([])
    const [error, setError] = useState<string | null>(null)
    const [mapType, setMapType] = useState<MapType>('standard')

    // Update map type when changed
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map || !window.mapkit) return
        const types = window.mapkit.Map.MapTypes
        switch (mapType) {
            case 'satellite': map.mapType = types.Satellite; break
            case 'hybrid': map.mapType = types.Hybrid; break
            default: map.mapType = types.Standard; break
        }
    }, [mapType])

    // Render track on map
    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_MAPKIT_TOKEN
        if (!token) {
            setError('Map token not configured')
            return
        }

        let cancelled = false

        async function loadTrackAndRender() {
            if (!window.mapkit || !mapRef.current || cancelled) return

            if (!window._mapkitInitialized) {
                try {
                    window.mapkit.init({
                        authorizationCallback: (done: (token: string) => void) => {
                            done(token!)
                        },
                    })
                    window._mapkitInitialized = true
                } catch {
                    window._mapkitInitialized = true
                }
            }

            if (!mapInstanceRef.current) {
                mapInstanceRef.current = new window.mapkit.Map(mapRef.current, {
                    colorScheme: window.mapkit.Map.ColorSchemes.Light,
                    mapType: window.mapkit.Map.MapTypes.Standard,
                    showsCompass: window.mapkit.FeatureVisibility.Adaptive,
                    showsZoomControl: true,
                    showsMapTypeControl: false,
                })
            }

            const map = mapInstanceRef.current
            map.removeAnnotations(map.annotations)
            map.removeOverlays(map.overlays)

            let geojson = trackData
            if (!geojson && trackUrl) {
                try {
                    const res = await fetch(trackUrl)
                    if (!res.ok) {
                        setError(`Failed to load track (${res.status})`)
                        return
                    }
                    geojson = await res.json()
                } catch (err) {
                    setError('Failed to fetch track data')
                    console.error('Track fetch error:', err)
                    return
                }
            }

            if (cancelled || !geojson) return

            const feature = geojson?.features?.[0]
            if (!feature?.geometry?.coordinates) {
                setError('No track data found')
                return
            }

            const coords: [number, number][] = feature.geometry.coordinates
            const speeds: number[] = feature.properties?.speeds || []
            coordsRef.current = coords

            if (coords.length < 2) {
                setError('Track has too few points')
                return
            }

            const nonZeroSpeeds = speeds.filter(s => s > 0)
            const maxSpeed = nonZeroSpeeds.length > 0 ? Math.max(...nonZeroSpeeds) : 1

            const segmentSize = 10
            const overlays: any[] = []

            for (let i = 0; i < coords.length - 1; i += segmentSize) {
                const end = Math.min(i + segmentSize + 1, coords.length)
                const segCoords = coords.slice(i, end).map(
                    c => new window.mapkit.Coordinate(c[1], c[0])
                )

                const segSpeeds = speeds.slice(i, end)
                const avgSpeed = segSpeeds.length > 0
                    ? segSpeeds.reduce((a, b) => a + b, 0) / segSpeeds.length
                    : 0
                const ratio = Math.min(avgSpeed / maxSpeed, 1)

                const polyline = new window.mapkit.PolylineOverlay(segCoords, {
                    style: new window.mapkit.Style({
                        lineWidth: 4,
                        strokeColor: speedColor(ratio),
                        strokeOpacity: 0.9,
                    }),
                })
                overlays.push(polyline)
            }

            map.addOverlays(overlays)

            const startCoord = new window.mapkit.Coordinate(coords[0][1], coords[0][0])
            const endCoord = new window.mapkit.Coordinate(coords[coords.length - 1][1], coords[coords.length - 1][0])

            map.addAnnotations([
                new window.mapkit.MarkerAnnotation(startCoord, {
                    color: '#22c55e',
                    glyphText: 'S',
                    title: 'Start',
                }),
                new window.mapkit.MarkerAnnotation(endCoord, {
                    color: '#ef4444',
                    glyphText: 'E',
                    title: 'End',
                }),
            ])

            const lats = coords.map(c => c[1])
            const lons = coords.map(c => c[0])
            const center = new window.mapkit.Coordinate(
                (Math.min(...lats) + Math.max(...lats)) / 2,
                (Math.min(...lons) + Math.max(...lons)) / 2
            )
            const span = new window.mapkit.CoordinateSpan(
                (Math.max(...lats) - Math.min(...lats)) * 1.3 || 0.01,
                (Math.max(...lons) - Math.min(...lons)) * 1.3 || 0.01
            )
            map.region = new window.mapkit.CoordinateRegion(center, span)
        }

        if (window.mapkit) {
            loadTrackAndRender()
        } else {
            const existingScript = document.querySelector('script[src*="mapkit"]')
            if (existingScript) {
                existingScript.addEventListener('load', loadTrackAndRender)
            } else {
                const script = document.createElement('script')
                script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
                script.crossOrigin = 'anonymous'
                script.addEventListener('load', loadTrackAndRender)
                document.head.appendChild(script)
            }
        }

        return () => {
            cancelled = true
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy()
                mapInstanceRef.current = null
            }
        }
    }, [trackUrl, trackData])

    // Update highlight marker when highlightIndex changes
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map || !window.mapkit) return

        const coords = coordsRef.current
        if (!coords.length) return

        // Remove previous highlight annotation
        if (highlightAnnotationRef.current) {
            map.removeAnnotation(highlightAnnotationRef.current)
            highlightAnnotationRef.current = null
        }

        if (highlightIndex == null || highlightIndex < 0 || highlightIndex >= coords.length) return

        const [lon, lat] = coords[highlightIndex]
        const coord = new window.mapkit.Coordinate(lat, lon)

        const annotation = new window.mapkit.Annotation(coord, (coordinate: any) => {
            const div = document.createElement('div')
            div.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#0d6efd;border:2px solid #fff;box-shadow:0 0 6px rgba(13,110,253,0.6);pointer-events:none;'
            return div
        }, {
            anchorOffset: new DOMPoint(0, 0),
        })

        map.addAnnotation(annotation)
        highlightAnnotationRef.current = annotation
    }, [highlightIndex])

    // Mouse move on map → find nearest track point
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!onHoverIndex || !mapInstanceRef.current || !window.mapkit) return

        const map = mapInstanceRef.current
        const coords = coordsRef.current
        if (coords.length === 0) return

        const rect = mapRef.current!.getBoundingClientRect()
        const point = new DOMPoint(e.clientX - rect.left, e.clientY - rect.top)
        const coordinate = map.convertPointOnPageToCoordinate(new DOMPoint(e.clientX, e.clientY))
        if (!coordinate) return

        const targetLat = coordinate.latitude
        const targetLon = coordinate.longitude

        // Find nearest point (using squared distance for speed)
        let bestIdx = -1
        let bestDist = Infinity
        // Sample every 5th point for performance, then refine
        const sampleStep = Math.max(1, Math.floor(coords.length / 500))
        for (let i = 0; i < coords.length; i += sampleStep) {
            const dLat = coords[i][1] - targetLat
            const dLon = coords[i][0] - targetLon
            const dist = dLat * dLat + dLon * dLon
            if (dist < bestDist) {
                bestDist = dist
                bestIdx = i
            }
        }

        // Refine around the best sample
        const refineStart = Math.max(0, bestIdx - sampleStep)
        const refineEnd = Math.min(coords.length, bestIdx + sampleStep)
        for (let i = refineStart; i < refineEnd; i++) {
            const dLat = coords[i][1] - targetLat
            const dLon = coords[i][0] - targetLon
            const dist = dLat * dLat + dLon * dLon
            if (dist < bestDist) {
                bestDist = dist
                bestIdx = i
            }
        }

        // Only highlight if reasonably close to the track
        // Convert threshold based on current zoom: use ~20px worth of map coordinates
        const region = map.region
        const latPerPx = region.span.latitudeDelta / rect.height
        const threshold = (latPerPx * 30) ** 2
        if (bestDist < threshold && bestIdx >= 0) {
            onHoverIndex(bestIdx)
        } else {
            onHoverIndex(null)
        }
    }, [onHoverIndex])

    const handleMouseLeave = useCallback(() => {
        if (onHoverIndex) onHoverIndex(null)
    }, [onHoverIndex])

    if (error) {
        return (
            <div
                style={{ width: '100%', height, borderRadius: '12px', background: '#f8f9fa' }}
                className="d-flex align-items-center justify-content-center text-muted"
            >
                {error}
            </div>
        )
    }

    return (
        <div style={{ position: 'relative', width: '100%', height }}>
            <div
                ref={mapRef}
                style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />
            <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                display: 'flex',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                zIndex: 1,
            }}>
                {(['standard', 'satellite', 'hybrid'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setMapType(type)}
                        style={{
                            padding: '5px 10px',
                            fontSize: '0.75rem',
                            fontWeight: mapType === type ? 600 : 400,
                            border: 'none',
                            cursor: 'pointer',
                            background: mapType === type ? '#0d6efd' : 'rgba(255,255,255,0.95)',
                            color: mapType === type ? '#fff' : '#333',
                            borderRight: type !== 'hybrid' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                        }}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
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

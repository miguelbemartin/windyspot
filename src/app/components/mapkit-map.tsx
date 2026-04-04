'use client'

import { useEffect, useRef, useCallback } from 'react'

interface SpotMarker {
    title: string
    slug: string
    lat: number
    lon: number
}

interface MapKitMapProps {
    spots: SpotMarker[]
    height?: string
}

declare global {
    interface Window {
        mapkit: any
    }
}

function loadMapKitScript(): Promise<void> {
    if (window.mapkit) return Promise.resolve()

    return new Promise((resolve) => {
        const existing = document.querySelector('script[src*="apple-mapkit"]')
        if (existing) {
            existing.addEventListener('load', () => resolve())
            return
        }
        const script = document.createElement('script')
        script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
        script.crossOrigin = 'anonymous'
        script.addEventListener('load', () => resolve())
        document.head.appendChild(script)
    })
}

export default function MapKitMap({ spots, height = '700px' }: MapKitMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const mapkitInitializedRef = useRef(false)

    const updateMarkers = useCallback((map: any, currentSpots: SpotMarker[]) => {
        map.removeAnnotations(map.annotations)

        if (currentSpots.length === 0) {
            map.region = new window.mapkit.CoordinateRegion(
                new window.mapkit.Coordinate(35, 0),
                new window.mapkit.CoordinateSpan(60, 80)
            )
            return
        }

        const annotations = currentSpots.map((spot) => {
            const coord = new window.mapkit.Coordinate(spot.lat, spot.lon)
            return new window.mapkit.MarkerAnnotation(coord, {
                title: spot.title,
                color: '#e05565',
                clusteringIdentifier: 'spots',
                callout: {
                    calloutElementForAnnotation: () => {
                        const el = document.createElement('a')
                        el.href = `/spots/${spot.slug}`
                        el.textContent = spot.title
                        el.style.cssText = 'color:#e05565;font-weight:600;font-size:14px;text-decoration:none;padding:4px 8px;display:block;white-space:nowrap;'
                        return el
                    },
                },
            })
        })

        map.addAnnotations(annotations)
        map.region = new window.mapkit.CoordinateRegion(
            new window.mapkit.Coordinate(20, 0),
            new window.mapkit.CoordinateSpan(160, 360)
        )
    }, [])

    // Load script and create map instance once
    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_MAPKIT_TOKEN
        if (!token) return

        let cancelled = false

        loadMapKitScript().then(() => {
            if (cancelled || !mapRef.current) return

            if (!mapkitInitializedRef.current) {
                window.mapkit.init({
                    authorizationCallback: (done: (token: string) => void) => {
                        done(token!)
                    },
                })
                mapkitInitializedRef.current = true
            }

            if (!mapInstanceRef.current) {
                mapInstanceRef.current = new window.mapkit.Map(mapRef.current, {
                    colorScheme: window.mapkit.Map.ColorSchemes.Light,
                    mapType: window.mapkit.Map.MapTypes.Standard,
                    showsCompass: window.mapkit.FeatureVisibility.Hidden,
                    showsZoomControl: false,
                    showsMapTypeControl: false,
                })
            }

            updateMarkers(mapInstanceRef.current, spots)
        })

        return () => {
            cancelled = true
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy()
                mapInstanceRef.current = null
            }
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Update markers when spots change
    useEffect(() => {
        if (mapInstanceRef.current) {
            updateMarkers(mapInstanceRef.current, spots)
        }
    }, [spots, updateMarkers])

    return (
        <div
            ref={mapRef}
            style={{ width: '100%', height, borderRadius: '8px' }}
        />
    )
}

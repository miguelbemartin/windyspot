'use client'

import { useEffect, useRef } from 'react'

interface SpotMarker {
    title: string
    slug: string
    lat: number
    lon: number
}

interface MapKitMapProps {
    spots: SpotMarker[]
}

declare global {
    interface Window {
        mapkit: any
    }
}

export default function MapKitMap({ spots }: MapKitMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)

    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_MAPKIT_TOKEN
        if (!token) return

        function initMap() {
            if (!window.mapkit || !mapRef.current) return

            if (!mapInstanceRef.current) {
                window.mapkit.init({
                    authorizationCallback: (done: (token: string) => void) => {
                        done(token!)
                    },
                })

                mapInstanceRef.current = new window.mapkit.Map(mapRef.current, {
                    colorScheme: window.mapkit.Map.ColorSchemes.Light,
                    mapType: window.mapkit.Map.MapTypes.Standard,
                    showsCompass: window.mapkit.FeatureVisibility.Hidden,
                    showsZoomControl: false,
                    showsMapTypeControl: false,
                })
            }

            const map = mapInstanceRef.current
            map.removeAnnotations(map.annotations)

            if (spots.length === 0) {
                map.region = new window.mapkit.CoordinateRegion(
                    new window.mapkit.Coordinate(35, 0),
                    new window.mapkit.CoordinateSpan(60, 80)
                )
                return
            }

            const annotations = spots.map((spot) => {
                const coord = new window.mapkit.Coordinate(spot.lat, spot.lon)
                const annotation = new window.mapkit.MarkerAnnotation(coord, {
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
                return annotation
            })

            map.showItems(annotations, {
                padding: new window.mapkit.Padding(40, 40, 40, 40),
                animate: false,
            })
        }

        if (window.mapkit) {
            initMap()
            return
        }

        const script = document.createElement('script')
        script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
        script.crossOrigin = 'anonymous'
        script.addEventListener('load', initMap)
        document.head.appendChild(script)

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy()
                mapInstanceRef.current = null
            }
        }
    }, [spots])

    return (
        <div
            ref={mapRef}
            style={{ width: '100%', height: '400px', borderRadius: '8px' }}
        />
    )
}

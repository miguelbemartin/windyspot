'use client'

interface WindyEmbedProps {
  lat: number
  lon: number
  zoom?: number
  overlay?: string
  title?: string
}

export default function WindyEmbed({ lat, lon, zoom = 9, overlay = 'wind', title = 'Windy Map' }: WindyEmbedProps) {
  const src = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=${zoom}&overlay=${overlay}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&message=true`

  return (
    <div className="map-container rounded-3 overflow-hidden">
      <iframe
        src={src}
        title={title}
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}

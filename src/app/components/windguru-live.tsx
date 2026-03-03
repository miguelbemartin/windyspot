'use client'
import { useEffect, useRef } from 'react'

interface WindguruLiveProps {
  spotId: string
  uid: string
}

export default function WindguruLive({ spotId, uid }: WindguruLiveProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const container = containerRef.current
    if (!container) return

    const arg = [
      `spot=${spotId}`,
      `uid=${uid}`,
      'direct=1',
      'wj=knots',
      'tj=c',
      'avg_min=0',
      'gsize=400',
      'msize=400',
      'm=3',
      'ai=0',
      'show=n,g,c',
    ]
    const script = document.createElement('script')
    script.src = 'https://www.windguru.cz/js/wglive.php?' + arg.join('&')
    script.id = uid
    container.appendChild(script)
  }, [spotId, uid])

  return <div ref={containerRef} />
}

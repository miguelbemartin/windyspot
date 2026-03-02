'use client'
import { useEffect, useRef } from 'react'

interface WindguruWidgetProps {
    spotId: string
    uid: string
}

export default function WindguruWidget({ spotId, uid }: WindguruWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        const container = containerRef.current
        if (!container) return

        const arg = [
            `s=${spotId}`,
            'm=100',
            `uid=${uid}`,
            'wj=knots',
            'tj=c',
            'waj=m',
            'tij=cm',
            'odh=0',
            'doh=24',
            'fhours=240',
            'hrsm=2',
            'vt=forecasts',
            'lng=en',
            'idbs=1',
            'ts=1',
            'p=WINDSPD,GUST,SMER,TMPE,FLHGT,CDC,APCP1s,RATING',
        ]
        const script = document.createElement('script')
        script.src = 'https://www.windguru.cz/js/widget.php?' + arg.join('&')
        script.id = uid
        container.appendChild(script)
    }, [spotId, uid])

    return <div ref={containerRef} />
}



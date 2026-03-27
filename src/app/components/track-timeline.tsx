'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const MS_TO_KNOTS = 1.94384

interface TrackProperties {
    times: string[]
    speeds: number[]
    heartRates: number[]
}

interface TrackTimelineProps {
    trackUrl?: string
    trackData?: TrackProperties | null
    height?: number
    highlightIndex?: number | null
    onHoverIndex?: (index: number | null) => void
}

export default function TrackTimeline({ trackUrl, trackData: externalData, height = 160, highlightIndex, onHoverIndex }: TrackTimelineProps) {
    const [fetchedData, setFetchedData] = useState<TrackProperties | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const cursorRef = useRef<HTMLDivElement>(null)

    const data = externalData || fetchedData

    // Only fetch if no external data provided
    useEffect(() => {
        if (externalData || !trackUrl) return
        let cancelled = false
        fetch(trackUrl)
            .then(res => res.json())
            .then(geojson => {
                if (cancelled) return
                const props = geojson?.features?.[0]?.properties
                if (props) {
                    setFetchedData({
                        times: props.times || [],
                        speeds: props.speeds || [],
                        heartRates: props.heartRates || [],
                    })
                }
            })
            .catch(() => {})
        return () => { cancelled = true }
    }, [trackUrl, externalData])

    const hasHr = useMemo(() => data?.heartRates.some(hr => hr > 0) ?? false, [data])

    // Downsampling step and mapping
    const step = useMemo(() => {
        if (!data) return 1
        return Math.max(1, Math.floor(data.times.length / 200))
    }, [data])

    const { speedSeries, hrSeries, categories } = useMemo(() => {
        if (!data || data.times.length === 0) return { speedSeries: [], hrSeries: [], categories: [] }

        const sampled = {
            times: [] as string[],
            speeds: [] as number[],
            heartRates: [] as number[],
        }

        for (let i = 0; i < data.times.length; i += step) {
            const windowEnd = Math.min(i + step, data.times.length)
            let speedSum = 0, hrSum = 0, count = 0
            for (let j = i; j < windowEnd; j++) {
                speedSum += data.speeds[j]
                hrSum += data.heartRates[j]
                count++
            }
            sampled.times.push(data.times[i])
            sampled.speeds.push(Math.round((speedSum / count) * MS_TO_KNOTS * 10) / 10)
            sampled.heartRates.push(Math.round(hrSum / count))
        }

        const startMs = new Date(sampled.times[0]).getTime()
        const cats = sampled.times.map(t => {
            const elapsed = (new Date(t).getTime() - startMs) / 60000
            const h = Math.floor(elapsed / 60)
            const m = Math.floor(elapsed % 60)
            return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}m`
        })

        return {
            speedSeries: sampled.speeds,
            hrSeries: sampled.heartRates,
            categories: cats,
        }
    }, [data, step])

    // Convert full-track highlightIndex to downsampled chart index
    const chartHighlightIndex = useMemo(() => {
        if (highlightIndex == null || highlightIndex < 0) return null
        return Math.min(Math.floor(highlightIndex / step), speedSeries.length - 1)
    }, [highlightIndex, step, speedSeries.length])

    // Position a vertical cursor line when the map drives the highlight
    useEffect(() => {
        const cursor = cursorRef.current
        if (!cursor) return

        if (chartHighlightIndex == null || speedSeries.length === 0) {
            cursor.style.display = 'none'
            return
        }

        // Find the chart's plot area to position the line
        const container = containerRef.current
        if (!container) return
        const plotArea = container.querySelector('.apexcharts-plot-area') as HTMLElement | null
        if (!plotArea) return

        const plotRect = plotArea.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const ratio = chartHighlightIndex / (speedSeries.length - 1)
        const x = plotRect.left - containerRect.left + ratio * plotRect.width

        cursor.style.display = 'block'
        cursor.style.left = `${x}px`
        cursor.style.top = `${plotRect.top - containerRect.top}px`
        cursor.style.height = `${plotRect.height}px`
    }, [chartHighlightIndex, speedSeries.length])

    // Chart hover → map highlight
    const handleMouseMove = useCallback((_event: any, _chartContext: any, config: any) => {
        if (!onHoverIndex) return
        const dataPointIndex = config?.dataPointIndex
        if (dataPointIndex != null && dataPointIndex >= 0) {
            // Convert downsampled index back to full track index
            const fullIndex = Math.min(dataPointIndex * step, (data?.times.length ?? 1) - 1)
            onHoverIndex(fullIndex)
        }
    }, [onHoverIndex, step, data])

    const handleMouseLeave = useCallback(() => {
        if (onHoverIndex) onHoverIndex(null)
    }, [onHoverIndex])

    if (!data || speedSeries.length === 0) return null

    const series: { name: string; data: number[] }[] = [
        {
            name: 'Speed',
            data: speedSeries,
        },
        ...(hasHr ? [{
            name: 'Heart Rate',
            data: hrSeries,
        }] : []),
    ]

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            height,
            sparkline: { enabled: false },
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: 'inherit',
            events: {
                mouseMove: handleMouseMove,
                mouseLeave: handleMouseLeave,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.4,
                opacityTo: 0.05,
            },
        },
        colors: ['#0d6efd', '#dc3545'],
        xaxis: {
            categories,
            labels: {
                show: true,
                style: { fontSize: '10px', colors: '#999' },
                rotate: 0,
            },
            tickAmount: 6,
            axisBorder: { show: false },
            axisTicks: { show: false },
            crosshairs: {
                show: true,
                stroke: { color: '#0d6efd', width: 1, dashArray: 3 },
            },
        },
        yaxis: hasHr ? [
            {
                title: { text: 'kts', style: { fontSize: '10px', color: '#999' } },
                labels: { style: { fontSize: '10px', colors: '#999' } },
                min: 0,
            },
            {
                opposite: true,
                title: { text: 'bpm', style: { fontSize: '10px', color: '#999' } },
                labels: { style: { fontSize: '10px', colors: '#999' } },
                min: 0,
            },
        ] : [
            {
                title: { text: 'kts', style: { fontSize: '10px', color: '#999' } },
                labels: { style: { fontSize: '10px', colors: '#999' } },
                min: 0,
            },
        ],
        grid: {
            borderColor: '#f0f0f0',
            strokeDashArray: 3,
            padding: { left: 0, right: 0 },
        },
        tooltip: {
            shared: true,
            x: { show: true },
            y: {
                formatter: (val: number, opts: any) => {
                    const seriesIndex = opts?.seriesIndex ?? 0
                    if (seriesIndex === 0) return `${val} kts`
                    return `${val} bpm`
                },
            },
        },
        legend: {
            show: hasHr,
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '11px',
            markers: { size: 6, offsetX: -2 },
            itemMargin: { horizontal: 8 },
        },
        dataLabels: { enabled: false },
    }

    return (
        <div ref={containerRef} style={{ margin: '-8px -4px', position: 'relative' }}>
            <Chart
                options={options}
                series={series}
                type="area"
                height={height}
            />
            <div
                ref={cursorRef}
                style={{
                    display: 'none',
                    position: 'absolute',
                    width: 1,
                    background: '#0d6efd',
                    opacity: 0.6,
                    pointerEvents: 'none',
                    zIndex: 10,
                }}
            />
        </div>
    )
}

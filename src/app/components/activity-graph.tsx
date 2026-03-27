'use client'

import { useMemo } from 'react'

interface ActivityGraphProps {
    activity: Record<string, number>
}

const DAYS = ['Mon', '', 'Wed', '', 'Fri', '', '']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const COLOR_EMPTY = '#ebedf0'
const COLOR_ACTIVE = '#40c463'

export default function ActivityGraph({ activity }: ActivityGraphProps) {
    const { weeks, monthLabels, totalSessions } = useMemo(() => {
        const today = new Date()
        // Start from the most recent Sunday going back ~52 weeks
        const endDay = new Date(today)
        endDay.setDate(endDay.getDate() + (6 - endDay.getDay())) // next Saturday
        const startDay = new Date(endDay)
        startDay.setDate(startDay.getDate() - 52 * 7 + 1) // 52 weeks back, Sunday

        const weeks: { date: string; count: number; day: number }[][] = []
        let currentWeek: { date: string; count: number; day: number }[] = []
        const monthLabels: { label: string; col: number }[] = []

        let total = 0
        let lastMonth = -1
        let weekIndex = 0

        const cursor = new Date(startDay)
        while (cursor <= endDay) {
            const dateStr = cursor.toISOString().slice(0, 10)
            const dayOfWeek = cursor.getDay()
            const count = activity[dateStr] || 0
            total += count

            // Track month labels
            const month = cursor.getMonth()
            if (month !== lastMonth) {
                monthLabels.push({ label: MONTHS[month], col: weekIndex })
                lastMonth = month
            }

            currentWeek.push({ date: dateStr, count, day: dayOfWeek })

            if (dayOfWeek === 6) {
                weeks.push(currentWeek)
                currentWeek = []
                weekIndex++
            }

            cursor.setDate(cursor.getDate() + 1)
        }

        if (currentWeek.length > 0) {
            weeks.push(currentWeek)
        }

        return { weeks, monthLabels, totalSessions: total }
    }, [activity])

    const cellSize = 12
    const cellGap = 2
    const step = cellSize + cellGap
    const labelWidth = 30
    const topPadding = 18

    return (
        <div>
            <p className="text-muted mb-2" style={{ fontSize: '13px' }}>
                {totalSessions} session{totalSessions !== 1 ? 's' : ''} in the last year
            </p>
            <div style={{ overflowX: 'auto' }}>
                <svg
                    width={labelWidth + weeks.length * step + 2}
                    height={topPadding + 7 * step + 2}
                    style={{ display: 'block' }}
                >
                    {/* Month labels */}
                    {monthLabels.map((m, i) => (
                        <text
                            key={i}
                            x={labelWidth + m.col * step}
                            y={12}
                            fontSize={10}
                            fill="#656d76"
                        >
                            {m.label}
                        </text>
                    ))}

                    {/* Day labels */}
                    {DAYS.map((label, i) => (
                        label && (
                            <text
                                key={i}
                                x={0}
                                y={topPadding + i * step + cellSize - 2}
                                fontSize={10}
                                fill="#656d76"
                            >
                                {label}
                            </text>
                        )
                    ))}

                    {/* Cells */}
                    {weeks.map((week, wi) => (
                        week.map((d) => (
                            <rect
                                key={d.date}
                                x={labelWidth + wi * step}
                                y={topPadding + d.day * step}
                                width={cellSize}
                                height={cellSize}
                                rx={2}
                                ry={2}
                                fill={d.count > 0 ? COLOR_ACTIVE : COLOR_EMPTY}
                            >
                                <title>{`${d.date}: ${d.count} session${d.count !== 1 ? 's' : ''}`}</title>
                            </rect>
                        ))
                    ))}
                </svg>
            </div>
        </div>
    )
}

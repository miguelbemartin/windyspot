'use client'

import Image from 'next/image'
import Link from 'next/link'

import { BsClock, BsSpeedometer, BsGeoAlt, BsHeart } from 'react-icons/bs'
import { FaLocationDot } from 'react-icons/fa6'

export interface SessionCardSpot {
    id: number
    title: string
    slug: string
    image: string
    locations: { name: string } | null
}

export interface SessionCardData {
    id: string
    type: string
    duration_minutes: number | null
    max_speed_kts: number | null
    max_hr: number | null
    distance_km: number | null
    notes: string | null
    track_thumbnail_url: string | null
    start_time: string | null
    created_at: string
    spots: SessionCardSpot | null
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function sportLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatDuration(minutes: number | null): string {
    if (!minutes) return '-'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}min`
}

export default function SessionCard({ session }: { session: SessionCardData }) {
    const spot = session.spots
    const thumbnailSrc = session.track_thumbnail_url || spot?.image || null

    return (
        <Link href={`/sessions/${session.id}`} className="text-decoration-none text-dark d-flex align-items-stretch">
            <div className="flex-shrink-0 p-3 d-flex flex-column justify-content-center text-center" style={{ width: '70px' }}>
                <div className="fw-bold" style={{ fontSize: '1.25rem', lineHeight: 1 }}>
                    {new Date(session.start_time || session.created_at).getDate()}
                </div>
                <div className="text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>
                    {new Date(session.start_time || session.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
            </div>
            <div className="flex-grow-1 py-3 d-flex flex-column justify-content-center" style={{ borderLeft: '1px solid #eee' }}>
                <div className="ps-3">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-bold" style={{ fontSize: '1rem' }}>{sportLabel(session.type)}</span>
                        {spot && (
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                <FaLocationDot className="text-primary" size={11} /> {spot.title}
                            </span>
                        )}
                    </div>
                    {session.notes && <p className="text-muted mb-1" style={{ fontSize: '0.82rem' }}>{session.notes}</p>}
                    <div className="d-flex flex-wrap gap-3 text-muted" style={{ fontSize: '0.82rem' }}>
                        <span><BsClock className="text-primary me-1" size={12} />{formatDuration(session.duration_minutes)}</span>
                        <span><BsSpeedometer className="text-primary me-1" size={12} />{session.max_speed_kts ? `${session.max_speed_kts} kts` : '-'}</span>
                        <span><BsGeoAlt className="text-primary me-1" size={12} />{session.distance_km ? `${session.distance_km} km` : '-'}</span>
                        <span><BsHeart className="text-danger me-1" size={12} />{session.max_hr ? `${session.max_hr} bpm` : '-'}</span>
                    </div>
                </div>
            </div>
            {thumbnailSrc && (
                <div className="flex-shrink-0 position-relative" style={{ width: '380px', minHeight: '220px' }}>
                    <Image src={thumbnailSrc} fill className="object-fit-cover" style={{ borderRadius: '0 0.5rem 0.5rem 0' }} alt={spot?.title || 'Session track'} sizes="180px" />
                </div>
            )}
        </Link>
    )
}

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
    duration_minutes: number | null
    max_speed_kts: number | null
    max_hr: number | null
    distance_km: number | null
    notes: string | null
    track_thumbnail_url: string | null
    spots: SessionCardSpot | null
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
        <Link href={`/sessions/${session.id}`} className="text-decoration-none text-dark">
            <div className="d-flex gap-3">
                <div className="flex-grow-1">
                    {session.notes && <p className="mb-2" style={{ fontSize: '0.9rem' }}>{session.notes}</p>}
                    <div className="d-flex flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                            <BsClock className="text-primary" size={14} />
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Duration</span>
                            <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{formatDuration(session.duration_minutes)}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <BsHeart className="text-danger" size={14} />
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Max HR</span>
                            <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{session.max_hr ? `${session.max_hr} bpm` : '-'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <BsSpeedometer className="text-primary" size={14} />
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Max Speed</span>
                            <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{session.max_speed_kts ? `${session.max_speed_kts} kts` : '-'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <BsGeoAlt className="text-primary" size={14} />
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Distance</span>
                            <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{session.distance_km ? `${session.distance_km} km` : '-'}</span>
                        </div>
                    </div>
                </div>
                {thumbnailSrc && (
                    <div className="flex-shrink-0 position-relative rounded-3 overflow-hidden" style={{ width: '580px', height: '280px' }}>
                        <Image src={thumbnailSrc} fill className="object-fit-cover" alt={spot?.title || 'Session track'} sizes="100px" />
                    </div>
                )}
            </div>
        </Link>
    )
}

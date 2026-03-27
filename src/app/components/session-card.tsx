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
    return (
        <Link href={`/sessions/${session.id}`} className="text-decoration-none text-dark">
            <div className="mb-3">
                {session.notes && <p className="mb-3">{session.notes}</p>}
                {session.track_thumbnail_url ? (
                    <div className="mb-3">
                        <div className="rounded-3 overflow-hidden">
                            <Image src={session.track_thumbnail_url} width={800} height={400} alt="Session track" sizes="(max-width: 768px) 100vw, 600px" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </div>
                ) : spot?.image ? (
                    <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '200px' }}>
                        <Image src={spot.image} fill className="object-fit-cover" alt={spot.title} sizes="(max-width: 768px) 100vw, 600px" />
                    </div>
                ) : null}
                <div className="row g-2">
                    <div className="col-6 col-md-3">
                        <div className="bg-light rounded-3 p-2 text-center">
                            <BsClock className="text-primary mb-1" size={16} />
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Duration</div>
                            <div className="fw-semibold">{formatDuration(session.duration_minutes)}</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="bg-light rounded-3 p-2 text-center">
                            <BsHeart className="text-danger mb-1" size={16} />
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Max HR</div>
                            <div className="fw-semibold">{session.max_hr ? `${session.max_hr} bpm` : '-'}</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="bg-light rounded-3 p-2 text-center">
                            <BsSpeedometer className="text-primary mb-1" size={16} />
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Max Speed</div>
                            <div className="fw-semibold">{session.max_speed_kts ? `${session.max_speed_kts} kts` : '-'}</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="bg-light rounded-3 p-2 text-center">
                            <BsGeoAlt className="text-primary mb-1" size={16} />
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Distance</div>
                            <div className="fw-semibold">{session.distance_km ? `${session.distance_km} km` : '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

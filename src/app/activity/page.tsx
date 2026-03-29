'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'

import NavbarLight from '../components/navbar/navbar-light'
import ActivityGraph from '../components/activity-graph'
import SessionCard from '../components/session-card'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { BsUpload, BsClock, BsSpeedometer, BsGeoAlt, BsHeart, BsFlag } from 'react-icons/bs'
import TrackSessionsPromo from '../components/track-sessions-promo'
import { FaLocationDot } from 'react-icons/fa6'

interface Session {
    id: string
    type: string
    duration_minutes: number | null
    max_speed_kts: number | null
    max_hr: number | null
    distance_km: number | null
    notes: string | null
    track_url: string | null
    track_thumbnail_url: string | null
    start_time: string | null
    created_at: string
    spots: {
        id: number
        title: string
        slug: string
        image: string
        lat: number | null
        lon: number | null
        locations: { name: string } | null
    } | null
}

export default function ActivityPage() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [activity, setActivity] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/my-sessions')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(data => {
                setSessions(data.sessions || [])
                setActivity(data.activity || {})
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const stats = useMemo(() => {
        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
        const totalDistance = sessions.reduce((sum, s) => sum + (s.distance_km || 0), 0)
        const maxSpeed = sessions.reduce((max, s) => Math.max(max, s.max_speed_kts || 0), 0)
        const maxHr = sessions.reduce((max, s) => Math.max(max, s.max_hr || 0), 0)
        const uniqueSpots = new Set(sessions.filter(s => s.spots).map(s => s.spots!.id)).size
        const h = Math.floor(totalDuration / 60)
        const m = totalDuration % 60
        return { totalSessions: sessions.length, totalDuration: h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}min`, totalDistance, maxSpeed, maxHr, uniqueSpots }
    }, [sessions])

    return (
        <>
            <SignedOut>
                <NavbarLight />

                <div className='bg-light'>
                    <TrackSessionsPromo />
                </div>

                <div className="container pb-5 mt-5">
                    <div className="row justify-content-center">
                        <div className="col-xl-7 col-lg-8 col-md-10 col-12 text-center">
                            <Link href="/login" className="btn btn-primary rounded-pill px-4 py-2 me-2">
                                Log in
                            </Link>
                            <Link href="/register" className="btn btn-outline-primary rounded-pill px-4 py-2">
                                Create a free account
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer />

                <BackToTop />
            </SignedOut>
            <SignedIn>
                <NavbarLight />

                <section className="gray-simple pt-4 pt-xl-5 mt-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-10 col-lg-11 col-md-12">

                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <h4 className="fw-semibold mb-0">Activity</h4>
                                    <Link href="/sessions/import" className="btn btn-sm btn-primary rounded-pill d-inline-flex align-items-center gap-1">
                                        <BsUpload /> Import Session
                                    </Link>
                                </div>

                                <div className="card mb-4">
                                    <div className="card-body">
                                        <ActivityGraph activity={activity} />
                                    </div>
                                </div>

                                {sessions.length > 0 && (
                                    <div className="row g-2 mb-4">
                                        <div className="col-6 col-md-4 col-lg-2">
                                            <div className="bg-white rounded-3 p-2 text-center shadow-sm">
                                                <BsFlag className="text-primary mb-1" size={16} />
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Sessions</div>
                                                <div className="fw-semibold">{stats.totalSessions}</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-2">
                                            <div className="bg-white rounded-3 p-2 text-center shadow-sm">
                                                <BsClock className="text-primary mb-1" size={16} />
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Total Time</div>
                                                <div className="fw-semibold">{stats.totalDuration}</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-2">
                                            <div className="bg-white rounded-3 p-2 text-center shadow-sm">
                                                <BsGeoAlt className="text-primary mb-1" size={16} />
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Distance</div>
                                                <div className="fw-semibold">{stats.totalDistance.toFixed(1)} km</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-2">
                                            <div className="bg-white rounded-3 p-2 text-center shadow-sm">
                                                <BsSpeedometer className="text-primary mb-1" size={16} />
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Max Speed</div>
                                                <div className="fw-semibold">{stats.maxSpeed ? `${stats.maxSpeed.toFixed(1)} kts` : '-'}</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-2">
                                            <div className="bg-white rounded-3 p-2 text-center shadow-sm">
                                                <BsHeart className="text-danger mb-1" size={16} />
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Max HR</div>
                                                <div className="fw-semibold">{stats.maxHr ? `${stats.maxHr} bpm` : '-'}</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-2">
                                            <div className="bg-white rounded-3 p-2 text-center shadow-sm">
                                                <FaLocationDot className="text-primary mb-1" size={16} />
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Spots</div>
                                                <div className="fw-semibold">{stats.uniqueSpots}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                ) : sessions.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted">No sessions yet. Import your first session to get started!</p>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {sessions.map((session) => (
                                            <div className="card border-0 shadow-sm overflow-hidden" key={session.id}>
                                                <SessionCard session={session} />
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
                <BackToTop />
            </SignedIn>
        </>
    )
}

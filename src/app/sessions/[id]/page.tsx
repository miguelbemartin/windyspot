'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs'

import NavbarLight from '../../components/navbar/navbar-light'
import Footer from '../../components/footer/footer'
import BackToTop from '../../components/back-to-top'
import TrackMap from '../../components/track-map'
import type { TrackGeoJson } from '../../components/track-map'
import TrackTimeline from '../../components/track-timeline'

import { BsSpeedometer, BsClock, BsGeoAlt, BsHeart, BsArrowLeft, BsTrash } from 'react-icons/bs'
import { FaLocationDot } from 'react-icons/fa6'

interface SessionData {
    id: string
    user_id: string
    type: string
    duration_minutes: number | null
    avg_wind_kts: number | null
    max_speed_kts: number | null
    avg_speed_kts: number | null
    distance_km: number | null
    max_hr: number | null
    avg_hr: number | null
    notes: string | null
    track_url: string | null
    start_time: string | null
    created_at: string
    source: string | null
    spots: {
        id: number
        title: string
        slug: string
        image: string
        lat: number | null
        lon: number | null
        locations: { name: string } | null
    } | null
    actor: {
        user_id: string
        username: string
        full_name: string | null
        avatar_url: string | null
    } | null
}

function formatDuration(minutes: number | null): string {
    if (!minutes) return '-'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}min`
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

function sportLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1)
}

export default function SessionDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { user } = useUser()
    const [session, setSession] = useState<SessionData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [trackData, setTrackData] = useState<TrackGeoJson | null>(null)
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (!id) return
        fetch(`/api/sessions/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Session not found')
                return res.json()
            })
            .then(setSession)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    // Fetch track GeoJSON once, shared by map and timeline
    useEffect(() => {
        if (!session?.track_url) return
        let cancelled = false
        fetch(session.track_url)
            .then(res => res.json())
            .then(data => {
                if (!cancelled) setTrackData(data)
            })
            .catch(() => {})
        return () => { cancelled = true }
    }, [session?.track_url])

    const handleHoverIndex = useCallback((index: number | null) => {
        setHighlightIndex(index)
    }, [])

    const handleDelete = useCallback(async () => {
        if (!id) return
        setDeleting(true)
        try {
            const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Failed to delete session')
                return
            }
            router.push('/feed')
        } catch {
            setError('Failed to delete session')
        } finally {
            setDeleting(false)
            setShowDeleteConfirm(false)
        }
    }, [id, router])

    const isOwner = user?.id === session?.user_id
    const trackProperties = trackData?.features?.[0]?.properties ?? null

    // Compute max speed over rolling windows from track data
    const speedStats = useMemo(() => {
        if (!trackProperties) return null
        const { times, speeds } = trackProperties
        if (!times?.length || !speeds?.length) return null

        const MS_TO_KNOTS = 1.94384
        const timestamps = times.map(t => new Date(t).getTime())

        function maxAvgSpeedOverWindow(windowSec: number): number {
            const windowMs = windowSec * 1000
            let maxAvg = 0
            let windowStart = 0

            for (let windowEnd = 0; windowEnd < speeds.length; windowEnd++) {
                // Advance start to keep window within duration
                while (windowStart < windowEnd && timestamps[windowEnd] - timestamps[windowStart] > windowMs) {
                    windowStart++
                }
                // Only consider if window spans at least 80% of the target duration
                const actualDuration = timestamps[windowEnd] - timestamps[windowStart]
                if (actualDuration < windowMs * 0.8 && windowSec > 1) continue

                let sum = 0
                for (let i = windowStart; i <= windowEnd; i++) {
                    sum += speeds[i]
                }
                const avg = sum / (windowEnd - windowStart + 1)
                if (avg > maxAvg) maxAvg = avg
            }
            return Math.round(maxAvg * MS_TO_KNOTS * 10) / 10
        }

        const instantMax = Math.round(Math.max(...speeds) * MS_TO_KNOTS * 10) / 10

        return {
            max: instantMax,
            max2s: maxAvgSpeedOverWindow(2),
            max5s: maxAvgSpeedOverWindow(5),
            max10s: maxAvgSpeedOverWindow(10),
            max20s: maxAvgSpeedOverWindow(20),
        }
    }, [trackProperties])

    return (
        <>
            <SignedIn>
                <NavbarLight />

                <section className="bg-light" style={{ minHeight: '100vh' }}>
                    <div className="container py-4">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-10 col-12">

                                <Link href="/community" className="d-inline-flex align-items-center gap-1 text-muted text-decoration-none mb-3">
                                    <BsArrowLeft /> Back to community
                                </Link>

                                {loading && (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                )}

                                {error && (
                                    <div className="text-center py-5">
                                        <p className="text-muted fs-5">{error}</p>
                                    </div>
                                )}

                                {session && (
                                    <>
                                        {/* Header */}
                                        <div className="card border-0 rounded-4 mb-3" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                            <div className="card-body p-4">
                                                <div className="d-flex align-items-center gap-3 mb-3">
                                                    {session.actor?.avatar_url ? (
                                                        <Image src={session.actor.avatar_url} width={48} height={48} className="rounded-circle" alt={session.actor.full_name || session.actor.username} />
                                                    ) : (
                                                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                                                            <span className="text-white fw-bold fs-5">{(session.actor?.full_name || session.actor?.username || 'U')[0]}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Link href={`/u/${session.actor?.username || session.user_id}`} className="fw-semibold text-decoration-none text-dark">
                                                            {session.actor?.full_name || session.actor?.username || 'Unknown'}
                                                        </Link>
                                                        <span className="text-muted ms-1">went {sportLabel(session.type).toLowerCase()}</span>
                                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                            {formatDate(session.start_time || session.created_at)}
                                                            {session.start_time && ` at ${formatTime(session.start_time)}`}
                                                        </div>
                                                    </div>
                                                </div>

                                                {session.spots && (
                                                    <Link href={`/spots/${session.spots.slug}`} className="d-inline-flex align-items-center gap-1 text-decoration-none mb-2">
                                                        <FaLocationDot className="text-primary" size={14} />
                                                        <span className="fw-medium">{session.spots.title}</span>
                                                        {session.spots.locations && (
                                                            <span className="text-muted">, {session.spots.locations.name}</span>
                                                        )}
                                                    </Link>
                                                )}

                                                {session.notes && <p className="mt-2 mb-0">{session.notes}</p>}
                                            </div>
                                        </div>

                                        {/* Track Map + Timeline */}
                                        {session.track_url && (
                                            <div className="card border-0 rounded-4 mb-3 overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                                <TrackMap
                                                    trackData={trackData}
                                                    height="450px"
                                                    highlightIndex={highlightIndex}
                                                    onHoverIndex={handleHoverIndex}
                                                />
                                                <div className="px-3 py-2 d-flex align-items-center gap-2">
                                                    <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                                        <span style={{ width: 12, height: 4, borderRadius: 2, background: 'rgb(0, 200, 50)', display: 'inline-block' }} />
                                                        <span className="text-muted">Slow</span>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                                        <span style={{ width: 12, height: 4, borderRadius: 2, background: 'rgb(255, 200, 50)', display: 'inline-block' }} />
                                                        <span className="text-muted">Medium</span>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                                        <span style={{ width: 12, height: 4, borderRadius: 2, background: 'rgb(255, 0, 50)', display: 'inline-block' }} />
                                                        <span className="text-muted">Fast</span>
                                                    </div>
                                                </div>
                                                <div className="px-2 pb-2">
                                                    <TrackTimeline
                                                        trackData={trackProperties}
                                                        height={160}
                                                        highlightIndex={highlightIndex}
                                                        onHoverIndex={handleHoverIndex}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="card border-0 rounded-4 mb-3" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                            <div className="card-body p-4">
                                                <h6 className="fw-semibold mb-3">Session Stats</h6>
                                                <div className="row g-3">
                                                    <div className="col-6 col-md-4">
                                                        <div className="bg-light rounded-3 p-3 text-center">
                                                            <BsClock className="text-primary mb-1" size={20} />
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Duration</div>
                                                            <div className="fw-semibold fs-5">{formatDuration(session.duration_minutes)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4">
                                                        <div className="bg-light rounded-3 p-3 text-center">
                                                            <BsGeoAlt className="text-primary mb-1" size={20} />
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Distance</div>
                                                            <div className="fw-semibold fs-5">{session.distance_km ? `${session.distance_km} km` : '-'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4">
                                                        <div className="bg-light rounded-3 p-3 text-center">
                                                            <BsSpeedometer className="text-primary mb-1" size={20} />
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Max Speed</div>
                                                            <div className="fw-semibold fs-5">{session.max_speed_kts ? `${session.max_speed_kts} kts` : '-'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4">
                                                        <div className="bg-light rounded-3 p-3 text-center">
                                                            <BsSpeedometer className="text-muted mb-1" size={20} />
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Avg Speed</div>
                                                            <div className="fw-semibold fs-5">{session.avg_speed_kts ? `${session.avg_speed_kts} kts` : '-'}</div>
                                                        </div>
                                                    </div>
                                                    {(session.max_hr && session.max_hr > 0) ? (
                                                        <>
                                                            <div className="col-6 col-md-4">
                                                                <div className="bg-light rounded-3 p-3 text-center">
                                                                    <BsHeart className="text-danger mb-1" size={20} />
                                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Max HR</div>
                                                                    <div className="fw-semibold fs-5">{session.max_hr} bpm</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-4">
                                                                <div className="bg-light rounded-3 p-3 text-center">
                                                                    <BsHeart className="text-muted mb-1" size={20} />
                                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Avg HR</div>
                                                                    <div className="fw-semibold fs-5">{session.avg_hr} bpm</div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Speed Stats */}
                                        {speedStats && (
                                            <div className="card border-0 rounded-4 mb-3" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                                <div className="card-body p-4">
                                                    <h6 className="fw-semibold mb-3">
                                                        <BsSpeedometer className="text-primary me-2" size={18} />
                                                        Speed Analysis
                                                    </h6>
                                                    <div className="row g-3">
                                                        {[
                                                            { label: 'Max', value: speedStats.max, desc: 'Peak' },
                                                            { label: '2s', value: speedStats.max2s, desc: 'Best 2s' },
                                                            { label: '5s', value: speedStats.max5s, desc: 'Best 5s' },
                                                            { label: '10s', value: speedStats.max10s, desc: 'Best 10s' },
                                                            { label: '20s', value: speedStats.max20s, desc: 'Best 20s' },
                                                        ].map(({ label, value, desc }) => (
                                                            <div key={label} className="col">
                                                                <div className="bg-light rounded-3 p-3 text-center">
                                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{desc}</div>
                                                                    <div className="fw-semibold fs-5">{value}</div>
                                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>kts</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Delete */}
                                        {isOwner && (
                                            <div className="mb-3">
                                                {!showDeleteConfirm ? (
                                                    <button
                                                        className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                                                        onClick={() => setShowDeleteConfirm(true)}
                                                    >
                                                        <BsTrash size={14} /> Delete session
                                                    </button>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="text-danger" style={{ fontSize: '0.85rem' }}>Delete this session and all its data?</span>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={handleDelete}
                                                            disabled={deleting}
                                                        >
                                                            {deleting ? 'Deleting...' : 'Yes, delete'}
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            disabled={deleting}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
                <BackToTop />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}

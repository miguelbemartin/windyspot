'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

import NavbarLight from '../../components/navbar/navbar-light'
import Footer from '../../components/footer/footer'
import BackToTop from '../../components/back-to-top'

import Image from 'next/image'
import { BsUpload, BsFileEarmarkArrowUp, BsCheckCircleFill, BsXCircleFill, BsArrowLeft } from 'react-icons/bs'

const SPORT_TYPES = [
    { value: 'windsurfing', label: 'Windsurfing' },
    { value: 'windfoiling', label: 'Windfoiling' },
    { value: 'wingfoiling', label: 'Wingfoiling' },
    { value: 'kitesurfing', label: 'Kitesurfing' },
    { value: 'parawing', label: 'Parawing' },
]

interface ImportResult {
    fileName: string
    status: 'uploading' | 'success' | 'error'
    sessionId?: string
    replaced?: boolean
    error?: string
    stats?: {
        duration_minutes: number
        max_speed_kts: number
        distance_km: number
        spots?: { title: string } | null
    }
}

export default function ImportSessionsPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [sportType, setSportType] = useState('windsurfing')
    const [results, setResults] = useState<ImportResult[]>([])
    const [importing, setImporting] = useState(false)
    const [dragOver, setDragOver] = useState(false)

    async function importFiles(files: FileList | File[]) {
        const gpxFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.gpx'))
        if (gpxFiles.length === 0) return

        setImporting(true)
        const newResults: ImportResult[] = gpxFiles.map(f => ({
            fileName: f.name,
            status: 'uploading' as const,
        }))
        setResults(prev => [...newResults, ...prev])

        for (let i = 0; i < gpxFiles.length; i++) {
            const file = gpxFiles[i]
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', sportType)

            try {
                const res = await fetch('/api/sessions/import', {
                    method: 'POST',
                    body: formData,
                })
                const data = await res.json()

                if (!res.ok) {
                    setResults(prev => prev.map(r =>
                        r.fileName === file.name && r.status === 'uploading'
                            ? { ...r, status: 'error', error: data.error }
                            : r
                    ))
                } else {
                    setResults(prev => prev.map(r =>
                        r.fileName === file.name && r.status === 'uploading'
                            ? {
                                ...r,
                                status: 'success',
                                sessionId: data.id,
                                replaced: data.replaced,
                                stats: {
                                    duration_minutes: data.duration_minutes,
                                    max_speed_kts: data.max_speed_kts,
                                    distance_km: data.distance_km,
                                    spots: data.spots,
                                },
                            }
                            : r
                    ))
                }
            } catch {
                setResults(prev => prev.map(r =>
                    r.fileName === file.name && r.status === 'uploading'
                        ? { ...r, status: 'error', error: 'Network error' }
                        : r
                ))
            }
        }
        setImporting(false)
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) importFiles(e.target.files)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
        if (e.dataTransfer.files) importFiles(e.dataTransfer.files)
    }

    function formatDuration(min: number): string {
        const h = Math.floor(min / 60)
        const m = min % 60
        return h > 0 ? `${h}h ${m}min` : `${m}min`
    }

    const successCount = results.filter(r => r.status === 'success').length

    return (
        <>
            <SignedIn>
                <NavbarLight />

                <section className="bg-light" style={{ minHeight: '100vh' }}>
                    <div className="container py-4">
                        <div className="row justify-content-center">
                            <div className="col-xl-7 col-lg-8 col-md-10 col-12">

                                <Link href="/activity" className="d-inline-flex align-items-center gap-1 text-muted text-decoration-none mb-3">
                                    <BsArrowLeft /> Back to activities
                                </Link>

                                <h1 className="h4 fw-bold mb-1">Import Sessions</h1>
                                <p className="text-muted mb-4">Upload GPX files from Suunto, Garmin, Coros, WaterSpeed, Strava, or any GPS tracker to import your sessions.</p>

                                {/* Sport type selector */}
                                <div className="card border-0 rounded-4 mb-3" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                    <div className="card-body p-4">
                                        <label className="form-label fw-medium mb-2">Sport type</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {SPORT_TYPES.map(({ value, label }) => (
                                                <button
                                                    key={value}
                                                    className={`btn btn-sm rounded-pill px-3 ${sportType === value ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                    onClick={() => setSportType(value)}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Drop zone */}
                                <div
                                    className={`card border-2 border-dashed rounded-4 mb-4 ${dragOver ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                >
                                    <div className="card-body p-5 text-center">
                                        <BsUpload size={32} className={dragOver ? 'text-primary' : 'text-muted'} />
                                        <p className="mt-3 mb-1 fw-medium">
                                            {dragOver ? 'Drop GPX files here' : 'Drag & drop GPX files here'}
                                        </p>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                                            or click to browse (multiple files supported)
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".gpx"
                                            multiple
                                            className="d-none"
                                            onChange={handleFileSelect}
                                        />
                                    </div>
                                </div>

                                {/* Upcoming integrations */}
                                <div className="card border-0 rounded-4 mb-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold mb-2">Direct integrations coming soon</h6>
                                        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                            We&apos;re working on direct integrations so you can sync your sessions automatically — no more manual GPX exports.
                                        </p>
                                        <div className="d-flex flex-wrap align-items-center gap-4">
                                            {[
                                                { name: 'Suunto', src: '/img/brands/suunto.svg', width: 100, height: 24 },
                                                { name: 'Garmin', src: '/img/brands/garmin.svg', width: 100, height: 24 },
                                                { name: 'Coros', src: '/img/brands/coros.png', width: 100, height: 24 },
                                                { name: 'Strava', src: '/img/brands/strava.svg', width: 80, height: 24 },
                                            ].map(brand => (
                                                <Image
                                                    key={brand.name}
                                                    src={brand.src}
                                                    alt={brand.name}
                                                    width={brand.width}
                                                    height={brand.height}
                                                    style={{ objectFit: 'contain', opacity: 0.7 }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Results */}
                                {results.length > 0 && (
                                    <div className="card border-0 rounded-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="fw-semibold mb-0">
                                                    {importing ? 'Importing...' : `${successCount} session${successCount !== 1 ? 's' : ''} imported`}
                                                </h6>
                                                {!importing && successCount > 0 && (
                                                    <button
                                                        className="btn btn-sm btn-primary rounded-pill"
                                                        onClick={() => router.push('/feed')}
                                                    >
                                                        View in feed
                                                    </button>
                                                )}
                                            </div>

                                            <div className="d-flex flex-column gap-2">
                                                {results.map((result, i) => (
                                                    <div key={i} className="d-flex align-items-center gap-3 bg-light rounded-3 p-3">
                                                        {result.status === 'uploading' && (
                                                            <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                                        )}
                                                        {result.status === 'success' && <BsCheckCircleFill className="text-success flex-shrink-0" size={18} />}
                                                        {result.status === 'error' && <BsXCircleFill className="text-danger flex-shrink-0" size={18} />}

                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <BsFileEarmarkArrowUp className="text-muted flex-shrink-0" size={14} />
                                                                <span className="fw-medium text-truncate" style={{ fontSize: '0.9rem' }}>{result.fileName}</span>
                                                                {result.replaced && (
                                                                    <span className="badge bg-warning text-dark rounded-pill" style={{ fontSize: '0.7rem' }}>replaced</span>
                                                                )}
                                                            </div>
                                                            {result.status === 'success' && result.stats && (
                                                                <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                                                                    {formatDuration(result.stats.duration_minutes)}
                                                                    {result.stats.distance_km ? ` · ${result.stats.distance_km} km` : ''}
                                                                    {result.stats.max_speed_kts ? ` · ${result.stats.max_speed_kts} kts max` : ''}
                                                                    {result.stats.spots ? ` · ${result.stats.spots.title}` : ''}
                                                                </div>
                                                            )}
                                                            {result.status === 'error' && (
                                                                <div className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>{result.error}</div>
                                                            )}
                                                        </div>

                                                        {result.status === 'success' && result.sessionId && (
                                                            <Link
                                                                href={`/sessions/${result.sessionId}`}
                                                                className="btn btn-sm btn-outline-primary rounded-pill flex-shrink-0"
                                                            >
                                                                View
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
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

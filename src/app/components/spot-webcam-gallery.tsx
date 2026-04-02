'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { BsCameraVideo, BsX } from 'react-icons/bs'
import { FaRegTrashCan } from 'react-icons/fa6'

interface SpotWebcam {
    id: string
    spot_id: number
    type: 'youtube' | 'image' | 'iframe'
    url: string
    title: string | null
    sort_order: number
    created_at: string
}

function extractYoutubeId(input: string): string | null {
    const trimmed = input.trim()
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
    const match = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
}

export default function SpotWebcamGallery({ spotId }: { spotId: number }) {
    const { user } = useUser()
    const [webcams, setWebcams] = useState<SpotWebcam[]>([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [webcamType, setWebcamType] = useState<'youtube' | 'image' | 'iframe'>('image')
    const [urlInput, setUrlInput] = useState('')
    const [titleInput, setTitleInput] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch(`/api/spot-webcams?spot_id=${spotId}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => { setWebcams(data); setLoading(false) })
    }, [spotId])

    async function handleAdd() {
        if (!urlInput.trim()) {
            setError('URL is required')
            return
        }

        let finalUrl = urlInput.trim()
        if (webcamType === 'youtube') {
            const youtubeId = extractYoutubeId(finalUrl)
            if (!youtubeId) {
                setError('Invalid YouTube video ID or URL')
                return
            }
            finalUrl = youtubeId
        }

        setError('')
        setSubmitting(true)

        const res = await fetch('/api/spot-webcams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spot_id: spotId,
                type: webcamType,
                url: finalUrl,
                title: titleInput.trim() || null,
            }),
        })

        if (res.ok) {
            const webcam = await res.json()
            setWebcams(prev => [...prev, webcam])
            setUrlInput('')
            setTitleInput('')
            setAdding(false)
        } else {
            const data = await res.json()
            setError(data.error || 'Failed to add webcam')
        }
        setSubmitting(false)
    }

    async function deleteWebcam(id: string) {
        const res = await fetch('/api/spot-webcams', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) {
            setWebcams(prev => prev.filter(w => w.id !== id))
        }
    }

    if (loading) return null
    if (webcams.length === 0) return null

    return (
        <div className="listingSingleblock mb-4" id="spot-webcams">
            <div className="SingleblockHeader">
                <Link data-bs-toggle="collapse" data-bs-target="#spotWebcamsPanel" aria-controls="spotWebcamsPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Webcams</h4></Link>
            </div>
            <div id="spotWebcamsPanel" className="panel-collapse collapse show">
                <div className="card-body p-4 pt-3">
                    {error && <div className="alert alert-danger mb-3">{error}</div>}

                    {webcams.length === 0 && !user && (
                        <p className="text-muted mb-0">No webcams yet.</p>
                    )}

                    {webcams.length === 0 && user && !adding && (
                        <div
                            className="border rounded-3 d-flex flex-column align-items-center justify-content-center text-muted"
                            style={{ height: '150px', cursor: 'pointer', borderStyle: 'dashed' }}
                            onClick={() => setAdding(true)}
                        >
                            <BsCameraVideo size={24} className="mb-2" />
                            <span style={{ fontSize: '0.9rem' }}>Add a live webcam for this spot!</span>
                        </div>
                    )}

                    {webcams.length > 0 && (
                        <div className="row g-3">
                            {webcams.map((webcam) => (
                                <div key={webcam.id} className="col-md-6">
                                    <div className="position-relative">
                                        <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
                                            {webcam.type === 'youtube' && (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${webcam.url}?autoplay=0`}
                                                    title={webcam.title || 'Webcam'}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{ border: 'none' }}
                                                />
                                            )}
                                            {webcam.type === 'image' && (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img
                                                    src={webcam.url}
                                                    alt={webcam.title || 'Webcam'}
                                                    className="object-fit-cover w-100 h-100"
                                                />
                                            )}
                                            {webcam.type === 'iframe' && (
                                                <iframe
                                                    src={webcam.url}
                                                    title={webcam.title || 'Webcam'}
                                                    allow="autoplay"
                                                    allowFullScreen
                                                    style={{ border: 'none' }}
                                                />
                                            )}
                                        </div>
                                        {webcam.title && (
                                            <p className="text-small mt-1 mb-0">{webcam.title}</p>
                                        )}
                                        {user && (
                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-circle position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center"
                                                style={{ width: 24, height: 24, padding: 0, zIndex: 2 }}
                                                onClick={() => deleteWebcam(webcam.id)}
                                            >
                                                <FaRegTrashCan size={10} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {user && webcams.length > 0 && !adding && (
                        <div className="d-flex justify-content-end mt-3">
                            <button
                                className="btn btn-link btn-sm text-muted text-decoration-none p-0"
                                onClick={() => setAdding(true)}
                            >
                                <BsCameraVideo className="me-1" /> Add webcam
                            </button>
                        </div>
                    )}

                    {adding && (
                        <div className="mt-3">
                            <div className="mb-2">
                                <label className="form-label fw-medium mb-1">Type</label>
                                <div className="d-flex gap-3">
                                    {([['image', 'Image URL'], ['iframe', 'Iframe URL'], ['youtube', 'YouTube']] as const).map(([value, label]) => (
                                        <div className="form-check" key={value}>
                                            <input
                                                id={`webcam-type-${value}`}
                                                className="form-check-input"
                                                type="radio"
                                                name="webcamType"
                                                checked={webcamType === value}
                                                onChange={() => setWebcamType(value)}
                                            />
                                            <label htmlFor={`webcam-type-${value}`} className="form-check-label">{label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={webcamType === 'youtube' ? 'YouTube video ID or URL' : webcamType === 'image' ? 'Image URL (e.g. https://...)' : 'Iframe URL (e.g. https://...)'}
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Title (optional)"
                                    value={titleInput}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-primary rounded-pill fw-medium"
                                    onClick={handleAdd}
                                    disabled={submitting || !urlInput.trim()}
                                >
                                    {submitting ? 'Adding...' : 'Add'}
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary rounded-pill fw-medium"
                                    onClick={() => { setAdding(false); setUrlInput(''); setTitleInput(''); setError('') }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

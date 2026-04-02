'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { BsYoutube, BsX, BsPlayCircle } from 'react-icons/bs'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useIsAdmin } from '../lib/use-is-admin'

interface SpotVideo {
    id: string
    spot_id: number
    user_id: string
    youtube_id: string
    title: string | null
    created_at: string
    user_profile: {
        user_id: string
        username: string
        full_name: string | null
        avatar_url: string | null
    } | null
}

function extractYoutubeId(input: string): string | null {
    const trimmed = input.trim()
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ]
    for (const pattern of patterns) {
        const match = trimmed.match(pattern)
        if (match) return match[1]
    }
    return null
}

export default function SpotVideoGallery({ spotId }: { spotId: number }) {
    const { user } = useUser()
    const admin = useIsAdmin()
    const [videos, setVideos] = useState<SpotVideo[]>([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [youtubeInput, setYoutubeInput] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [playingId, setPlayingId] = useState<string | null>(null)

    useEffect(() => {
        fetch(`/api/spot-videos?spot_id=${spotId}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => { setVideos(data); setLoading(false) })
    }, [spotId])

    async function handleAdd() {
        const youtubeId = extractYoutubeId(youtubeInput)
        if (!youtubeId) {
            setError('Please enter a valid YouTube video ID or URL')
            return
        }

        setError('')
        setSubmitting(true)

        const res = await fetch('/api/spot-videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spot_id: spotId, youtube_id: youtubeId }),
        })

        if (res.ok) {
            const video = await res.json()
            setVideos(prev => [...prev, video])
            setYoutubeInput('')
            setAdding(false)
        } else {
            const data = await res.json()
            setError(data.error || 'Failed to add video')
        }
        setSubmitting(false)
    }

    async function deleteVideo(id: string) {
        const res = await fetch('/api/spot-videos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) {
            setVideos(prev => prev.filter(v => v.id !== id))
        }
    }

    if (loading) return null
    if (videos.length === 0 && !user) return null

    return (
        <div className="listingSingleblock mb-4" id="spot-videos">
            <div className="SingleblockHeader">
                <Link data-bs-toggle="collapse" data-bs-target="#spotVideosPanel" aria-controls="spotVideosPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Videos</h4></Link>
            </div>
            <div id="spotVideosPanel" className="panel-collapse collapse show">
                <div className="card-body p-4 pt-3">
                    {error && <div className="alert alert-danger mb-3">{error}</div>}

                    {videos.length === 0 && !user && (
                        <p className="text-muted mb-0">No videos yet.</p>
                    )}

                    {videos.length === 0 && user && !adding && (
                        <div
                            className="border rounded-3 d-flex flex-column align-items-center justify-content-center text-muted"
                            style={{ height: '150px', cursor: 'pointer', borderStyle: 'dashed' }}
                            onClick={() => setAdding(true)}
                        >
                            <BsYoutube size={24} className="mb-2" />
                            <span style={{ fontSize: '0.9rem' }}>Be the first to share a video!</span>
                        </div>
                    )}

                    {videos.length > 0 && (
                        <div className="row g-2">
                            {videos.map((video) => (
                                <div key={video.id} className="col-6 col-md-4 col-lg-3">
                                    <div
                                        className="position-relative rounded-3 overflow-hidden"
                                        style={{ paddingTop: '56.25%' }}
                                    >
                                        {playingId === video.id ? (
                                            <iframe
                                                className="position-absolute top-0 start-0 w-100 h-100"
                                                src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`}
                                                title={video.title || 'Spot video'}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                style={{ border: 'none' }}
                                            />
                                        ) : (
                                            <div
                                                style={{ cursor: 'pointer' }}
                                                className="position-absolute top-0 start-0 w-100 h-100"
                                                onClick={() => setPlayingId(video.id)}
                                            >
                                                <Image
                                                    src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                                    fill
                                                    className="object-fit-cover"
                                                    alt={video.title || 'Spot video'}
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                                <div className="position-absolute top-50 start-50 translate-middle">
                                                    <BsPlayCircle size={40} className="text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                                                </div>
                                                {video.user_profile && (
                                                    <div className="position-absolute bottom-0 start-0 w-100 d-flex align-items-center gap-1 px-2 py-2 ps-3 pb-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                                                        {video.user_profile.avatar_url ? (
                                                            <Image src={video.user_profile.avatar_url} width={20} height={20} alt="" className="rounded-circle" style={{ objectFit: 'cover' }} />
                                                        ) : (
                                                            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 20, height: 20, fontSize: '0.6rem' }}>
                                                                {(video.user_profile.full_name || video.user_profile.username || '?').charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <span className="text-white text-truncate" style={{ fontSize: '0.7rem' }}>
                                                            {video.user_profile.full_name || video.user_profile.username}
                                                        </span>
                                                    </div>
                                                )}
                                                {(admin || user?.id === video.user_id) && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger rounded-circle position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center"
                                                        style={{ width: 24, height: 24, padding: 0 }}
                                                        onClick={(e) => { e.stopPropagation(); deleteVideo(video.id) }}
                                                    >
                                                        <FaRegTrashCan size={10} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {user && (
                                <div className="col-6 col-md-4 col-lg-3">
                                    <div
                                        className="position-relative rounded-3 overflow-hidden border d-flex flex-column align-items-center justify-content-center text-muted"
                                        style={{ paddingTop: '56.25%', cursor: 'pointer', borderStyle: 'dashed' }}
                                        onClick={() => setAdding(true)}
                                    >
                                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                                            <BsYoutube size={28} className="mb-1" />
                                            <div style={{ fontSize: '0.8rem' }}>Add video</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {adding && (
                        <div className="mt-3">
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control rounded-start"
                                    placeholder="YouTube video ID or URL"
                                    value={youtubeInput}
                                    onChange={(e) => setYoutubeInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAdd}
                                    disabled={submitting || !youtubeInput.trim()}
                                >
                                    {submitting ? 'Adding...' : 'Add'}
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => { setAdding(false); setYoutubeInput(''); setError('') }}
                                >
                                    <BsX size={20} />
                                </button>
                            </div>
                            <small className="text-muted">Paste a YouTube URL or video ID (e.g. dQw4w9WgXcQ)</small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

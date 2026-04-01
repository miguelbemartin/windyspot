'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { BsChevronLeft, BsChevronRight, BsCamera, BsX } from 'react-icons/bs'
import { FaRegTrashCan } from 'react-icons/fa6'

interface SpotPhoto {
    id: string
    spot_id: number
    user_id: string
    image_url: string
    caption: string | null
    created_at: string
    user_profile: {
        user_id: string
        username: string
        full_name: string | null
        avatar_url: string | null
    } | null
}

export default function SpotPhotoGallery({ spotId }: { spotId: number }) {
    const { user } = useUser()
    const [photos, setPhotos] = useState<SpotPhoto[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetch(`/api/spot-photos?spot_id=${spotId}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => { setPhotos(data); setLoading(false) })
    }, [spotId])

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return
        setUploading(true)
        setUploadError('')

        for (const file of Array.from(files)) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('spot_id', String(spotId))
            const res = await fetch('/api/spot-photos', { method: 'POST', body: formData })
            if (res.ok) {
                const photo = await res.json()
                setPhotos(prev => [...prev, photo])
            } else {
                const data = await res.json()
                setUploadError(`Upload failed: ${data.details || data.error || res.statusText}`)
            }
        }

        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function deletePhoto(id: string) {
        const res = await fetch('/api/spot-photos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) {
            setPhotos(prev => prev.filter(p => p.id !== id))
            if (activeIndex >= photos.length - 1) setActiveIndex(Math.max(0, photos.length - 2))
        }
    }

    function openLightbox(index: number) {
        setActiveIndex(index)
        setLightboxOpen(true)
    }

    function prev() {
        setActiveIndex(i => (i > 0 ? i - 1 : photos.length - 1))
    }

    function next() {
        setActiveIndex(i => (i < photos.length - 1 ? i + 1 : 0))
    }

    useEffect(() => {
        if (!lightboxOpen) return
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') prev()
            else if (e.key === 'ArrowRight') next()
            else if (e.key === 'Escape') setLightboxOpen(false)
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    })

    if (loading) return null
    if (photos.length === 0 && !user) return null

    return (
        <>
            <div className="listingSingleblock mb-4" id="spot-photos">
                <div className="SingleblockHeader">
                    <Link data-bs-toggle="collapse" data-bs-target="#spotPhotosPanel" aria-controls="spotPhotosPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Photos</h4></Link>
                </div>
                <div id="spotPhotosPanel" className="panel-collapse collapse show">
                <div className="card-body p-4 pt-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="d-none"
                        onChange={handleUpload}
                    />
                    {uploadError && <div className="alert alert-danger mb-3">{uploadError}</div>}
                    {photos.length === 0 && !user && (
                        <p className="text-muted mb-0">No photos yet.</p>
                    )}
                    {photos.length === 0 && user && (
                        <div
                            className="border rounded-3 d-flex flex-column align-items-center justify-content-center text-muted"
                            style={{ height: '150px', cursor: 'pointer', borderStyle: 'dashed' }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <BsCamera size={24} className="mb-2" />
                            <span style={{ fontSize: '0.9rem' }}>{uploading ? 'Uploading...' : 'Be the first to share a photo!'}</span>
                        </div>
                    )}
                    {photos.length > 0 && (
                        <div className="row g-2">
                            {photos.map((photo, i) => (
                                <div key={photo.id} className="col-6 col-md-4 col-lg-3">
                                    <div
                                        className="position-relative rounded-3 overflow-hidden"
                                        style={{ paddingTop: '100%', cursor: 'pointer' }}
                                        onClick={() => openLightbox(i)}
                                    >
                                        <Image
                                            src={photo.image_url}
                                            fill
                                            className="object-fit-cover"
                                            alt={photo.caption || 'Spot photo'}
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                        {photo.user_profile && (
                                            <div className="position-absolute bottom-0 start-0 w-100 d-flex align-items-center gap-1 px-2 py-2 ps-3 pb-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                                                {photo.user_profile.avatar_url ? (
                                                    <Image src={photo.user_profile.avatar_url} width={20} height={20} alt="" className="rounded-circle" style={{ objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 20, height: 20, fontSize: '0.6rem' }}>
                                                        {(photo.user_profile.full_name || photo.user_profile.username || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-white text-truncate" style={{ fontSize: '0.7rem' }}>
                                                    {photo.user_profile.full_name || photo.user_profile.username}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {user && (
                                <div className="col-6 col-md-4 col-lg-3">
                                    <div
                                        className="position-relative rounded-3 overflow-hidden border d-flex flex-column align-items-center justify-content-center text-muted"
                                        style={{ paddingTop: '100%', cursor: 'pointer', borderStyle: 'dashed' }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                                            <BsCamera size={28} className="mb-1" />
                                            <div style={{ fontSize: '0.8rem' }}>{uploading ? 'Uploading...' : 'Add photo'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                </div>
            </div>

            {lightboxOpen && photos.length > 0 && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ zIndex: 9999, background: 'rgba(0,0,0,0.9)' }}
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        className="btn btn-link text-white position-absolute top-0 end-0 m-3 p-0"
                        style={{ zIndex: 10 }}
                        onClick={() => setLightboxOpen(false)}
                    >
                        <BsX size={32} />
                    </button>

                    <button
                        className="btn btn-link text-white position-absolute start-0 top-50 translate-middle-y ms-2"
                        onClick={(e) => { e.stopPropagation(); prev() }}
                    >
                        <BsChevronLeft size={28} />
                    </button>

                    <div
                        className="position-relative"
                        style={{ width: '80vw', height: '80vh', maxWidth: '1200px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={photos[activeIndex].image_url}
                            fill
                            className="object-fit-contain"
                            alt={photos[activeIndex].caption || 'Spot photo'}
                            sizes="80vw"
                        />
                    </div>

                    <button
                        className="btn btn-link text-white position-absolute end-0 top-50 translate-middle-y me-2"
                        onClick={(e) => { e.stopPropagation(); next() }}
                    >
                        <BsChevronRight size={28} />
                    </button>

                    <div
                        className="position-absolute bottom-0 start-0 w-100 p-3 d-flex align-items-center justify-content-between"
                        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            {photos[activeIndex].caption && (
                                <p className="text-white mb-1">{photos[activeIndex].caption}</p>
                            )}
                            <span className="text-white-50" style={{ fontSize: '0.85rem' }}>
                                {photos[activeIndex].user_profile?.full_name || photos[activeIndex].user_profile?.username || ''} &middot; {new Date(photos[activeIndex].created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-white-50" style={{ fontSize: '0.85rem' }}>
                                {activeIndex + 1} / {photos.length}
                            </span>
                            {user?.id === photos[activeIndex].user_id && (
                                <button
                                    className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center gap-1"
                                    onClick={() => { deletePhoto(photos[activeIndex].id); if (photos.length <= 1) setLightboxOpen(false) }}
                                >
                                    <FaRegTrashCan size={12} /> Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs'

import { useSupabase } from '../lib/supabase'
import NavbarLight from '../components/navbar/navbar-light'
import SessionCard from '../components/session-card'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { BsHeart, BsHeartFill, BsChatDots, BsWind, BsImage, BsThreeDots, BsPencil, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import CommunityPromo from '../components/community-promo'
import { FaRegTrashCan } from 'react-icons/fa6'
import { FaRegCompass } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdSend } from 'react-icons/md'

interface ActorProfile {
    user_id: string
    username: string
    full_name: string | null
    avatar_url: string | null
}

interface SessionContent {
    id: string
    type: string
    duration_minutes: number | null
    avg_wind_kts: number | null
    max_speed_kts: number | null
    max_hr: number | null
    distance_km: number | null
    notes: string | null
    track_url: string | null
    track_thumbnail_url: string | null
    start_time: string | null
    created_at: string
    spots: { id: number; title: string; slug: string; image: string; locations: { name: string } } | null
}

interface PostContent {
    id: string
    text: string
    image_url: string | null
    image_urls: string[] | null
    video_url: string | null
}

interface SpotGuideContent {
    id: string
    title: string
    description: string | null
    image_url: string | null
    spots: { id: number; title: string; slug: string; image: string } | null
}

interface ForecastContent {
    id: string
    title: string
    forecast_days: { day: string; wind: string; rating: 'great' | 'good' | 'fair' }[]
    spots: { id: number; title: string; slug: string } | null
}

interface ApiFeedItem {
    id: string
    user_id: string
    actor_id: string
    type: 'session' | 'post' | 'spot_guide' | 'forecast'
    reference_id: string
    likes_count: number
    comments_count: number
    created_at: string
    content: SessionContent | PostContent | SpotGuideContent | ForecastContent | null
    actor: ActorProfile | null
    liked: boolean
}

interface CommentData {
    id: string
    text: string
    created_at: string
    user_profiles: ActorProfile | null
}

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

function ratingColor(rating: 'great' | 'good' | 'fair') {
    if (rating === 'great') return 'success'
    if (rating === 'good') return 'primary'
    return 'warning'
}

function activityLabel(type: string, sessionType?: string) {
    switch (type) {
        case 'session': return `went ${sessionType || 'windsurfing'}`
        case 'spot_guide': return 'published a new spot guide'
        case 'forecast': return 'shared a wind forecast'
        case 'post': return 'shared a post'
        default: return ''
    }
}

export default function FeedPage() {
    const { user } = useUser()
    const supabase = useSupabase()
    const [feed, setFeed] = useState<ApiFeedItem[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
    const [commentsCache, setCommentsCache] = useState<Record<string, CommentData[]>>({})
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
    const [newPostText, setNewPostText] = useState('')
    const [posting, setPosting] = useState(false)
    const [composerOpen, setComposerOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'community' | 'all'>('all')
    const [newItemsCount, setNewItemsCount] = useState(0)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [carouselIndexes, setCarouselIndexes] = useState<Record<string, number>>({})
    const sentinelRef = useRef<HTMLDivElement>(null)
    const loadingRef = useRef(false)
    const feedRef = useRef<ApiFeedItem[]>([])
    feedRef.current = feed

    const fetchFeed = useCallback(async (cursor?: string, scope?: string) => {
        const params = new URLSearchParams()
        if (cursor) params.set('cursor', cursor)
        params.set('scope', scope || activeTab)
        const url = `/api/feed?${params.toString()}`
        const res = await fetch(url)
        if (!res.ok) return { items: [], nextCursor: null }
        return res.json()
    }, [activeTab])

    useEffect(() => {
        setLoading(true)
        setFeed([])
        setNextCursor(null)
        fetchFeed(undefined, activeTab).then(data => {
            setFeed(data.items || [])
            setNextCursor(data.nextCursor)
            setLoading(false)
        })
    }, [activeTab, fetchFeed])

    useEffect(() => {
        if (!user?.id) return
        const channel = supabase
            .channel('feed-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'feed_items', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    if (payload.new.actor_id === user.id) return
                    const newId = payload.new.id
                    const existsAlready = feedRef.current.some(fi => fi.id === newId)
                    if (!existsAlready) {
                        setNewItemsCount(prev => prev + 1)
                    }
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user?.id, supabase])

    async function loadNewItems() {
        const data = await fetchFeed()
        const existingIds = new Set(feed.map(fi => fi.id))
        const newItems = (data.items || []).filter((item: ApiFeedItem) => !existingIds.has(item.id))
        if (newItems.length > 0) {
            setFeed(prev => [...newItems, ...prev])
        }
        setNewItemsCount(0)
    }

    const loadMore = useCallback(async () => {
        if (loadingRef.current || !nextCursor) return
        loadingRef.current = true
        setLoadingMore(true)
        const data = await fetchFeed(nextCursor)
        setFeed(prev => [...prev, ...(data.items || [])])
        setNextCursor(data.nextCursor)
        setLoadingMore(false)
        loadingRef.current = false
    }, [nextCursor, fetchFeed])

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore() },
            { rootMargin: '200px' }
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [loadMore])

    async function toggleLike(item: ApiFeedItem) {
        const wasLiked = item.liked
        setFeed(prev => prev.map(fi =>
            fi.id === item.id
                ? { ...fi, liked: !wasLiked, likes_count: wasLiked ? fi.likes_count - 1 : fi.likes_count + 1 }
                : fi
        ))
        await fetch('/api/feed/reactions', {
            method: wasLiked ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feed_item_id: item.id }),
        })
    }

    async function toggleComments(id: string) {
        const next = new Set(expandedComments)
        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
            if (!commentsCache[id]) {
                const res = await fetch(`/api/feed/comments?feed_item_id=${id}`)
                if (res.ok) {
                    const comments = await res.json()
                    setCommentsCache(prev => ({ ...prev, [id]: comments }))
                }
            }
        }
        setExpandedComments(next)
    }

    async function addComment(feedItemId: string) {
        const text = commentInputs[feedItemId]?.trim()
        if (!text) return
        const res = await fetch('/api/feed/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feed_item_id: feedItemId, text }),
        })
        if (res.ok) {
            const comment = await res.json()
            setCommentsCache(prev => ({ ...prev, [feedItemId]: [...(prev[feedItemId] || []), comment] }))
            setCommentInputs(prev => ({ ...prev, [feedItemId]: '' }))
            setFeed(prev => prev.map(fi =>
                fi.id === feedItemId ? { ...fi, comments_count: fi.comments_count + 1 } : fi
            ))
        }
    }

    function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return
        const newFiles = Array.from(files)
        setSelectedImages(prev => [...prev, ...newFiles])
        setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))])
        if (imageInputRef.current) imageInputRef.current.value = ''
    }

    function removeImage(index: number) {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index])
            return prev.filter((_, i) => i !== index)
        })
    }

    function clearImages() {
        imagePreviews.forEach(url => URL.revokeObjectURL(url))
        setSelectedImages([])
        setImagePreviews([])
        if (imageInputRef.current) imageInputRef.current.value = ''
    }

    async function createPost() {
        const text = newPostText.trim()
        if ((!text && selectedImages.length === 0) || posting) return
        setPosting(true)

        const imageUrls: string[] = []
        for (const file of selectedImages) {
            const formData = new FormData()
            formData.append('file', file)
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
            if (uploadRes.ok) {
                const { url } = await uploadRes.json()
                imageUrls.push(url)
            }
        }

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text || '',
                image_urls: imageUrls.length > 0 ? imageUrls : undefined,
            }),
        })
        if (res.ok) {
            setNewPostText('')
            clearImages()
            const data = await fetchFeed()
            setFeed(data.items || [])
            setNextCursor(data.nextCursor)
        }
        setPosting(false)
    }

    function startEditing(item: ApiFeedItem) {
        const content = item.content as PostContent
        setEditingId(item.id)
        setEditText(content.text || '')
    }

    async function saveEdit(item: ApiFeedItem) {
        if (!editingId) return
        const res = await fetch('/api/posts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.reference_id, text: editText }),
        })
        if (res.ok) {
            setFeed(prev => prev.map(fi => {
                if (fi.id !== item.id || fi.type !== 'post') return fi
                const content = fi.content as PostContent
                return { ...fi, content: { ...content, text: editText.trim() } }
            }))
        }
        setEditingId(null)
        setEditText('')
    }

    useEffect(() => {
        if (!openMenuId) return
        function handleClick() { setOpenMenuId(null) }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [openMenuId])

    async function deletePost(item: ApiFeedItem) {
        setOpenMenuId(null)
        const res = await fetch('/api/posts', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.reference_id }),
        })
        if (res.ok) {
            setFeed(prev => prev.filter(fi => fi.id !== item.id))
        }
    }

    function getActorName(item: ApiFeedItem): string {
        return item.actor?.full_name || item.actor?.username || 'Unknown'
    }

    function getActorAvatar(item: ApiFeedItem): string | null {
        return item.actor?.avatar_url || null
    }

    return (
        <>
            <SignedIn>
                <NavbarLight />

                <section className="bg-light" style={{ minHeight: '100vh' }}>
                    <div className="container py-4">
                        <div className="row justify-content-center">
                            <div className="col-xl-10 col-lg-11 col-md-12">
                              <div className="row">
                                <div className="col-lg-8 col-12">

                                <ul className="nav nav-tabs mb-4 border-bottom">
                                    {([['all', 'All'], ['community', 'Local community']] as const).map(([key, label]) => (
                                        <li key={key} className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === key ? 'active' : ''} ${key === 'community' ? 'text-muted' : ''}`}
                                                onClick={() => setActiveTab(key)}
                                                disabled={key === 'community'}
                                                style={{ border: 'none', borderBottom: activeTab === key ? '2px solid var(--bs-primary)' : '2px solid transparent', background: 'none' }}
                                            >
                                                {label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <div className="card border-0 rounded-4 mb-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                    <div className="card-body p-3">
                                        <div className="d-flex gap-3 align-items-start">
                                            <div className="flex-shrink-0">
                                                {user?.imageUrl ? (
                                                    <Image src={user.imageUrl} width={36} height={36} className="rounded-circle" alt="Avatar" />
                                                ) : (
                                                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                                                        <span className="text-white fw-bold">{(user?.fullName || 'U')[0]}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {!composerOpen ? (
                                                <div
                                                    className="flex-grow-1 bg-light rounded-pill px-3 py-2 text-muted"
                                                    style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                                    onClick={() => setComposerOpen(true)}
                                                >
                                                    Share something with the community...
                                                </div>
                                            ) : (
                                                <div className="flex-grow-1">
                                                    <textarea
                                                        className="form-control border-0 bg-light rounded-3"
                                                        rows={3}
                                                        placeholder="Share something with the community..."
                                                        value={newPostText}
                                                        onChange={(e) => setNewPostText(e.target.value)}
                                                        autoFocus
                                                    />
                                                    {imagePreviews.length > 0 && (
                                                        <div className="d-flex gap-2 mt-2 mb-2 overflow-auto">
                                                            {imagePreviews.map((preview, i) => (
                                                                <div key={i} className="position-relative flex-shrink-0" style={{ width: 100, height: 100 }}>
                                                                    <Image src={preview} fill className="object-fit-cover rounded-3" alt={`Preview ${i + 1}`} sizes="100px" />
                                                                    <button
                                                                        className="btn btn-sm btn-dark rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
                                                                        style={{ width: 20, height: 20, padding: 0, margin: 2, fontSize: '0.7rem' }}
                                                                        onClick={() => removeImage(i)}
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                                        <div className="d-flex gap-2">
                                                            <input
                                                                ref={imageInputRef}
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                className="d-none"
                                                                onChange={handleImageSelect}
                                                            />
                                                            <button
                                                                className="btn btn-sm btn-light rounded-pill d-flex align-items-center gap-1"
                                                                onClick={() => imageInputRef.current?.click()}
                                                            >
                                                                <BsImage size={14} /> Photo
                                                            </button>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                                                onClick={() => { setComposerOpen(false); setNewPostText(''); clearImages() }}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-primary rounded-pill px-3"
                                                                onClick={() => { createPost().then(() => setComposerOpen(false)) }}
                                                                disabled={(!newPostText.trim() && selectedImages.length === 0) || posting}
                                                            >
                                                                {posting ? 'Posting...' : 'Post'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {newItemsCount > 0 && (
                                    <button
                                        className="btn btn-primary w-100 rounded-pill mb-3"
                                        onClick={loadNewItems}
                                    >
                                        {newItemsCount} new {newItemsCount === 1 ? 'post' : 'posts'} — tap to see
                                    </button>
                                )}

                                {loading && (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                )}

                                {!loading && feed.length === 0 && (
                                    <div className="text-center py-5 text-muted">
                                        <p className="fs-5">Your feed is empty</p>
                                        <p>Follow other windsurfers or share your first post!</p>
                                    </div>
                                )}

                                {feed.map(item => (
                                    <div key={item.id} className="card border-0 rounded-4 mb-3" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                {getActorAvatar(item) ? (
                                                    <Image src={getActorAvatar(item)!} width={40} height={40} className="rounded-circle" alt={getActorName(item)} />
                                                ) : (
                                                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                                        <span className="text-white fw-bold">{getActorName(item)[0]}</span>
                                                    </div>
                                                )}
                                                <div className="flex-grow-1">
                                                    <Link href={`/u/${item.actor?.username || item.actor_id}`} className="fw-semibold text-decoration-none text-dark">
                                                        {getActorName(item)}
                                                    </Link>
                                                    <span className="text-muted ms-1">
                                                        {activityLabel(item.type, item.type === 'session' ? (item.content as SessionContent)?.type : undefined)}
                                                    </span>
                                                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{timeAgo(item.created_at)}</div>
                                                </div>
                                                {item.type === 'post' && item.actor_id === user?.id && (
                                                    <div className="position-relative">
                                                        <button
                                                            className="btn btn-sm d-flex align-items-center justify-content-center p-0 text-muted"
                                                            style={{ width: '32px', height: '32px' }}
                                                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id) }}
                                                        >
                                                            <BsThreeDots size={18} />
                                                        </button>
                                                        {openMenuId === item.id && (
                                                            <div
                                                                className="position-absolute end-0 bg-white rounded-4 py-2"
                                                                style={{ minWidth: '160px', marginTop: '4px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)', zIndex: 10 }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent px-3 py-2"
                                                                    style={{ fontSize: '14px' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                    onClick={() => { setOpenMenuId(null); startEditing(item) }}
                                                                >
                                                                    <BsPencil size={14} />
                                                                    Edit post
                                                                </button>
                                                                <button
                                                                    className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent text-danger px-3 py-2"
                                                                    style={{ fontSize: '14px' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                    onClick={() => deletePost(item)}
                                                                >
                                                                    <FaRegTrashCan size={14} />
                                                                    Delete post
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {item.type === 'post' && (item.content as PostContent) && (
                                                <>
                                                    {editingId === item.id ? (
                                                        <div className="mb-3">
                                                            <textarea
                                                                className="form-control rounded-3 mb-2"
                                                                rows={3}
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => saveEdit(item)}>Save</button>
                                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => setEditingId(null)}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>{(item.content as PostContent).text}</p>
                                                    )}
                                                    {(() => {
                                                        const pc = item.content as PostContent
                                                        const images = pc.image_urls?.length ? pc.image_urls : pc.image_url ? [pc.image_url] : []
                                                        if (images.length === 0) return null
                                                        if (images.length === 1) {
                                                            return (
                                                                <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '300px' }}>
                                                                    <Image src={images[0]} fill className="object-fit-cover" alt="Post image" sizes="(max-width: 768px) 100vw, 600px" />
                                                                </div>
                                                            )
                                                        }
                                                        const idx = carouselIndexes[item.id] || 0
                                                        return (
                                                            <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '300px' }}>
                                                                <Image src={images[idx]} fill className="object-fit-cover" alt={`Post image ${idx + 1}`} sizes="(max-width: 768px) 100vw, 600px" />
                                                                <button
                                                                    className="btn btn-dark btn-sm rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2 d-flex align-items-center justify-content-center"
                                                                    style={{ width: 32, height: 32, opacity: idx === 0 ? 0.3 : 0.7 }}
                                                                    disabled={idx === 0}
                                                                    onClick={() => setCarouselIndexes(prev => ({ ...prev, [item.id]: idx - 1 }))}
                                                                >
                                                                    <BsChevronLeft size={14} />
                                                                </button>
                                                                <button
                                                                    className="btn btn-dark btn-sm rounded-circle position-absolute top-50 end-0 translate-middle-y me-2 d-flex align-items-center justify-content-center"
                                                                    style={{ width: 32, height: 32, opacity: idx === images.length - 1 ? 0.3 : 0.7 }}
                                                                    disabled={idx === images.length - 1}
                                                                    onClick={() => setCarouselIndexes(prev => ({ ...prev, [item.id]: idx + 1 }))}
                                                                >
                                                                    <BsChevronRight size={14} />
                                                                </button>
                                                                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1">
                                                                    {images.map((_, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="rounded-circle"
                                                                            style={{ width: 8, height: 8, background: i === idx ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                                                                            onClick={() => setCarouselIndexes(prev => ({ ...prev, [item.id]: i }))}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                    })()}
                                                </>
                                            )}

                                            {item.type === 'session' && (item.content as SessionContent) && (
                                                <SessionCard session={item.content as SessionContent} />
                                            )}

                                            {item.type === 'spot_guide' && (item.content as SpotGuideContent) && (() => {
                                                const sg = item.content as SpotGuideContent
                                                return (
                                                    <>
                                                        {sg.description && <p className="mb-3">{sg.description}</p>}
                                                        {(sg.image_url || sg.spots?.image) && (
                                                            <Link href={`/spots/${sg.spots?.slug || ''}`} className="text-decoration-none">
                                                                <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '220px' }}>
                                                                    <Image src={sg.image_url || sg.spots?.image || ''} fill className="object-fit-cover" alt={sg.title} sizes="(max-width: 768px) 100vw, 600px" />
                                                                    <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <FaRegCompass className="text-white" size={18} />
                                                                            <span className="text-white fw-semibold fs-6">{sg.spots?.title || sg.title} — Spot Guide</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        )}
                                                    </>
                                                )
                                            })()}

                                            {item.type === 'forecast' && (item.content as ForecastContent) && (() => {
                                                const fc = item.content as ForecastContent
                                                return (
                                                    <div className="mb-3">
                                                        <p className="mb-3">{fc.title}</p>
                                                        <div className="d-flex flex-column gap-2">
                                                            {fc.forecast_days.map((day, i) => (
                                                                <div key={i} className="d-flex align-items-center justify-content-between bg-light rounded-3 p-2 px-3">
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <BsWind className="text-primary" />
                                                                        <span className="fw-medium">{day.day}</span>
                                                                    </div>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <span>{day.wind}</span>
                                                                        <span className={`badge bg-${ratingColor(day.rating)} rounded-pill`}>{day.rating}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {fc.spots?.slug && (
                                                            <Link href={`/spots/${fc.spots.slug}`} className="btn btn-sm btn-outline-primary rounded-pill mt-2">
                                                                View full forecast
                                                            </Link>
                                                        )}
                                                    </div>
                                                )
                                            })()}

                                            <div className="d-flex align-items-center gap-3 pt-2 border-top">
                                                <button
                                                    className="btn btn-sm d-flex align-items-center gap-1 px-0"
                                                    onClick={() => toggleLike(item)}
                                                    style={{ color: item.liked ? 'var(--bs-primary)' : '#6c757d' }}
                                                >
                                                    {item.liked ? <BsHeartFill size={16} /> : <BsHeart size={16} />}
                                                    <span>{item.likes_count}</span>
                                                </button>
                                                <button
                                                    className="btn btn-sm d-flex align-items-center gap-1 px-0 text-muted"
                                                    onClick={() => toggleComments(item.id)}
                                                >
                                                    <BsChatDots size={16} />
                                                    <span>{item.comments_count}</span>
                                                </button>
                                            </div>

                                            {expandedComments.has(item.id) && (
                                                <div className="mt-3 pt-2 border-top">
                                                    {(commentsCache[item.id] || []).map(comment => (
                                                        <div key={comment.id} className="d-flex gap-2 mb-3">
                                                            {comment.user_profiles?.avatar_url ? (
                                                                <Image src={comment.user_profiles.avatar_url} width={32} height={32} className="rounded-circle flex-shrink-0" alt={comment.user_profiles.full_name || comment.user_profiles.username} />
                                                            ) : (
                                                                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>
                                                                    <span className="text-white" style={{ fontSize: '0.75rem' }}>{(comment.user_profiles?.full_name || comment.user_profiles?.username || '?')[0]}</span>
                                                                </div>
                                                            )}
                                                            <div className="bg-light rounded-3 p-2 px-3 flex-grow-1">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{comment.user_profiles?.full_name || comment.user_profiles?.username || 'Unknown'}</span>
                                                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{timeAgo(comment.created_at)}</span>
                                                                </div>
                                                                <div style={{ fontSize: '0.9rem' }}>{comment.text}</div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="d-flex gap-2 mt-2">
                                                        {user?.imageUrl ? (
                                                            <Image src={user.imageUrl} width={32} height={32} className="rounded-circle flex-shrink-0" alt="You" />
                                                        ) : (
                                                            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>
                                                                <span className="text-white" style={{ fontSize: '0.75rem' }}>{(user?.fullName || 'U')[0]}</span>
                                                            </div>
                                                        )}
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm rounded-pill border-0 bg-light"
                                                                placeholder="Write a comment..."
                                                                value={commentInputs[item.id] || ''}
                                                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                                onKeyDown={(e) => { if (e.key === 'Enter') addComment(item.id) }}
                                                            />
                                                            <button
                                                                className="btn btn-sm btn-primary rounded-pill ms-1 d-flex align-items-center"
                                                                onClick={() => addComment(item.id)}
                                                                disabled={!commentInputs[item.id]?.trim()}
                                                            >
                                                                <MdSend size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div ref={sentinelRef} className="text-center py-4">
                                    {loadingMore && <div className="spinner-border spinner-border-sm text-primary" role="status" />}
                                </div>

                                </div>

                                <div className="col-lg-4 col-12">
                                    <div className="position-lg-sticky" style={{ top: '1.5rem' }}>
                                        <div className="card border-0 rounded-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                            <div className="card-body p-3">
                                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                                    <span>🏆</span> Leaderboard
                                                </h6>
                                                {[
                                                    { rank: 1, name: 'Carlos M.', sessions: 24, avatar: 'C' },
                                                    { rank: 2, name: 'Sofia K.', sessions: 19, avatar: 'S' },
                                                    { rank: 3, name: 'Kai T.', sessions: 17, avatar: 'K' },
                                                    { rank: 4, name: 'Luna R.', sessions: 14, avatar: 'L' },
                                                    { rank: 5, name: 'Marco V.', sessions: 12, avatar: 'M' },
                                                    { rank: 6, name: 'Noa P.', sessions: 10, avatar: 'N' },
                                                    { rank: 7, name: 'Aiden W.', sessions: 9, avatar: 'A' },
                                                    { rank: 8, name: 'Mila J.', sessions: 7, avatar: 'M' },
                                                ].map((entry) => (
                                                    <div key={entry.rank} className="d-flex align-items-center gap-2 mb-2">
                                                        <span className="fw-bold text-muted" style={{ width: '20px', fontSize: '0.85rem', textAlign: 'center' }}>
                                                            {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                                                        </span>
                                                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>
                                                            <span className="text-white" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{entry.avatar}</span>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="fw-medium" style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>{entry.name}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{entry.sessions} sessions this month</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
                <BackToTop />
            </SignedIn>
            <SignedOut>
                <NavbarLight />

                <div className='bg-light'>
                    <CommunityPromo />
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
        </>
    )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'

import { useSupabase } from '../lib/supabase'
import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { BsHeart, BsHeartFill, BsChatDots, BsWind, BsImage, BsThreeDots, BsPencil } from 'react-icons/bs'
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
    distance_km: number | null
    notes: string | null
    spots: { id: number; title: string; slug: string; image: string; locations: { name: string } } | null
}

interface PostContent {
    id: string
    text: string
    image_url: string | null
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

function formatDuration(minutes: number | null): string {
    if (!minutes) return '-'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}min`
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
    const [activeTab, setActiveTab] = useState<'you' | 'community' | 'all'>('all')
    const [newItemsCount, setNewItemsCount] = useState(0)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const loadingRef = useRef(false)
    const profileSynced = useRef(false)
    const feedRef = useRef<ApiFeedItem[]>([])
    feedRef.current = feed

    const syncProfile = useCallback(async () => {
        if (profileSynced.current) return
        profileSynced.current = true
        await fetch('/api/user-profile', { method: 'POST' })
    }, [])

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
        syncProfile()
    }, [syncProfile])

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
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedImage(file)
        setImagePreview(URL.createObjectURL(file))
    }

    function clearImage() {
        setSelectedImage(null)
        setImagePreview(null)
        if (imageInputRef.current) imageInputRef.current.value = ''
    }

    async function createPost() {
        const text = newPostText.trim()
        if ((!text && !selectedImage) || posting) return
        setPosting(true)

        let imageUrl: string | null = null
        if (selectedImage) {
            const formData = new FormData()
            formData.append('file', selectedImage)
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
            if (uploadRes.ok) {
                const { url } = await uploadRes.json()
                imageUrl = url
            }
        }

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text || '', image_url: imageUrl }),
        })
        if (res.ok) {
            setNewPostText('')
            clearImage()
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
                            <div className="col-xl-7 col-lg-8 col-md-10 col-12">

                                <div className="d-flex gap-2 mb-4">
                                    {(['you', 'community', 'all'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            className={`btn btn-sm rounded-pill px-3 ${activeTab === tab ? 'btn-dark' : 'btn-outline-secondary'}`}
                                            onClick={() => setActiveTab(tab)}
                                            disabled={tab === 'community'}
                                        >
                                            {tab === 'you' ? 'You' : tab === 'community' ? 'Local community' : 'All'}
                                        </button>
                                    ))}
                                </div>

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
                                                    {imagePreview && (
                                                        <div className="position-relative mt-2 mb-2">
                                                            <div className="rounded-3 overflow-hidden" style={{ height: '150px' }}>
                                                                <Image src={imagePreview} fill className="object-fit-cover rounded-3" alt="Preview" sizes="400px" />
                                                            </div>
                                                            <button
                                                                className="btn btn-sm btn-dark rounded-circle position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center"
                                                                style={{ width: 24, height: 24, padding: 0 }}
                                                                onClick={clearImage}
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    )}
                                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                                        <div className="d-flex gap-2">
                                                            <input
                                                                ref={imageInputRef}
                                                                type="file"
                                                                accept="image/*"
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
                                                                onClick={() => { setComposerOpen(false); setNewPostText(''); clearImage() }}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-primary rounded-pill px-3"
                                                                onClick={() => { createPost().then(() => setComposerOpen(false)) }}
                                                                disabled={(!newPostText.trim() && !selectedImage) || posting}
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
                                        <p className="fs-5">{activeTab === 'you' ? 'No activity yet' : 'Your feed is empty'}</p>
                                        <p>{activeTab === 'you' ? 'Log a session or share a post to see your activity here.' : 'Follow other windsurfers or share your first post!'}</p>
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
                                                    {(item.content as PostContent).image_url && (
                                                        <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '300px' }}>
                                                            <Image src={(item.content as PostContent).image_url!} fill className="object-fit-cover" alt="Post image" sizes="(max-width: 768px) 100vw, 600px" />
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {item.type === 'session' && (item.content as SessionContent) && (() => {
                                                const session = item.content as SessionContent
                                                const spot = session.spots
                                                return (
                                                    <div className="mb-3">
                                                        {session.notes && <p className="mb-3">{session.notes}</p>}
                                                        {spot?.image && (
                                                            <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '200px' }}>
                                                                <Image src={spot.image} fill className="object-fit-cover" alt={spot.title} sizes="(max-width: 768px) 100vw, 600px" />
                                                                <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                                                                    <Link href={`/spots/${spot.slug}`} className="text-white text-decoration-none fw-semibold">
                                                                        <FaLocationDot className="me-1" />{spot.title}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="row g-2">
                                                            <div className="col-6 col-md-3">
                                                                <div className="bg-light rounded-3 p-2 text-center">
                                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Duration</div>
                                                                    <div className="fw-semibold">{formatDuration(session.duration_minutes)}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-3">
                                                                <div className="bg-light rounded-3 p-2 text-center">
                                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Avg Wind</div>
                                                                    <div className="fw-semibold">{session.avg_wind_kts ? `${session.avg_wind_kts} kts` : '-'}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-3">
                                                                <div className="bg-light rounded-3 p-2 text-center">
                                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Max Speed</div>
                                                                    <div className="fw-semibold">{session.max_speed_kts ? `${session.max_speed_kts} kts` : '-'}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-3">
                                                                <div className="bg-light rounded-3 p-2 text-center">
                                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Distance</div>
                                                                    <div className="fw-semibold">{session.distance_km ? `${session.distance_km} km` : '-'}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })()}

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

'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { BsHeart, BsChatDots, BsPersonPlus } from 'react-icons/bs'

interface NotificationActor {
    user_id: string
    username: string
    full_name: string | null
    avatar_url: string | null
}

interface NotificationItem {
    id: string
    type: 'like' | 'comment' | 'follow'
    actor: NotificationActor | null
    feed_item_id: string | null
    read: boolean
    created_at: string
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

function notificationIcon(type: string) {
    switch (type) {
        case 'like': return <BsHeart size={16} className="text-danger" />
        case 'comment': return <BsChatDots size={16} className="text-primary" />
        case 'follow': return <BsPersonPlus size={16} className="text-success" />
        default: return null
    }
}

function notificationText(type: string, actorName: string) {
    switch (type) {
        case 'like': return <><span className="fw-semibold">{actorName}</span> liked your post</>
        case 'comment': return <><span className="fw-semibold">{actorName}</span> commented on your post</>
        case 'follow': return <><span className="fw-semibold">{actorName}</span> started following you</>
        default: return null
    }
}

export default function NotificationsPage() {
    const { user } = useUser()
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [nextCursor, setNextCursor] = useState<string | null>(null)

    const fetchNotifications = useCallback(async (cursor?: string) => {
        const url = cursor ? `/api/notifications?cursor=${encodeURIComponent(cursor)}` : '/api/notifications'
        const res = await fetch(url)
        if (!res.ok) return { items: [], nextCursor: null }
        return res.json()
    }, [])

    useEffect(() => {
        fetchNotifications().then(data => {
            setNotifications(data.items || [])
            setNextCursor(data.nextCursor)
            setLoading(false)
            fetch('/api/notifications', { method: 'PATCH' })
        })
    }, [fetchNotifications])

    async function loadMore() {
        if (!nextCursor) return
        const data = await fetchNotifications(nextCursor)
        setNotifications(prev => [...prev, ...(data.items || [])])
        setNextCursor(data.nextCursor)
    }

    return (
        <>
            <SignedIn>
                <NavbarLight />

                <section className="bg-light" style={{ minHeight: '100vh' }}>
                    <div className="container py-4">
                        <div className="row justify-content-center">
                            <div className="col-xl-7 col-lg-8 col-md-10 col-12">

                                <h5 className="fw-semibold mb-4">Notifications</h5>

                                {loading && (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                )}

                                {!loading && notifications.length === 0 && (
                                    <div className="text-center py-5 text-muted">
                                        <p className="fs-5">No notifications yet</p>
                                    </div>
                                )}

                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`card border-0 rounded-4 mb-2 ${!n.read ? 'bg-primary bg-opacity-10' : ''}`}
                                        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                                    >
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {n.actor?.avatar_url ? (
                                                        <Image src={n.actor.avatar_url} width={40} height={40} className="rounded-circle" alt={n.actor.full_name || n.actor.username} />
                                                    ) : (
                                                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                                            <span className="text-white fw-bold">{(n.actor?.full_name || n.actor?.username || '?')[0]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        {notificationIcon(n.type)}
                                                        <span style={{ fontSize: '0.9rem' }}>
                                                            {notificationText(n.type, n.actor?.full_name || n.actor?.username || 'Someone')}
                                                        </span>
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{timeAgo(n.created_at)}</div>
                                                </div>
                                                {n.type === 'follow' && n.actor && (
                                                    <Link href={`/u/${n.actor.username}`} className="btn btn-sm btn-outline-primary rounded-pill">
                                                        View
                                                    </Link>
                                                )}
                                                {(n.type === 'like' || n.type === 'comment') && n.feed_item_id && (
                                                    <Link href="/feed" className="btn btn-sm btn-outline-primary rounded-pill">
                                                        View
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {nextCursor && (
                                    <div className="text-center py-3">
                                        <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={loadMore}>
                                            Load more
                                        </button>
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

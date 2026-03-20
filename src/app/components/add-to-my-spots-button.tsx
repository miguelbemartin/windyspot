'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function AddToMySpotsButton({ spotId }: { spotId: number }) {
    const { isSignedIn } = useUser()
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        if (!isSignedIn) return

        async function checkIfAdded() {
            const res = await fetch('/api/my-spots')
            if (res.ok) {
                const data = await res.json()
                setAdded(data.some((s: { spot_id: number }) => s.spot_id === spotId))
            }
        }

        checkIfAdded()
    }, [isSignedIn, spotId])

    async function handleClick() {
        if (!isSignedIn) {
            window.location.href = '/login'
            return
        }

        setLoading(true)

        if (added) {
            const res = await fetch('/api/my-spots', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spot_id: spotId }),
            })
            setLoading(false)
            if (res.ok) setAdded(false)
        } else {
            const res = await fetch('/api/my-spots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spot_id: spotId }),
            })
            setLoading(false)
            if (res.ok) setAdded(true)
        }
    }

    return (
        <button
            className="btn btn-sm rounded-pill fw-semibold text-white"
            style={{backgroundColor: added ? '#999' : '#e05565', maxWidth: '130px'}}
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? 'Saving...' : added ? 'Remove from my spots' : 'Add to my spots'}
        </button>
    )
}

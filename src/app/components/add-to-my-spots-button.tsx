'use client'

import { useState } from 'react'
import { useUser, useSignIn } from '@clerk/nextjs'
import { useSupabase } from '../lib/supabase'

export default function AddToMySpotsButton({ spotId }: { spotId: number }) {
    const { isSignedIn, user } = useUser()
    const supabase = useSupabase()
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleClick() {
        if (!isSignedIn || !user) {
            window.location.href = '/sign-in'
            return
        }

        setLoading(true)
        setError(null)

        const { error: insertError } = await supabase
            .from('user_spots')
            .upsert({ user_id: user.id, spot_id: spotId }, { onConflict: 'user_id,spot_id' })

        setLoading(false)

        if (insertError) {
            setError('Something went wrong')
        } else {
            setAdded(true)
        }
    }

    return (
        <button
            className={`btn btn-sm ${added ? 'btn-light' : 'btn-outline-light'} rounded-pill fw-medium`}
            onClick={handleClick}
            disabled={loading || added}
        >
            {loading ? 'Saving...' : added ? 'Added!' : 'Add to my spots'}
        </button>
    )
}

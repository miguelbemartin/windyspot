'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSupabase } from '../lib/supabase'

export default function AddToMySpotsButton({ spotId }: { spotId: number }) {
    const { isSignedIn, user } = useUser()
    const supabase = useSupabase()
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        if (!isSignedIn || !user) return

        async function checkIfAdded() {
            const { data } = await supabase
                .from('user_spots')
                .select('spot_id')
                .eq('user_id', user!.id)
                .eq('spot_id', spotId)
                .maybeSingle()

            setAdded(!!data)
        }

        checkIfAdded()
    }, [isSignedIn, user, supabase, spotId])

    async function handleClick() {
        if (!isSignedIn || !user) {
            window.location.href = '/sign-in'
            return
        }

        setLoading(true)

        if (added) {
            const { error } = await supabase
                .from('user_spots')
                .delete()
                .eq('user_id', user.id)
                .eq('spot_id', spotId)

            setLoading(false)
            if (!error) setAdded(false)
        } else {
            const { error } = await supabase
                .from('user_spots')
                .upsert({ user_id: user.id, spot_id: spotId }, { onConflict: 'user_id,spot_id' })

            setLoading(false)
            if (!error) setAdded(true)
        }
    }

    return (
        <button
            className="btn btn-sm rounded-pill fw-semibold text-white"
            style={{backgroundColor: added ? '#999' : '#e05565'}}
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? 'Saving...' : added ? 'Remove spot' : 'Add to my spots'}
        </button>
    )
}

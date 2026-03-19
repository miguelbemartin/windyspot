'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function ProfileRedirect() {
    const { isSignedIn, user, isLoaded } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn || !user) {
            router.replace('/login')
            return
        }
        const username = user.username || user.id
        router.replace(`/u/${username}`)
    }, [isLoaded, isSignedIn, user, router])

    return null
}

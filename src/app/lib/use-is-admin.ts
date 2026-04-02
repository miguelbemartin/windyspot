'use client'

import { useUser } from '@clerk/nextjs'

export function useIsAdmin(): boolean {
    const { user } = useUser()
    return user?.publicMetadata?.role === 'admin'
}

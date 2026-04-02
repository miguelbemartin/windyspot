import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'

type AuthResult = { userId: string; response?: never } | { userId?: never; response: NextResponse }

export async function requireAuth(): Promise<AuthResult> {
    const { userId } = await auth()
    if (!userId) {
        return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    return { userId }
}

export async function isAdmin(): Promise<boolean> {
    const user = await currentUser()
    return user?.publicMetadata?.role === 'admin'
}

type AdminAuthResult = { userId: string; response?: never } | { userId?: never; response: NextResponse }

export async function requireAdmin(): Promise<AdminAuthResult> {
    const { userId } = await auth()
    if (!userId) {
        return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    const admin = await isAdmin()
    if (!admin) {
        return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
    }
    return { userId }
}

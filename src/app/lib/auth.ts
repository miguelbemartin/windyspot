import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

type AuthResult = { userId: string; response?: never } | { userId?: never; response: NextResponse }

export async function requireAuth(): Promise<AuthResult> {
    const { userId } = await auth()
    if (!userId) {
        return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    return { userId }
}

import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { createAdminClient } from '../../lib/supabase-server'
import { requireAuth } from '../../lib/auth'

export async function POST() {
    const { userId, response } = await requireAuth()
    if (response) return response

    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
            user_id: userId,
            username: user.username || userId,
            full_name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
            avatar_url: user.imageUrl || null,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to sync profile' }, { status: 500 })
    }

    return NextResponse.json(data)
}

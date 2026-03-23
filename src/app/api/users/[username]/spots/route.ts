import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { createAdminClient } from '../../../../lib/supabase-server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params

    const client = await clerkClient()
    const users = await client.users.getUserList({ username: [username], limit: 1 })

    if (users.data.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const clerkUser = users.data[0]

    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('user_spots')
        .select('spot_id, spots(id, slug, title, image, location_id, lat, lon, locations(name))')
        .eq('user_id', clerkUser.id)

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch spots' }, { status: 500 })
    }

    const locationMeta = (clerkUser.unsafeMetadata as Record<string, unknown>)?.location as
        { text?: string; lat?: number; lon?: number } | undefined

    return NextResponse.json({
        user: {
            id: clerkUser.id,
            fullName: clerkUser.fullName,
            imageUrl: clerkUser.imageUrl,
            username: clerkUser.username,
            location: locationMeta || null,
        },
        spots: data,
    })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username } = await params
    const client = await clerkClient()
    const users = await client.users.getUserList({ username: [username], limit: 1 })

    if (users.data.length === 0 || users.data[0].id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { spot_id } = await request.json()

    const supabase = createAdminClient()
    const { error } = await supabase
        .from('user_spots')
        .delete()
        .eq('user_id', userId)
        .eq('spot_id', spot_id)

    if (error) {
        return NextResponse.json({ error: 'Failed to remove spot' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}

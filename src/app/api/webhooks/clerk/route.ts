import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { createAdminClient } from '../../../lib/supabase-server'

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || ''

interface ClerkUserEvent {
    data: {
        id: string
        username: string | null
        first_name: string | null
        last_name: string | null
        image_url: string | null
    }
    type: string
}

export async function POST(request: NextRequest) {
    if (!WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const svixId = request.headers.get('svix-id') || ''
    const svixTimestamp = request.headers.get('svix-timestamp') || ''
    const svixSignature = request.headers.get('svix-signature') || ''

    const body = await request.text()

    let event: ClerkUserEvent
    try {
        const wh = new Webhook(WEBHOOK_SECRET)
        event = wh.verify(body, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        }) as ClerkUserEvent
    } catch {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const supabase = createAdminClient()

    if (event.type === 'user.created' || event.type === 'user.updated') {
        const { id, username, first_name, last_name, image_url } = event.data
        await supabase
            .from('user_profiles')
            .upsert({
                user_id: id,
                username: username || id,
                full_name: [first_name, last_name].filter(Boolean).join(' ') || null,
                avatar_url: image_url || null,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' })
    }

    if (event.type === 'user.deleted') {
        await supabase
            .from('user_profiles')
            .delete()
            .eq('user_id', event.data.id)
    }

    return NextResponse.json({ received: true })
}

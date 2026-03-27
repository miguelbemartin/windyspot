import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { createAdminClient } from '../../../../lib/supabase-server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params

    const client = await clerkClient()
    const users = await client.users.getUserList({ username: [username], limit: 1 })

    if (users.data.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = users.data[0].id

    const supabase = createAdminClient()

    // Fetch sessions from the last 52 weeks
    const since = new Date()
    since.setDate(since.getDate() - 364)
    const sinceStr = since.toISOString()

    const { data, error } = await supabase
        .from('sessions')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', sinceStr)
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
    }

    // Group by date
    const counts: Record<string, number> = {}
    for (const row of data) {
        const date = row.created_at.slice(0, 10)
        counts[date] = (counts[date] || 0) + 1
    }

    return NextResponse.json({ activity: counts })
}

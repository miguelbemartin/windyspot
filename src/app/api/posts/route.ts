import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '../../lib/supabase-server'
import { fanoutToFollowers } from '../../lib/fanout'

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { text, image_url, video_url } = body

    if (!text?.trim() && !image_url && !video_url) {
        return NextResponse.json({ error: 'text, image, or video is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: post, error } = await supabase
        .from('user_posts')
        .insert({
            user_id: userId,
            text: text?.trim() || '',
            image_url: image_url || null,
            video_url: video_url || null,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    await fanoutToFollowers(supabase, userId, 'post', post.id, post.created_at)

    return NextResponse.json(post, { status: 201 })
}

export async function PATCH(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, text } = await request.json()
    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: existing } = await supabase
        .from('user_posts')
        .select('user_id')
        .eq('id', id)
        .single()

    if (!existing) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existing.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: post, error } = await supabase
        .from('user_posts')
        .update({ text: text?.trim() || '' })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }

    return NextResponse.json(post)
}

export async function DELETE(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()
    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: existing } = await supabase
        .from('user_posts')
        .select('user_id')
        .eq('id', id)
        .single()

    if (!existing) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existing.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
        .from('user_posts')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

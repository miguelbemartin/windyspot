import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase-server'
import { requireAuth } from '../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const spotId = request.nextUrl.searchParams.get('spot_id')
    if (!spotId) {
        return NextResponse.json({ error: 'spot_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: photos, error } = await supabase
        .from('spot_photos')
        .select('*, user_profiles(user_id, username, full_name, avatar_url)')
        .eq('spot_id', spotId)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
    }

    return NextResponse.json(photos)
}

export async function POST(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const spotId = formData.get('spot_id') as string | null
    const caption = formData.get('caption') as string | null

    if (!file || !spotId) {
        return NextResponse.json({ error: 'file and spot_id are required' }, { status: 400 })
    }

    const ALLOWED_TYPES: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
    }

    if (!ALLOWED_TYPES[file.type]) {
        return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json({ error: 'File too large (max 20 MB)' }, { status: 400 })
    }

    const ext = ALLOWED_TYPES[file.type]
    const path = `spots/${spotId}/${Date.now()}.${ext}`

    const supabase = createAdminClient()

    const { error: uploadError } = await supabase.storage
        .from('public-images')
        .upload(path, file, { upsert: false })

    if (uploadError) {
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('public-images').getPublicUrl(path)

    const { data: photo, error } = await supabase
        .from('spot_photos')
        .insert({
            spot_id: parseInt(spotId),
            user_id: userId,
            image_url: urlData.publicUrl,
            caption: caption?.trim() || null,
        })
        .select('*, user_profiles(user_id, username, full_name, avatar_url)')
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 })
    }

    return NextResponse.json(photo, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const { id } = await request.json()
    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: existing } = await supabase
        .from('spot_photos')
        .select('user_id')
        .eq('id', id)
        .single()

    if (!existing) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    if (existing.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
        .from('spot_photos')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

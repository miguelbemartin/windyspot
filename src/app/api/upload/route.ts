import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase-server'
import { requireAuth } from '../../lib/auth'

const ALLOWED_TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
}
const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

export async function POST(request: NextRequest) {
    const { userId, response } = await requireAuth()
    if (response) return response

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
        return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    if (!ALLOWED_TYPES[file.type]) {
        return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
    }

    const ext = ALLOWED_TYPES[file.type]
    const path = `posts/${userId}/${Date.now()}.${ext}`

    const supabase = createAdminClient()

    const { error } = await supabase.storage
        .from('public-images')
        .upload(path, file, { upsert: false })

    if (error) {
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('public-images').getPublicUrl(path)

    return NextResponse.json({ url: urlData.publicUrl })
}

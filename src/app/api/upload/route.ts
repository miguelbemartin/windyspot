import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '../../lib/supabase-server'

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
        return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'jpg'
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

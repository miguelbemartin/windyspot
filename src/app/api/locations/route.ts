import { NextResponse } from 'next/server'
import { getLocations } from '../../lib/spots'
import { requireAdmin } from '../../lib/auth'
import { createAdminClient } from '../../lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const locations = await getLocations()
    return NextResponse.json(locations)
}

export async function POST(request: Request) {
    const authResult = await requireAdmin()
    if (authResult.response) return authResult.response

    const body = await request.json()
    const { name, country, description, image, featured } = body

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('locations')
        .insert({
            name,
            slug,
            country: country || null,
            description: description || null,
            image: image || '',
            big: false,
            featured: featured || false,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: Request) {
    const authResult = await requireAdmin()
    if (authResult.response) return authResult.response

    const body = await request.json()
    const { id, name, description, country, image, featured } = body

    if (!id) {
        return NextResponse.json({ error: 'Missing location id' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const updates: Record<string, unknown> = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (country !== undefined) updates.country = country
    if (image !== undefined) updates.image = image
    if (featured !== undefined) updates.featured = featured

    const { data, error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

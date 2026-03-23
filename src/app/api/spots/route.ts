import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSpots } from '../../lib/spots'
import { createAdminClient } from '../../lib/supabase-server'

export async function GET() {
    const spots = await getSpots()
    return NextResponse.json(spots)
}

export async function PATCH(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, spot_guide, windguru_forecast_id, windguru_live_station_id } = body

    if (!id) {
        return NextResponse.json({ error: 'Spot ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: existing, error: fetchError } = await supabase
        .from('spots')
        .select('created_by')
        .eq('id', id)
        .single()

    if (fetchError || !existing) {
        return NextResponse.json({ error: 'Spot not found' }, { status: 404 })
    }

    if (existing.created_by !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updates: Record<string, unknown> = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (spot_guide !== undefined) updates.spot_guide = spot_guide || null
    if (windguru_forecast_id !== undefined) updates.windguru_forecast_id = windguru_forecast_id || null
    if (windguru_live_station_id !== undefined) updates.windguru_live_station_id = windguru_live_station_id || null

    const { data: spot, error } = await supabase
        .from('spots')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to update spot' }, { status: 500 })
    }

    return NextResponse.json(spot)
}

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, image, spot_guide, location_id, new_location_name, new_location_country, windguru_forecast_id, windguru_live_station_id, lat, lon } = body

    if (!title || !description) {
        return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    if (!location_id && !new_location_name) {
        return NextResponse.json({ error: 'A location is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    let finalLocationId = location_id
    let locationSlug: string

    const toSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    if (!location_id && new_location_name) {
        locationSlug = toSlug(new_location_name)
        const { data: newLocation, error: locError } = await supabase
            .from('locations')
            .insert({
                name: new_location_name,
                slug: locationSlug,
                image: '',
                big: false,
                featured: false,
                country: new_location_country || null,
            })
            .select('id')
            .single()

        if (locError) {
            return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
        }
        finalLocationId = newLocation.id
    } else {
        const { data: location, error: locError } = await supabase
            .from('locations')
            .select('slug')
            .eq('id', finalLocationId)
            .single()

        if (locError || !location) {
            return NextResponse.json({ error: 'Location not found' }, { status: 400 })
        }
        locationSlug = location.slug
    }

    const spotSlug = toSlug(title)
    const slug = `${locationSlug}/${spotSlug}`

    const { data: spot, error } = await supabase
        .from('spots')
        .insert({
            title,
            slug,
            description,
            image: image || '',
            featured: false,
            location_id: finalLocationId,
            rental_place: false,
            tag: '',
            windguru_forecast_id: windguru_forecast_id || null,
            windguru_live_station_id: windguru_live_station_id || null,
            spot_guide: spot_guide || null,
            custom_page: false,
            lat: lat ?? null,
            lon: lon ?? null,
            created_by: userId,
        })
        .select('*')
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to create spot' }, { status: 500 })
    }

    return NextResponse.json(spot, { status: 201 })
}

import { createAdminClient } from './supabase-server'

export interface Location {
    id: number
    name: string
    slug: string
    image: string
    big: boolean
    featured: boolean
    country: string | null
    description: string | null
}

export interface Spot {
    id: number
    slug: string
    title: string
    description: string
    image: string
    featured: boolean
    location_id: number
    rental_place: boolean
    tag: string
    windguru_forecast_id: string | null
    windguru_live_station_id: string | null
    custom_page: boolean
    lat: number | null
    lon: number | null
    created_by: string | null
    spot_guide: string | null
}

export interface SpotWithLocation extends Spot {
    location: Location
}

export async function getLocations(): Promise<Location[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name')
    if (error) throw error
    return data
}

export async function getFeaturedLocations(): Promise<Location[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('featured', true)
        .order('name')
    if (error) throw error
    return data
}

export async function getSpots(): Promise<SpotWithLocation[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('spots')
        .select('*, location:locations(*)')
        .order('id')
    if (error) throw error
    return data as SpotWithLocation[]
}

export async function getFeaturedSpots(): Promise<SpotWithLocation[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('spots')
        .select('*, location:locations(*)')
        .eq('featured', true)
        .order('id')
    if (error) throw error
    return data as SpotWithLocation[]
}

export async function getSpotBySlug(slug: string): Promise<SpotWithLocation | null> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('spots')
        .select('*, location:locations(*)')
        .eq('slug', slug)
        .single()
    if (error) return null
    return data as SpotWithLocation
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('slug', slug)
        .single()
    if (error) return null
    return data
}

export async function getSpotsByLocationId(locationId: number): Promise<SpotWithLocation[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('spots')
        .select('*, location:locations(*)')
        .eq('location_id', locationId)
        .order('title')
    if (error) throw error
    return data as SpotWithLocation[]
}

export async function getLocationsWithSpots(): Promise<(Location & { spots: Spot[] })[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('locations')
        .select('*, spots(*)')
        .order('id')
    if (error) throw error
    return data as (Location & { spots: Spot[] })[]
}

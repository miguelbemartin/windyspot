import { createAdminClient } from './supabase-server'
import { DEFAULT_CACHE_TTL_MS } from './constants'

export async function getCached<T>(key: string, ttlMs = DEFAULT_CACHE_TTL_MS): Promise<T | null> {
    const supabase = createAdminClient()
    const { data } = await supabase
        .from('api_cache')
        .select('data, cached_at')
        .eq('cache_key', key)
        .single()

    if (!data) return null

    const age = Date.now() - new Date(data.cached_at).getTime()
    if (age > ttlMs) return null

    return data.data as T
}

export async function setCached(key: string, value: unknown): Promise<void> {
    const supabase = createAdminClient()
    await supabase
        .from('api_cache')
        .upsert({ cache_key: key, data: value, cached_at: new Date().toISOString() })
}

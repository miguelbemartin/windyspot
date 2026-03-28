# Task: API Response Cache (Supabase)

## Goal

Cache external API responses (starting with Apple WeatherKit) in a shared Supabase table so that identical or near-identical requests within the same hour are served from cache instead of hitting the external API again. This reduces API usage, lowers latency for repeat requests, and avoids rate limits.

## Requirements

- Cache is shared across all users and all serverless instances
- Cache TTL: 1 hour
- Coordinates are not rounded, as we will use the coordinates from the spots that are shared
- Cache key includes: lat/lon + dataSets parameter
- Cache miss → call external API → store result → return
- Cache hit (< 1 hour old) → return cached data directly
- Generic enough to reuse for other non-user-specific API calls in the future

## Implementation Plan

### Step 1: Supabase migration — `api_cache` table

Create `supabase/migrations/20260323000000_api_cache.sql`:

```sql
create table if not exists api_cache (
    cache_key text primary key,
    data jsonb not null,
    cached_at timestamptz not null default now()
);

create index idx_api_cache_cached_at on api_cache (cached_at);
```

### Step 2: Cache helper — `src/app/lib/api-cache.ts`

Create a shared utility with:

- `getCached<T>(key, ttlMs?)` — queries `api_cache` by key, returns `null` if missing or expired (older than ttlMs, default 1 hour)
- `setCached(key, data)` — upserts the cache entry with current timestamp

### Step 3: Update weather route — `src/app/api/weather/route.ts`

Modify the GET handler to:

1. Build cache key: `weather:${lat}:${lon}:${dataSets}`
2. Call `getCached(cacheKey)`
3. If cache hit → return cached data immediately
4. If cache miss → call Apple WeatherKit as before → call `setCached(cacheKey, data)` → return data
5. Remove the `next: { revalidate: 600 }` option from the fetch call since we now handle caching ourselves

### Step 4 (optional, future): Stale cache cleanup

Add a periodic cleanup mechanism (e.g., a cron or Supabase pg_cron) to delete rows where `cached_at < now() - interval '24 hours'` to prevent table bloat. Not needed initially since expired rows are simply ignored.

## Files Changed

| File | Action |
|------|--------|
| `supabase/migrations/20260323000000_api_cache.sql` | New — creates `api_cache` table |
| `src/app/lib/api-cache.ts` | New — shared cache get/set helpers |
| `src/app/api/weather/route.ts` | Modified — add cache check before Apple API call |

## Notes

- Exact coordinates are used as cache keys (no rounding). Spot-based forecasts will cache well since all users share the same spot coords. User-location weather calls may not get cache hits unless two users have identical coordinates — this can be optimized later with rounding if needed.
- The `api_cache` table and helpers are generic — any future external API route can use the same pattern by choosing a different key prefix (e.g., `webcam:`, `tides:`).
- No user-specific data is stored in this cache. User-specific routes (feed, notifications, profile, etc.) are not affected.

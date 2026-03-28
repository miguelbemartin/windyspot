# Task: Strava Integration

## Goal
Allow users to connect their Strava account and automatically import windsurf, kitesurf, wingfoil, and windfoil sessions into Windy Spot. Sessions should appear in the activity feed and include GPS tracks, stats, and heart rate data — the same as GPX imports.

## Approach
Direct integration with the Strava V3 API using OAuth 2.0. Strava provides a publicly available, well-documented API with no approval process — just register an app at https://www.strava.com/settings/api.

**Flow:**
1. User connects their Strava account via OAuth 2.0
2. On first connect, we do a historical backfill of recent water sport activities
3. User can trigger a manual sync from the import page
4. (Future) Strava webhook pushes new activities automatically

## Requirements
- Users can connect/disconnect their Strava account from profile settings
- Imported Strava activities appear as sessions with full GPS tracks, speed, HR, and duration
- Only water sport activities are imported (Windsurf, Kitesurf, Sail, Windfoil, etc.)
- GPS tracks are stored in the same GeoJSON format as GPX imports
- Track thumbnails are generated the same way as GPX imports
- Duplicate activities are not imported twice (`external_id` + `source` uniqueness)
- GPS coordinates are matched to the nearest known spot (within ~5km)
- Imported sessions appear in the feed with a "via Strava" badge
- **Strava attribution**: display "Powered by Strava" and link back to the original activity (required by Strava API Agreement)
- OAuth tokens are refreshed automatically when expired

## Strava API Details

### Authentication
- **OAuth 2.0** (standard flow, not 1.0a like Garmin)
- Authorization URL: `https://www.strava.com/oauth/authorize`
- Token URL: `https://www.strava.com/oauth/token`
- Scopes needed: `read,activity:read_all`
- Tokens expire every 6 hours, refresh via `grant_type=refresh_token`

### Key Endpoints
| Endpoint | Purpose |
|---|---|
| `GET /api/v3/athlete` | Get connected user info |
| `GET /api/v3/athlete/activities` | List activities (paginated, 30/page, max 200/page) |
| `GET /api/v3/activities/{id}` | Get activity detail |
| `GET /api/v3/activities/{id}/streams?keys=latlng,heartrate,velocity_smooth,time,altitude` | Get GPS + sensor data streams |

### Rate Limits
- **100 requests per 15 minutes** (per access token)
- **1,000 requests per day** (per application)
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Usage`
- Strategy: import activities sequentially, check rate limit headers, back off if approaching limits

### Sport Type Mapping
| Strava Sport Type | Windy Spot Session Type | Import? |
|---|---|---|
| `Windsurf` | windsurfing | Yes |
| `Kitesurf` | kitesurfing | Yes |
| `Sail` | windsurfing | Yes (best match) |
| `Workout` (if tagged water sport) | — | Skip (too ambiguous) |
| Everything else | — | Skip |

Note: Strava does not currently have dedicated types for wingfoiling or windfoiling. Users who log these sports often use `Windsurf` or `Kitesurf`. We should allow users to correct the sport type after import.

### Activity Data Available
| Field | Source | Notes |
|---|---|---|
| Start time | `activity.start_date` | ISO 8601 UTC |
| Duration | `activity.elapsed_time` | Seconds |
| Distance | `activity.distance` | Meters |
| GPS track | Streams API (`latlng`) | Array of `[lat, lon]` pairs |
| Speed | Streams API (`velocity_smooth`) | m/s, needs conversion to knots |
| Heart rate | Streams API (`heartrate`) | BPM (only if HR monitor was used) |
| Elevation | Streams API (`altitude`) | Meters |
| Max speed | `activity.max_speed` | m/s |
| Average speed | `activity.average_speed` | m/s |
| Max HR | `activity.max_heartrate` | BPM |
| Average HR | `activity.average_heartrate` | BPM |
| Start coords | `activity.start_latlng` | `[lat, lon]` |

## Database Changes

### New table: `connected_accounts`
Shared with future Coros/Garmin integrations. If the Coros task already created this table, skip this migration.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | text | NOT NULL, Clerk user ID |
| provider | text | NOT NULL, 'strava' |
| provider_user_id | text | NOT NULL, Strava athlete ID |
| access_token | text | NOT NULL |
| refresh_token | text | NOT NULL |
| expires_at | timestamptz | NOT NULL |
| scopes | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |
| | | UNIQUE(user_id, provider) |

### Changes to `sessions` table
If not already added by the Coros task:

| Column | Type | Notes |
|---|---|---|
| external_id | text | nullable, Strava activity ID |
| | | UNIQUE(source, external_id) WHERE external_id IS NOT NULL |

The `source` column already exists (values: `'manual'`, `'gpx_import'`). Add `'strava'` as a valid value.

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/integrations/strava/connect` | GET | Redirect to Strava OAuth authorization URL |
| `/api/integrations/strava/callback` | GET | Handle OAuth callback, exchange code for tokens, store in `connected_accounts` |
| `/api/integrations/strava` | GET | Get connection status (connected/disconnected, athlete name) |
| `/api/integrations/strava` | DELETE | Disconnect: revoke token + delete from `connected_accounts` |
| `/api/integrations/strava/sync` | POST | Trigger sync: fetch recent activities, import new ones |

### OAuth Connect Flow
1. `GET /api/integrations/strava/connect`
   - Generate random `state` parameter, store in cookie (CSRF protection)
   - Redirect to: `https://www.strava.com/oauth/authorize?client_id=...&redirect_uri=...&response_type=code&scope=read,activity:read_all&state=...`

2. `GET /api/integrations/strava/callback?code=...&state=...`
   - Validate `state` matches cookie
   - Exchange `code` for tokens: `POST https://www.strava.com/oauth/token`
   - Response includes `access_token`, `refresh_token`, `expires_at`, and `athlete` object
   - Upsert into `connected_accounts` (user_id, provider='strava', provider_user_id=athlete.id)
   - Redirect to `/profile?connected=strava`

### Token Refresh
- Before any Strava API call, check if `expires_at` < now
- If expired, call `POST https://www.strava.com/oauth/token` with `grant_type=refresh_token`
- Update `access_token`, `refresh_token`, `expires_at` in `connected_accounts`
- Wrap in a helper: `getValidStravaToken(userId): Promise<string>`

### Sync Flow (`POST /api/integrations/strava/sync`)
1. Get valid access token (refresh if needed)
2. Fetch activities: `GET /api/v3/athlete/activities?after={lastSyncTimestamp}&per_page=50`
3. Filter by sport type (only `Windsurf`, `Kitesurf`, `Sail`)
4. For each matching activity:
   a. Check duplicate: query `sessions` where `source='strava'` AND `external_id=activity.id`
   b. If exists, skip
   c. Fetch streams: `GET /api/v3/activities/{id}/streams?keys=latlng,heartrate,velocity_smooth,time,altitude`
   d. Convert streams to GeoJSON (same format as GPX parser output)
   e. Compute metadata: duration, distance, max/avg speed, max/avg HR
   f. Auto-match nearest spot by `start_latlng`
   g. Insert session with `source='strava'`, `external_id=activity.id`
   h. Upload GeoJSON track to Supabase Storage
   i. Generate track thumbnail
   j. Fanout to followers
5. Return summary: `{ imported: number, skipped: number, errors: number }`

## New Files

| File | Purpose |
|---|---|
| `supabase/migrations/XXXXXX_connected_accounts.sql` | Migration for `connected_accounts` table + `external_id` on sessions (skip if Coros task already created it) |
| `src/app/api/integrations/strava/connect/route.ts` | OAuth redirect to Strava |
| `src/app/api/integrations/strava/callback/route.ts` | OAuth callback handler |
| `src/app/api/integrations/strava/route.ts` | GET status, DELETE disconnect |
| `src/app/api/integrations/strava/sync/route.ts` | Trigger activity sync |
| `src/app/lib/strava.ts` | Strava API client: token refresh, fetch activities, fetch streams, convert to GeoJSON |

## Modified Files

| File | Change |
|---|---|
| `src/app/u/[username]/page.tsx` | Add "Connected Accounts" section with Strava connect/disconnect button |
| `src/app/sessions/import/page.tsx` | Add "Import from Strava" button alongside GPX upload |
| `src/app/components/session-card.tsx` | Show "via Strava" badge + link to original activity when `source === 'strava'` |
| `src/app/community/page.tsx` | Show "via Strava" badge on feed items with Strava sessions |
| `src/middleware.ts` | Ensure `/api/integrations/strava/callback` is accessible (not blocked by auth middleware) |

## Environment Variables

```
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=https://www.windyspot.com   # base URL for OAuth redirect_uri
```

For local development, set `NEXT_PUBLIC_APP_URL=http://localhost:3000` and configure Strava's Authorization Callback Domain to `localhost`.

## Strava Attribution Requirements

Per the Strava API Agreement, we must:
- Display the **"Powered by Strava"** logo on any page showing Strava-sourced data
- Link imported activities back to the original Strava activity URL: `https://www.strava.com/activities/{id}`
- Not cache Strava data longer than necessary
- Not replicate the Strava experience (we're showing windsurf-specific data, so this is fine)

Logo assets: https://developers.strava.com/guidelines/

## Implementation Phases

### Phase 1 — Database & OAuth Flow
- [ ] Create `connected_accounts` table migration (or reuse from Coros task)
- [ ] Add `external_id` column to `sessions` with partial unique index
- [ ] Implement OAuth connect route (`/api/integrations/strava/connect`)
- [ ] Implement OAuth callback route (`/api/integrations/strava/callback`)
- [ ] Implement disconnect route (`DELETE /api/integrations/strava`)
- [ ] Implement status route (`GET /api/integrations/strava`)
- [ ] Token refresh helper in `src/app/lib/strava.ts`

### Phase 2 — Activity Sync
- [ ] Strava API client: fetch activities list, fetch activity streams
- [ ] Stream-to-GeoJSON converter (reuse GeoJSON format from GPX parser)
- [ ] Sync route (`POST /api/integrations/strava/sync`)
- [ ] Duplicate prevention via `source` + `external_id`
- [ ] Spot auto-matching (reuse existing haversine logic from GPX import)
- [ ] Track upload to Supabase Storage + thumbnail generation (reuse from GPX import)
- [ ] Feed fanout for new sessions (reuse existing `fanoutToFollowers`)

### Phase 3 — UI
- [ ] Profile page: "Connected Accounts" section with Strava connect/disconnect
- [ ] Import page: "Import from Strava" button that triggers sync
- [ ] Sync progress/results feedback (imported X sessions, skipped Y)
- [ ] Session card: "via Strava" badge with link to original activity
- [ ] "Powered by Strava" attribution where required

### Phase 4 — Enhancements (Future)
- [ ] Strava webhook subscription for automatic real-time sync (no manual trigger needed)
- [ ] Historical backfill: on first connect, import last 6 months of water sport activities
- [ ] Allow user to correct sport type after import (e.g., Strava "Windsurf" → windfoiling)
- [ ] Bi-directional: push manually created Windy Spot sessions to Strava (requires `activity:write` scope)

## Notes
- The Strava API is publicly available with no approval process — register at https://www.strava.com/settings/api and you get credentials immediately.
- OAuth 2.0 is straightforward compared to Garmin's OAuth 1.0a.
- The `connected_accounts` table is shared across all integrations (Strava, Coros, future Garmin). Design it once, reuse for all.
- The Strava Streams API returns parallel arrays (latlng[], time[], heartrate[], velocity_smooth[]) — these need to be zipped into GeoJSON track points, which is simpler than parsing GPX XML.
- Rate limits (100 req/15 min) mean a bulk import of 50 activities costs ~51 requests (1 list + 50 streams). That fits within a single rate window.
- Strava tokens expire every 6 hours. Always refresh before API calls rather than handling 401 errors reactively.
- The `source_file_name` column can store the Strava activity URL for reference.

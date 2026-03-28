# Task: Coros Smartwatch Integration

## Goal
Automatically import windsurf/kitesurf activities from a user's Coros smartwatch into Windy Spot, so sessions appear in the feed without manual entry.

## Approach
Direct integration with the Coros Official API. Coros offers an OAuth2-based API with webhook notifications for new activities. Requires submitting a partnership application at https://support.coros.com/hc/en-us/articles/17085887816340-Submitting-an-API-Application — once approved, Coros shares their private API documentation.

**Flow:**
1. User connects their Coros account via OAuth2
2. Coros sends a webhook when a new activity syncs from the watch
3. We fetch activity details (sport type, duration, distance, GPS)
4. We match GPS start coordinates to the nearest spot in our database
5. We create a session + fanout to the activity feed

## Requirements
- Users can connect/disconnect their Coros account from a settings page
- New Coros activities are automatically imported as sessions
- Only water sport activities are imported (windsurf, kitesurf, windfoil, wingfoil)
- GPS coordinates are matched to the nearest known spot (within ~5km)
- Imported sessions appear in the feed like manual sessions, with a "via Coros" badge
- Duplicate activities are not imported twice
- OAuth tokens are refreshed automatically when expired

## Architecture

### OAuth2 Flow
1. User clicks "Connect Coros" → redirected to Coros authorization URL
2. User grants access → Coros redirects back with authorization code
3. We exchange code for access_token + refresh_token, store in `connected_accounts`
4. Tokens are refreshed automatically before API calls when expired

### Webhook Flow
1. Register a webhook subscription with Coros during app setup
2. Coros POSTs to `/api/integrations/coros/webhook` when a user syncs a new activity
3. Webhook payload includes activity ID and user reference
4. We look up the connected account, fetch full activity data via Coros API
5. Filter by sport type → map to our session types → match to nearest spot → create session → fanout

### Spot Matching
Use haversine formula to find the nearest spot within a 5km radius based on the activity's start GPS coordinates. If no spot matches, still create the session but leave `spot_id` null (or skip import — TBD based on UX preference).

## Database Changes

### New table: `connected_accounts`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | text | NOT NULL, Clerk user ID |
| provider | text | NOT NULL, 'coros' (extensible for strava, garmin, etc.) |
| provider_user_id | text | NOT NULL, Coros user ID |
| access_token | text | NOT NULL |
| refresh_token | text | NOT NULL |
| expires_at | timestamptz | NOT NULL |
| scopes | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |
| | | UNIQUE(user_id, provider) |

### Changes to `sessions`
| Column | Type | Notes |
|---|---|---|
| external_id | text | nullable, Coros activity ID (prevents duplicates) |
| source | text | default 'manual', values: 'manual', 'coros' |
| | | UNIQUE(source, external_id) WHERE external_id IS NOT NULL |

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/integrations/coros/connect` | GET | Redirect to Coros OAuth authorization URL |
| `/api/integrations/coros/callback` | GET | Handle OAuth callback, exchange code for tokens |
| `/api/integrations/coros` | DELETE | Disconnect Coros account |
| `/api/integrations/coros` | GET | Get connection status |
| `/api/integrations/coros/webhook` | POST | Receive Coros activity webhooks |
| `/api/integrations/coros/webhook` | GET | Webhook validation endpoint (if required by Coros) |

## New Files

| File | Purpose |
|---|---|
| `supabase/migrations/XXXXXX_connected_accounts.sql` | Migration for new table + sessions columns |
| `src/app/api/integrations/coros/connect/route.ts` | OAuth redirect |
| `src/app/api/integrations/coros/callback/route.ts` | OAuth callback |
| `src/app/api/integrations/coros/route.ts` | GET status, DELETE disconnect |
| `src/app/api/integrations/coros/webhook/route.ts` | Webhook handler |
| `src/app/lib/coros.ts` | Coros API client (auth, fetch activities, token refresh) |
| `src/app/lib/geo.ts` | Haversine distance, nearest spot lookup |
| `src/app/settings/page.tsx` | Settings page with Coros connect/disconnect UI |

## Modified Files

| File | Change |
|---|---|
| `src/middleware.ts` | Add `/settings` to protected routes |
| Feed components in `src/app/feed/` | Add "via Coros" badge on imported sessions |

## Environment Variables

```
COROS_CLIENT_ID=
COROS_CLIENT_SECRET=
COROS_WEBHOOK_SECRET=        # for validating webhook signatures
NEXT_PUBLIC_APP_URL=         # base URL for OAuth redirect_uri
```

## Sport Type Mapping

| Coros Activity Type | Windy Spot Session Type |
|---|---|
| Windsurfing | windsurfing |
| Kitesurfing / Kiteboarding | kitesurfing |
| Windfoiling (if available) | windfoiling |
| Wingfoiling (if available) | wingfoiling |
| Other water sports | skip (don't import) |

Note: Exact Coros sport type values will be known once API docs are shared after approval.

## Implementation Phases

### Phase 1 — API Partnership & Database
- [ ] Submit Coros API partnership application
- [ ] Create `connected_accounts` table migration
- [ ] Add `external_id` and `source` columns to `sessions`
- [ ] Create `src/app/lib/geo.ts` — haversine distance + nearest spot lookup

### Phase 2 — OAuth & Account Linking
- [ ] Create Coros API client (`src/app/lib/coros.ts`)
- [ ] Implement OAuth connect flow (`/api/integrations/coros/connect`)
- [ ] Implement OAuth callback (`/api/integrations/coros/callback`)
- [ ] Implement disconnect (`DELETE /api/integrations/coros`)
- [ ] Implement connection status (`GET /api/integrations/coros`)
- [ ] Create settings page with connect/disconnect UI

### Phase 3 — Webhook & Activity Import
- [ ] Implement webhook endpoint (`/api/integrations/coros/webhook`)
- [ ] Fetch activity details from Coros API on webhook trigger
- [ ] Filter by sport type (only water sports)
- [ ] Match GPS coordinates to nearest spot
- [ ] Create session with `source='coros'` and `external_id`
- [ ] Fanout to followers via existing `fanoutToFollowers()`
- [ ] Duplicate prevention via `UNIQUE(source, external_id)`

### Phase 4 — UI Polish
- [ ] Add "via Coros" badge on imported session cards in feed
- [ ] Show Coros connection status on user profile/settings
- [ ] Add link to original activity on Coros (if available)
- [ ] Handle edge cases: token refresh, webhook retries, disconnected accounts

## Notes
- The Coros API docs are private — exact endpoints, payload shapes, and sport type enums will only be known after partnership approval. The architecture above is based on standard OAuth2 + webhook patterns that Coros is known to follow.
- The `connected_accounts` table is designed to be provider-agnostic, making it easy to add Strava/Garmin integrations later with the same pattern.
- If Coros partnership takes too long or is rejected, the same architecture works with Strava as an intermediary (Coros auto-syncs to Strava, and Strava has a public API).
- `spot_id` being nullable on imported sessions handles cases where the user sails at a spot we don't have in our database yet.

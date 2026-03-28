# Task: Activity Feed

## Goal
Build a social-style activity feed where users see their own and others' activities in a timeline, with likes, comments, and infinite scroll.

## Requirements
- Authenticated users only (Clerk)
- Timeline at `/feed` showing the user's own activities and activities from followed users
- Activity types:
  - Session (windsurfing, kitesurfing, windfoiling, wingfoiling, parawing) with stats
  - User post (text, image, or video)
  - New spot guide
  - Wind prediction / forecast
- Like and comment on any activity
- Follow/unfollow other users
- Create post form at the top of the feed
- Infinite scroll (load more on reaching the bottom)

## Architecture

### Approach
- Supabase (Postgres) for all data storage
- Write fanout: when a user creates an activity, insert one `feed_items` row per follower
- Chronological ordering (no ranking for now)
- No external service (Stream, etc.) — keep it simple with Supabase

### Feed read path
Query `feed_items` for the current user, ordered by `created_at DESC`, with pagination via cursor. Join to `sessions`, `user_posts`, `spot_guide_events`, or `forecast_events` based on `type` to get the content.

### Feed write path
1. User creates a session or post → insert into `sessions` or `user_posts`
2. Look up all followers from `user_follows`
3. Insert one `feed_items` row per follower (+ one for the actor's own feed)
4. This can be done in a Supabase edge function or a Postgres trigger for simplicity

### Spot guides & forecasts write path
- System-generated activities (actor = "windyspot")
- Spot guides: insert into `spot_guide_events`, `reference_id` points to that row
- Forecasts: insert into `forecast_events`, `reference_id` points to that row
- Fanout target: all users (global broadcast) or all followers of a spot (TBD)

### Delete handling
- Deleting a session, post, spot guide event, or forecast event cascades to: `feed_items` (all fanout copies), and their associated `reactions` and `comments`
- Cascade deletes handled via Postgres trigger on `feed_items` (since `reference_id` is polymorphic and can't use FK constraints directly)

## Database Tables

### user_profiles (synced from Clerk)
| Column | Type | Notes |
|---|---|---|
| user_id | text | PK, Clerk user ID |
| username | text | UNIQUE |
| full_name | text | nullable |
| avatar_url | text | nullable |
| updated_at | timestamptz | default now() |

Synced from Clerk via webhook or upserted on login. Avoids querying Clerk API per feed card.

### sessions
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | text | Clerk user ID |
| spot_id | int | FK → spots |
| type | text | windsurfing, kitesurfing, windfoiling, wingfoiling, parawing |
| duration_minutes | int | |
| avg_wind_kts | decimal | |
| max_speed_kts | decimal | |
| distance_km | decimal | |
| notes | text | nullable |
| created_at | timestamptz | default now() |

### user_posts
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | text | Clerk user ID |
| text | text | |
| image_url | text | nullable |
| video_url | text | nullable |
| created_at | timestamptz | default now() |

### spot_guide_events
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| spot_id | int | FK → spots |
| title | text | e.g. "New spot guide: El Médano" |
| description | text | nullable, summary text |
| image_url | text | nullable, preview image |
| created_at | timestamptz | default now() |

### forecast_events
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| spot_id | int | FK → spots |
| title | text | e.g. "Wind outlook for Valdevaqueros" |
| forecast_days | jsonb | array of { day, wind, rating } |
| created_at | timestamptz | default now() |

### user_follows
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| follower_id | text | Clerk user who follows |
| following_id | text | Clerk user being followed |
| created_at | timestamptz | default now() |
| | | UNIQUE(follower_id, following_id) |

### feed_items (write fanout)
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | text | The user whose feed this appears in |
| actor_id | text | The user who performed the action |
| type | text | session, post, spot_guide, forecast |
| reference_id | uuid | NOT NULL, polymorphic FK to sessions, user_posts, spot_guide_events, or forecast_events based on type |
| likes_count | int | default 0, denormalized counter |
| comments_count | int | default 0, denormalized counter |
| created_at | timestamptz | default now() |
| | | INDEX(user_id, created_at DESC) |

`reference_id` is always populated — every feed item type has a backing table. The `type` column determines which table to join. `likes_count` and `comments_count` are incremented/decremented via Postgres triggers on `reactions` and `comments` inserts/deletes.

### reactions
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| feed_item_id | uuid | FK → feed_items ON DELETE CASCADE |
| user_id | text | Clerk user ID |
| type | text | like (extensible later) |
| created_at | timestamptz | default now() |
| | | UNIQUE(feed_item_id, user_id, type) |

### comments
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| feed_item_id | uuid | FK → feed_items ON DELETE CASCADE |
| user_id | text | Clerk user ID |
| text | text | |
| created_at | timestamptz | default now() |

## Implementation Phases

### Phase 1 — Database & API
- [x] Create all tables in Supabase — migration: `supabase/migrations/20260320200000_activity_feed.sql`
- [x] Set up Postgres triggers — likes_count/comments_count updates, cascade deletes from source tables to feed_items
- [x] Sync Clerk user data to user_profiles — `POST /api/user-profile` (upsert on demand)
- [x] Create API routes:
  - `POST /api/sessions` — create session + fanout
  - `POST /api/posts` — create post + fanout
  - `GET /api/feed?cursor=` — paginated feed with content joins
  - `POST/DELETE /api/feed/reactions` — like/unlike
  - `GET/POST /api/feed/comments` — list and add comments
- [x] Shared fanout logic — `src/app/lib/fanout.ts`
- [x] `/feed` added to protected routes in middleware

### Phase 2 — Feed UI
- [x] Connect `/feed` page to real data (replace mock data)
- [x] Implement infinite scroll with cursor-based pagination
- [x] Create post form → calls POST /api/posts
- [ ] Session creation — deferred, will be handled via integrations (e.g., GPS tracker, external apps)
- [x] Like/unlike → calls POST/DELETE /api/feed/reactions (optimistic UI)
- [x] Comments → calls GET/POST /api/feed/comments (lazy-loaded on expand)
- [x] Empty state when feed has no items
- [x] Profile sync on page load (POST /api/user-profile)

### Phase 3 — Follow System
- [x] Follow/unfollow API routes — `GET/POST/DELETE /api/follows`
- [x] On follow: backfill the follower's feed with the followed user's recent activities (last 50)
- [x] On unfollow: remove the unfollowed user's activities from the follower's feed
- [x] Follow button on user profiles (with optimistic UI)
- [x] Follower/following counts on profiles

### Phase 4 — Polish
- [x] Real-time updates — Supabase Realtime subscription on `feed_items`, shows "N new posts" banner
- [x] Image upload for posts — Photo button uploads to Supabase Storage, preview before posting
- [ ] Video upload for posts — Photo button works, Video still disabled (needs video processing/hosting)
- [x] Notification feed — `GET/PATCH /api/notifications`, `/notifications` page with mark-as-read
- [x] Notifications created on: like, comment, follow (via `src/app/lib/notifications.ts`)
- [x] System-generated activities — `POST /api/admin/spot-guide-event` and `POST /api/admin/forecast-event` with global fanout to all users

## Notes
- Ranking/algorithm feed is out of scope for now — purely chronological
- Spot guides and forecasts are system-generated (actor = "windyspot")
- The existing mock UI at `/feed` can be reused as the template for Phase 2
- `metadata` column removed from feed_items — all types now have dedicated tables, so `reference_id` is always NOT NULL

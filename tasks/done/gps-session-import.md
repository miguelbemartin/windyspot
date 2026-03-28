# Task: GPS Session Import & Track Viewer

## Goal
Allow users to import windsurf/water sport sessions from GPX files (exported from apps like WaterSpeed, Strava, etc.), store GPS track data efficiently, and display sessions with interactive map track visualization.

## Requirements
- Authenticated users can upload `.gpx` files to import sessions
- Parse GPX server-side: extract session metadata + full GPS track
- Store session metadata in the existing `sessions` table (from activity feed)
- Store GPS tracks as GeoJSON files in Supabase Storage (not in the database)
- Display session detail page with GPS track rendered on a MapKit JS map
- Track colored by speed (gradient from green → yellow → red)
- Session stats summary: duration, distance, max/avg speed, max/avg heart rate
- Sessions appear in the activity feed (integrate with existing fanout)
- Support bulk import (multiple GPX files at once)

## Data Format

### GPX structure (input)
Standard GPX 1.1 with Garmin TrackPoint extensions:
```xml
<trkpt lat="46.913" lon="8.608">
  <time>2025-08-08T14:46:47.334+0000</time>
  <ele>0</ele>
  <extensions>
    <gpxtpx:TrackPointExtension>
      <gpxtpx:speed>2.009</gpxtpx:speed>    <!-- m/s -->
      <gpxtpx:course>116.37</gpxtpx:course>  <!-- degrees -->
      <gpxtpx:hr>150</gpxtpx:hr>             <!-- bpm -->
    </gpxtpx:TrackPointExtension>
  </extensions>
</trkpt>
```

### GeoJSON structure (stored in Supabase Storage)
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [[lon, lat], ...]
    },
    "properties": {
      "times": ["2025-08-08T14:46:47Z", ...],
      "speeds": [0.0, 1.5, 2.0, ...],
      "heartRates": [0, 150, 158, ...],
      "courses": [0.0, 116.37, ...]
    }
  }]
}
```

## Architecture

### Storage strategy (designed for scale)

| Data | Storage | Reason |
|------|---------|--------|
| Session metadata | Supabase PostgreSQL (`sessions` table) | Queryable, filterable, RLS, feeds into activity feed |
| GPS tracks | Supabase Storage (`tracks/{user_id}/{session_id}.json`) | Cheap blob storage, CDN-served, loaded on demand, scales linearly with users |

**Why not store GPS points in PostgreSQL?**
- At scale: 10K users × 50 sessions × 4K points = 2 billion rows — expensive and slow
- No spatial queries needed — we just render polylines on a map
- GeoJSON files are directly consumable by MapKit JS
- Supabase Storage is cheaper than DB rows and served via CDN

**Why not PostGIS?**
- Would only be needed for spatial queries (e.g., "find sessions near this spot")
- For now, spot matching can be done at import time using start coordinates vs. known spot locations
- Can add PostGIS later for a `start_point geography` column on `sessions` if spatial queries become needed

### Upload flow
1. User selects one or more `.gpx` files in the UI
2. Files are sent to `POST /api/sessions/import`
3. Server-side parsing:
   a. Parse GPX XML → extract all track points
   b. Compute session metadata: duration, distance, max/avg speed, max/avg HR, start/end coords
   c. Auto-match spot: find nearest spot by comparing start coordinates to spots table (within ~5km threshold)
   d. Convert track to GeoJSON format
4. **Deduplication check**: query `sessions` for the same user with matching `start_time` (within a few seconds tolerance) and similar `start_lat`/`start_lon`. If a match is found, **replace** the existing session: update the metadata row and overwrite the GeoJSON file in Storage. This ensures re-uploading the same GPX (e.g., after a correction or re-export) replaces the old data rather than creating a duplicate. The existing feed item is preserved (same session ID, no duplicate in the feed).
5. Insert (or update) session row in `sessions` table (with `track_url` pointing to storage)
6. Upload GeoJSON to Supabase Storage at `tracks/{user_id}/{session_id}.json`
7. Trigger activity feed fanout only for new sessions (skip on replace)

### Session detail page
- Route: `/sessions/[id]`
- Full-width MapKit JS map with track polyline
- Track colored by speed using gradient segments
- Stats panel: duration, distance, max speed, avg speed, max HR, avg HR
- Speed/HR chart over time (optional, Phase 2)

## Schema Changes

### Extend `sessions` table
Add columns to the existing sessions table:
```sql
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS track_url text;           -- path in Supabase Storage
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS start_time timestamptz;   -- exact session start (used for dedup)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS start_lat decimal;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS start_lon decimal;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS avg_speed_kts decimal;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS max_hr int;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS avg_hr int;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS distance_km decimal;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS source text;              -- 'gpx_import', 'manual', 'strava', etc.
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS source_file_name text;    -- original filename for dedup
```

### Supabase Storage bucket
- Bucket name: `tracks`
- Path pattern: `{user_id}/{session_id}.json`
- Public read (tracks are not sensitive), authenticated write
- RLS: users can only write to their own `{user_id}/` prefix

## Implementation Phases

### Phase 1 — GPX Parser & Storage
- [x] GPX parser utility (`src/app/lib/gpx-parser.ts`) — parse GPX XML, extract points, compute stats, convert to GeoJSON
- [x] Supabase migration — extend `sessions` table with new columns (`supabase/migrations/20260325000000_sessions_gps_tracks.sql`)
- [x] Create `tracks` storage bucket (via Supabase dashboard — name: `tracks`, public read)
- [x] API route `POST /api/sessions/import` — accepts GPX file upload, parses, stores metadata + track
- [x] Auto-match spot by start coordinates (nearest spot within ~5km)
- [x] Deduplicate imports: match by `user_id` + `start_time` (±10s tolerance) + `start_lat`/`start_lon` proximity (<500m). On match, replace existing session data and track file (upsert behavior)

### Phase 2 — Session Detail UI
- [x] Session detail page `/sessions/[id]` — map with track polyline + stats panel
- [x] MapKit JS track rendering with speed-based color gradient (`src/app/components/track-map.tsx`)
- [x] Session stats display (duration, distance, speed, HR)
- [x] Link session cards in the activity feed to the detail page
- [x] GET API route `/api/sessions/[id]` — returns session with spot and actor profile

### Phase 3 — Upload UI
- [x] Upload page at `/sessions/import`
- [x] Drag-and-drop and file picker for `.gpx` files
- [x] Multi-file upload support
- [x] Upload progress indicator + success/error status per file
- [ ] Post-upload: show parsed session preview (map thumbnail, stats) before confirming
- [ ] Allow user to select/correct the matched spot before saving
- [x] "Import GPX" button added to feed composer
- [x] `/sessions/(.*)` added to protected routes in middleware

### Phase 4 — Enhancements
- [ ] Speed/HR chart over time (line chart below the map)
- [ ] Support `.fit` file format (Garmin native)
- [ ] Support WaterSpeed `.wml` file format (JSON-based, already analyzed)
- [ ] Strava API integration (OAuth2 import)
- [ ] Session comparison (overlay two tracks on the same map)
- [ ] Leaderboards per spot (fastest max speed, longest session)

## Notes
- Speed in GPX files from WaterSpeed is in **m/s** — convert to knots (× 1.94384) for display, matching existing `max_speed_kts` column
- The existing `sessions` table already integrates with the activity feed fanout — imported sessions will automatically appear in feeds
- WaterSpeed also exports map images (`photoWS/` folder) — these could be used as session thumbnails but generating our own from the track is more reliable
- The `.wml` files from iCloud contain similar data in JSON format but GPX is the standard export format and should be the primary import path
- Heart rate data may not always be present (depends on whether a watch was connected)

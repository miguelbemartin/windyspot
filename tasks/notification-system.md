# Task: Notification System Enhancements

## Goal

Surface notifications to users without requiring them to manually visit `/notifications`. Add real-time awareness and expand notification types over time.

## Current State

Already implemented:
- `notifications` DB table: `id`, `user_id`, `actor_id`, `type` (like/comment/follow), `feed_item_id`, `read`, `created_at`
- `GET /api/notifications` — paginated fetch with actor profile join
- `PATCH /api/notifications` — mark all as read
- `createNotification()` helper in `src/app/lib/notifications.ts` — called from reactions, comments, and follows routes
- `/notifications` page — lists notifications with avatars, icons, time ago, load more, auto-marks read on load

Missing: no notification indicator in the navbar — users must manually navigate to `/notifications`.

## Requirements

### Phase 1 — Unread Count API
- Add `GET /api/notifications/count` endpoint
- Returns `{ count: number }` for current user's unread notifications
- Lightweight query: `select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('read', false)`

### Phase 2 — Navbar Bell Icon
- Add bell icon (`BsBell` / `BsBellFill`) to `navbar-light.tsx` in both desktop and mobile layouts
- Fetch unread count on mount via `/api/notifications/count`
- Show red badge with count when > 0 (dot-only if you prefer minimal)
- Click navigates to `/notifications`
- Refresh count on `document.visibilitychange` (when user returns to tab) instead of polling
- Reset badge to 0 after navigating to `/notifications`

### Phase 3 — Real-time Updates (Optional)
- Use Supabase Realtime to subscribe to `INSERT` on `notifications` table filtered by `user_id`
- On new notification, increment the badge count without a full refetch
- Requires Supabase client-side with auth token (already set up for other features)

### Phase 4 — Expanded Notification Types (Optional)
- `spot_added` — when someone you follow adds a new spot
- `forecast_alert` — wind/weather alerts for saved spots
- `system` — announcements (use existing `SYSTEM_ACTOR` constant)
- Update the `type` union in `createNotification()` and on the notifications page
- Add corresponding icons and display text in `notificationIcon()` / `notificationText()`

## Notes

- Phase 1 + 2 are small and give immediate value — start here
- Phase 3 is a UX polish; evaluate whether polling/visibility-change is sufficient first
- Phase 4 depends on which features are built next (spot creation flow, forecast alerts, etc.)
- The notifications page already handles unknown types gracefully (returns null for icon/text)

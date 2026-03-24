export const DEFAULT_SPOT_IMAGE = 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/akira-hojo-ZxGdri2EWzk-unsplash.jpg'

export const FEED_PAGE_SIZE = 10
export const NOTIFICATIONS_PAGE_SIZE = 20
export const RESOURCES_PAGE_SIZE = 6
export const FOLLOW_BACKFILL_LIMIT = 50
export const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000

export const SPORT_TYPES = ['windsurfing', 'kitesurfing', 'windfoiling', 'wingfoiling', 'parawing'] as const
export type SportType = typeof SPORT_TYPES[number]

export const SYSTEM_ACTOR = 'system_windyspot'

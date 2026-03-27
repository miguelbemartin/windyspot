import { describe, it, expect } from 'vitest'
import {
    FEED_PAGE_SIZE,
    NOTIFICATIONS_PAGE_SIZE,
    RESOURCES_PAGE_SIZE,
    FOLLOW_BACKFILL_LIMIT,
    DEFAULT_CACHE_TTL_MS,
    SPORT_TYPES,
    SYSTEM_ACTOR,
    DEFAULT_SPOT_IMAGE,
} from '../constants'

describe('constants', () => {
    it('pagination constants are positive integers', () => {
        expect(FEED_PAGE_SIZE).toBe(10)
        expect(NOTIFICATIONS_PAGE_SIZE).toBe(20)
        expect(RESOURCES_PAGE_SIZE).toBe(6)
        expect(FOLLOW_BACKFILL_LIMIT).toBe(50)
    })

    it('cache TTL is 1 hour in milliseconds', () => {
        expect(DEFAULT_CACHE_TTL_MS).toBe(3_600_000)
    })

    it('SPORT_TYPES contains all expected sport types', () => {
        expect(SPORT_TYPES).toContain('windsurfing')
        expect(SPORT_TYPES).toContain('kitesurfing')
        expect(SPORT_TYPES).toContain('windfoiling')
        expect(SPORT_TYPES).toContain('wingfoiling')
        expect(SPORT_TYPES).toContain('parawing')
        expect(SPORT_TYPES).toHaveLength(5)
    })

    it('SPORT_TYPES is a readonly tuple', () => {
        expect(Array.isArray(SPORT_TYPES)).toBe(true)
        // `as const` makes it readonly at compile time; verify no duplicates at runtime
        const unique = new Set(SPORT_TYPES)
        expect(unique.size).toBe(SPORT_TYPES.length)
    })

    it('SYSTEM_ACTOR has expected value', () => {
        expect(SYSTEM_ACTOR).toBe('system_windyspot')
    })

    it('DEFAULT_SPOT_IMAGE is a valid Supabase storage URL', () => {
        expect(DEFAULT_SPOT_IMAGE).toMatch(/^https:\/\/.*supabase\.co\/storage\//)
    })
})

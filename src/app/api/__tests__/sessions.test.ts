import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockAuth, mockFrom } = vi.hoisted(() => ({
    mockAuth: vi.fn(),
    mockFrom: vi.fn(),
}))

vi.mock('@clerk/nextjs/server', () => ({ auth: mockAuth }))
vi.mock('../../lib/supabase-server', () => ({
    createAdminClient: () => ({ from: mockFrom }),
}))
vi.mock('../../lib/fanout', () => ({
    fanoutToFollowers: vi.fn(),
}))

import { POST } from '../../api/sessions/route'
import { SPORT_TYPES } from '../../lib/constants'

function makeRequest(body: unknown): NextRequest {
    return new NextRequest('http://localhost/api/sessions', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

function mockSuccessInsert(data: unknown) {
    mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data, error: null }),
            }),
        }),
    })
}

describe('POST /api/sessions', () => {
    beforeEach(() => vi.clearAllMocks())

    it('returns 401 when not authenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null })
        const res = await POST(makeRequest({ spot_id: 1, type: 'windsurfing' }))
        expect(res.status).toBe(401)
    })

    it('returns 400 when spot_id is missing', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        const res = await POST(makeRequest({ type: 'windsurfing' }))
        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({ error: 'spot_id and type are required' })
    })

    it('returns 400 when type is missing', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        const res = await POST(makeRequest({ spot_id: 1 }))
        expect(res.status).toBe(400)
    })

    it('returns 400 for invalid sport type', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        const res = await POST(makeRequest({ spot_id: 1, type: 'surfing' }))
        const json = await res.json()
        expect(res.status).toBe(400)
        expect(json.error).toContain('type must be one of')
    })

    it('accepts all valid sport types', async () => {
        for (const type of SPORT_TYPES) {
            vi.clearAllMocks()
            mockAuth.mockResolvedValue({ userId: 'user_1' })
            mockSuccessInsert({ id: 1, created_at: '2026-01-01' })

            const res = await POST(makeRequest({ spot_id: 1, type }))
            expect(res.status).toBe(201)
        }
    })

    it('creates session with all fields', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        const sessionData = { id: 99, created_at: '2026-03-24T10:00:00Z' }
        mockSuccessInsert(sessionData)

        const res = await POST(makeRequest({
            spot_id: 5,
            type: 'windsurfing',
            duration_minutes: 90,
            avg_wind_kts: 22,
        }))

        expect(res.status).toBe(201)
        expect(await res.json()).toEqual(sessionData)
    })

    it('returns 500 on database error', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        mockFrom.mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: null,
                        error: { message: 'db error' },
                    }),
                }),
            }),
        })

        const res = await POST(makeRequest({ spot_id: 1, type: 'windsurfing' }))
        expect(res.status).toBe(500)
    })
})

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

import { GET, POST, DELETE } from '../../api/my-spots/route'

function makeRequest(method: string, body?: unknown): NextRequest {
    return new NextRequest('http://localhost/api/my-spots', {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
    })
}

describe('GET /api/my-spots', () => {
    beforeEach(() => vi.clearAllMocks())

    it('returns 401 when not authenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null })
        const res = await GET()
        expect(res.status).toBe(401)
        expect(await res.json()).toEqual({ error: 'Unauthorized' })
    })

    it('returns spots when authenticated', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                    data: [{ spot_id: 10 }, { spot_id: 20 }],
                    error: null,
                }),
            }),
        })

        const res = await GET()
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual([{ spot_id: 10 }, { spot_id: 20 }])
        expect(mockFrom).toHaveBeenCalledWith('user_spots')
    })

    it('returns 500 on database error', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'db error' },
                }),
            }),
        })

        const res = await GET()
        expect(res.status).toBe(500)
    })
})

describe('POST /api/my-spots', () => {
    beforeEach(() => vi.clearAllMocks())

    it('returns 401 when not authenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null })
        const res = await POST(makeRequest('POST', { spot_id: 1 }))
        expect(res.status).toBe(401)
    })

    it('returns 400 when spot_id is missing', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        const res = await POST(makeRequest('POST', {}))
        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({ error: 'spot_id is required' })
    })

    it('adds spot successfully', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        const mockUpsert = vi.fn().mockResolvedValue({ error: null })
        mockFrom.mockReturnValue({ upsert: mockUpsert })

        const res = await POST(makeRequest('POST', { spot_id: 42 }))
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ ok: true })
        expect(mockUpsert).toHaveBeenCalledWith(
            { user_id: 'user_1', spot_id: 42 },
            { onConflict: 'user_id,spot_id' }
        )
    })
})

describe('DELETE /api/my-spots', () => {
    beforeEach(() => vi.clearAllMocks())

    it('returns 401 when not authenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null })
        const res = await DELETE(makeRequest('DELETE', { spot_id: 1 }))
        expect(res.status).toBe(401)
    })

    it('returns 400 when spot_id is missing', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        const res = await DELETE(makeRequest('DELETE', {}))
        expect(res.status).toBe(400)
    })

    it('deletes spot successfully', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_1' })
        const mockEq2 = vi.fn().mockResolvedValue({ error: null })
        const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
        mockFrom.mockReturnValue({
            delete: vi.fn().mockReturnValue({ eq: mockEq1 }),
        })

        const res = await DELETE(makeRequest('DELETE', { spot_id: 42 }))
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ ok: true })
    })
})

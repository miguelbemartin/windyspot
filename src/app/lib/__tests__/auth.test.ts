import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(),
}))

vi.mock('next/server', () => {
    class MockNextResponse {
        body: unknown
        status: number
        constructor(body: unknown, init?: { status?: number }) {
            this.body = body
            this.status = init?.status || 200
        }
        static json(data: unknown, init?: { status?: number }) {
            return new MockNextResponse(data, init)
        }
    }
    return { NextResponse: MockNextResponse }
})

import { auth } from '@clerk/nextjs/server'
import { requireAuth } from '../auth'

const mockAuth = vi.mocked(auth)

describe('requireAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns userId when authenticated', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)

        const result = await requireAuth()

        expect(result.userId).toBe('user_123')
        expect(result.response).toBeUndefined()
    })

    it('returns 401 response when userId is null', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)

        const result = await requireAuth()

        expect(result.userId).toBeUndefined()
        expect(result.response).toBeDefined()
        expect((result.response as any).status).toBe(401)
        expect((result.response as any).body).toEqual({ error: 'Unauthorized' })
    })

    it('returns 401 response when userId is undefined', async () => {
        mockAuth.mockResolvedValue({} as never)

        const result = await requireAuth()

        expect(result.userId).toBeUndefined()
        expect(result.response).toBeDefined()
    })
})

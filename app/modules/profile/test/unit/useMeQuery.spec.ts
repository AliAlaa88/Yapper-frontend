import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMeQuery } from '../../queries/useMeQuery'

const mockQueryFn = vi.fn()
const mockUseQuery = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
    useQuery: (options: any) => {
        mockUseQuery(options)
        return {
            data: { value: null },
            isLoading: { value: false },
            error: { value: null },
        }
    },
}))

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $userInfoService: {
            getMe: mockQueryFn,
        },
    }),
}))

describe('useMeQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('creates query with correct configuration', () => {
        useMeQuery()

        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['me'],
            }),
        )
    })

    it('uses correct query function', () => {
        mockQueryFn.mockResolvedValue({
            user_id: '123',
            name: 'Test User',
            username: 'testuser',
        })

        useMeQuery()

        const callArgs = mockUseQuery.mock.calls[0]![0]
        expect(callArgs.queryFn).toBeDefined()
        expect(typeof callArgs.queryFn).toBe('function')
    })

    it('returns query result object', () => {
        const result = useMeQuery()

        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('isLoading')
        expect(result).toHaveProperty('error')
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useOtherUserQuery } from '../../queries/useOtherUserQuery'

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
            getUserInfoByUsername: mockQueryFn,
        },
    }),
}))

describe('useOtherUserQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('creates query with correct configuration for valid username', () => {
        const username = 'testuser'
        useOtherUserQuery(username)

        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['user', username],
                enabled: true,
            }),
        )
    })

    it('creates query with correct configuration for empty username', () => {
        const username = ''
        useOtherUserQuery(username)

        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['user', ''],
                enabled: false,
            }),
        )
    })

    it('uses correct query function', () => {
        const username = 'testuser'
        mockQueryFn.mockResolvedValue({
            user_id: '123',
            name: 'Test User',
            username: 'testuser',
        })

        useOtherUserQuery(username)

        const callArgs = mockUseQuery.mock.calls[0]![0]
        expect(callArgs.queryFn).toBeDefined()
        expect(typeof callArgs.queryFn).toBe('function')
    })

    it('returns query result object', () => {
        const result = useOtherUserQuery('testuser')

        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('isLoading')
        expect(result).toHaveProperty('error')
    })

    it('disables query when username is not provided', () => {
        useOtherUserQuery('')

        const callArgs = mockUseQuery.mock.calls[0]![0]
        expect(callArgs.enabled).toBe(false)
    })
})

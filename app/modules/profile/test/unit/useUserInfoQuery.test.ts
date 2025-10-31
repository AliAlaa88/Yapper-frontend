import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserInfoQuery } from '../../queries/useUserInfoQuery'

const mockQuery = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
    useQuery: (options: {
        queryKey: string[]
        queryFn: () => Promise<unknown>
        enabled: boolean
    }) => {
        mockQuery(options)
        return {
            data: { username: options.queryKey[1], id: '123' },
            isLoading: false,
            error: null,
        }
    },
}))

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $userInfoService: {
            getUserInfoByUsername: vi.fn((username: string) =>
                Promise.resolve({ username, id: '123' }),
            ),
        },
    }),
}))

describe('useUserInfoQuery', () => {
    beforeEach(() => {
        mockQuery.mockClear()
    })

    it('creates query with correct key and function', () => {
        useUserInfoQuery('testuser')

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['user', 'testuser'],
                enabled: true,
            }),
        )
    })

    it('disables query when username is empty', () => {
        useUserInfoQuery('')

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['user', ''],
                enabled: false,
            }),
        )
    })

    it('returns query result', () => {
        const result = useUserInfoQuery('testuser')

        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('isLoading')
        expect(result).toHaveProperty('error')
    })
})

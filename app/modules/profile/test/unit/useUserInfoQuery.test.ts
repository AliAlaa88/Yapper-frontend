import { describe, it, expect, vi } from 'vitest'
import { useUserInfoQuery } from '../../queries/useUserInfoQuery'

vi.mock('@tanstack/vue-query', () => ({
    useQuery: vi.fn((_options) => ({
        data: { value: null },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
    })),
}))

vi.mock('nuxt/app', () => ({
    useNuxtApp: vi.fn(() => ({
        $userInfoService: {
            getUserInfoByUsername: vi.fn(),
        },
    })),
}))

describe('useUserInfoQuery', () => {
    it('returns query result with expected properties', () => {
        const username = 'testuser'
        const result = useUserInfoQuery(username)

        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('isLoading')
        expect(result).toHaveProperty('error')
        expect(result).toHaveProperty('refetch')
    })

    it('works with empty username', () => {
        const username = ''
        const result = useUserInfoQuery(username)

        expect(result).toBeDefined()
    })
})

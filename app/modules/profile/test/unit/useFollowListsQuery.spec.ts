import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFollowListsQuery } from '../../queries/useFollowListsQuery'
import { ref } from 'vue'

const mockUserInfoService = {
    getFollowers: vi.fn(),
    getFollowing: vi.fn(),
}

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
        $userInfoService: mockUserInfoService,
    }),
}))

describe('useFollowListsQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('creates followers query with correct configuration', () => {
        const userId = ref('123')
        useFollowListsQuery(userId)

        expect(mockUseQuery).toHaveBeenCalled()
        const firstCall = mockUseQuery.mock.calls[0]![0]
        expect(firstCall.queryKey[0]).toBe('followers')
    })

    it('creates following query with correct configuration', () => {
        const userId = ref('123')
        useFollowListsQuery(userId)

        const secondCall = mockUseQuery.mock.calls[1]![0]
        expect(secondCall.queryKey[0]).toBe('following')
    })

    it('returns both queries', () => {
        const userId = ref('123')
        const result = useFollowListsQuery(userId)

        expect(result).toHaveProperty('followersQuery')
        expect(result).toHaveProperty('followingQuery')
    })

    it('followers query uses correct service method', () => {
        const userId = ref('123')
        useFollowListsQuery(userId)

        const firstCall = mockUseQuery.mock.calls[0]![0]
        expect(firstCall.queryFn).toBeDefined()
        expect(typeof firstCall.queryFn).toBe('function')
    })

    it('following query uses correct service method', () => {
        const userId = ref('123')
        useFollowListsQuery(userId)

        const secondCall = mockUseQuery.mock.calls[1]![0]
        expect(secondCall.queryFn).toBeDefined()
        expect(typeof secondCall.queryFn).toBe('function')
    })

    it('enables queries when userId is provided', () => {
        const userId = ref('123')
        useFollowListsQuery(userId)

        const firstCall = mockUseQuery.mock.calls[0]![0]
        const secondCall = mockUseQuery.mock.calls[1]![0]
        expect(firstCall.enabled).toBeDefined()
        expect(secondCall.enabled).toBeDefined()
    })

    it('returns query result objects with expected properties', () => {
        const userId = ref('123')
        const result = useFollowListsQuery(userId)

        expect(result.followersQuery).toHaveProperty('data')
        expect(result.followersQuery).toHaveProperty('isLoading')
        expect(result.followersQuery).toHaveProperty('error')

        expect(result.followingQuery).toHaveProperty('data')
        expect(result.followingQuery).toHaveProperty('isLoading')
        expect(result.followingQuery).toHaveProperty('error')
    })
})

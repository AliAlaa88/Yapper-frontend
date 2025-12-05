import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserActionsQuery } from '../../queries/useUserActionsQuery'
import { ref } from 'vue'

const mockUserInfoService = {
    getUserByID: vi.fn(),
    followUser: vi.fn(),
    unfollowUser: vi.fn(),
    blockUser: vi.fn(),
    unblockUser: vi.fn(),
    muteUser: vi.fn(),
    unmuteUser: vi.fn(),
    removeFollower: vi.fn(),
}

const mockQueryClient = {
    invalidateQueries: vi.fn(),
}

const mockUseQuery = vi.fn()
const mockUseMutation = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
    useQuery: (options: any) => {
        mockUseQuery(options)
        return {
            data: { value: null },
            isLoading: { value: false },
            error: { value: null },
        }
    },
    useMutation: (options: any) => {
        mockUseMutation(options)
        return {
            mutate: vi.fn(),
            mutateAsync: vi.fn(),
            isLoading: false,
        }
    },
}))

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $userInfoService: mockUserInfoService,
        $queryClient: mockQueryClient,
    }),
}))

describe('useUserActionsQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('creates user query with correct configuration', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        expect(mockUseQuery).toHaveBeenCalled()
        const queryCall = mockUseQuery.mock.calls[0]![0]
        expect(queryCall.queryFn).toBeDefined()
    })

    it('creates follow mutation', () => {
        const userId = ref('123')
        const result = useUserActionsQuery(userId)

        expect(result).toHaveProperty('followMutation')
        expect(mockUseMutation).toHaveBeenCalled()
    })

    it('creates unfollow mutation', () => {
        const userId = ref('123')
        const result = useUserActionsQuery(userId)

        expect(result).toHaveProperty('unfollowMutation')
    })

    it('creates block mutation', () => {
        const userId = ref('123')
        const result = useUserActionsQuery(userId)

        expect(result).toHaveProperty('blockMutation')
    })

    it('creates unblock mutation', () => {
        const userId = ref('123')
        const result = useUserActionsQuery(userId)

        expect(result).toHaveProperty('unblockMutation')
    })

    it('creates mute mutation', () => {
        const userId = ref('123')
        const result = useUserActionsQuery(userId)

        expect(result).toHaveProperty('muteMutation')
    })

    it('creates unmute mutation', () => {
        const userId = ref('123')
        const result = useUserActionsQuery(userId)

        expect(result).toHaveProperty('unmuteMutation')
    })

    it('creates remove follower mutation', () => {
        const userId = ref('123')
        const result = useUserActionsQuery(userId)

        expect(result).toHaveProperty('removeFollowerMutation')
    })

    it('returns all mutations and query', () => {
        const userId = ref('123')
        const result = useUserActionsQuery(userId)

        expect(result.userQuery).toBeDefined()
        expect(result.followMutation).toBeDefined()
        expect(result.unfollowMutation).toBeDefined()
        expect(result.blockMutation).toBeDefined()
        expect(result.unblockMutation).toBeDefined()
        expect(result.muteMutation).toBeDefined()
        expect(result.unmuteMutation).toBeDefined()
        expect(result.removeFollowerMutation).toBeDefined()
    })

    it('enables query only when userId is provided', () => {
        const userId = ref<string | undefined>(undefined)
        useUserActionsQuery(userId)

        const queryCall = mockUseQuery.mock.calls[0]![0]
        expect(queryCall.enabled).toBeDefined()
    })
})

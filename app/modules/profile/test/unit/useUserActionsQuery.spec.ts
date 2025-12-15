import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserActionsQuery } from '../../queries/useUserActionsQuery'
import { ref } from 'vue'

// Use vi.hoisted to create mock functions that are accessible in hoisted vi.mock calls
const {
    mockUserInfoService,
    mockQueryClient,
    mockUseQuery,
    mockUseMutation,
    mockOnFollowChange,
    mockOnBlockChange,
    mockOnMuteChange,
    mockOnRemoveFollower,
} = vi.hoisted(() => ({
    mockUserInfoService: {
        getUserByID: vi.fn(),
        followUser: vi.fn(),
        unfollowUser: vi.fn(),
        blockUser: vi.fn(),
        unblockUser: vi.fn(),
        muteUser: vi.fn(),
        unmuteUser: vi.fn(),
        removeFollower: vi.fn(),
    },
    mockQueryClient: {
        invalidateQueries: vi.fn(),
        setQueryData: vi.fn(),
    },
    mockUseQuery: vi.fn(),
    mockUseMutation: vi.fn(),
    mockOnFollowChange: vi.fn(),
    mockOnBlockChange: vi.fn(),
    mockOnMuteChange: vi.fn(),
    mockOnRemoveFollower: vi.fn(),
}))

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

vi.mock('~/modules/Common/queries/cacheInvalidation', () => ({
    cacheInvalidation: {
        onFollowChange: mockOnFollowChange,
        onBlockChange: mockOnBlockChange,
        onMuteChange: mockOnMuteChange,
        onRemoveFollower: mockOnRemoveFollower,
    },
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

    it('follow mutation onSuccess calls cache invalidation with all params', () => {
        const userId = ref('123')
        const targetUsername = ref('targetuser')
        const currentUserId = ref('456')
        useUserActionsQuery(userId, targetUsername, currentUserId)

        // Find the follow mutation (2nd call after userQuery)
        const followMutationCall = mockUseMutation.mock.calls[0]![0]
        followMutationCall.onSuccess()

        expect(mockOnFollowChange).toHaveBeenCalledWith(
            expect.objectContaining({ invalidateQueries: expect.any(Function) }),
            '123', 'targetuser', '456', true
        )
    })

    it('follow mutation onSuccess runs without error when no targetUsername', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const followMutationCall = mockUseMutation.mock.calls[0]![0]
        // Should not throw
        expect(() => followMutationCall.onSuccess()).not.toThrow()
    })

    it('follow mutation onError handles Already following error', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const followMutationCall = mockUseMutation.mock.calls[0]![0]
        // Should not throw when handling known error
        expect(() => followMutationCall.onError(new Error('Already following'))).not.toThrow()
    })

    it('unfollow mutation onSuccess calls cache invalidation', () => {
        const userId = ref('123')
        const targetUsername = ref('targetuser')
        const currentUserId = ref('456')
        useUserActionsQuery(userId, targetUsername, currentUserId)

        const unfollowMutationCall = mockUseMutation.mock.calls[1]![0]
        unfollowMutationCall.onSuccess()

        expect(mockOnFollowChange).toHaveBeenCalledWith(
            expect.objectContaining({ invalidateQueries: expect.any(Function) }),
            '123', 'targetuser', '456', false
        )
    })

    it('unfollow mutation onError handles Not following error', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const unfollowMutationCall = mockUseMutation.mock.calls[1]![0]
        // Should not throw when handling known error
        expect(() => unfollowMutationCall.onError(new Error('Not following'))).not.toThrow()
    })

    it('block mutation onSuccess calls cache invalidation', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const blockMutationCall = mockUseMutation.mock.calls[2]![0]
        blockMutationCall.onSuccess()

        expect(mockOnBlockChange).toHaveBeenCalledWith(
            expect.objectContaining({ invalidateQueries: expect.any(Function) }), '123'
        )
    })

    it('block mutation onError handles Already blocked error', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const blockMutationCall = mockUseMutation.mock.calls[2]![0]
        // Should not throw when handling known error
        expect(() => blockMutationCall.onError(new Error('Already blocked'))).not.toThrow()
    })

    it('unblock mutation onSuccess calls cache invalidation', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const unblockMutationCall = mockUseMutation.mock.calls[3]![0]
        unblockMutationCall.onSuccess()

        expect(mockOnBlockChange).toHaveBeenCalledWith(
            expect.objectContaining({ invalidateQueries: expect.any(Function) }), '123'
        )
    })

    it('unblock mutation onError handles Not blocked error', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const unblockMutationCall = mockUseMutation.mock.calls[3]![0]
        // Should not throw when handling known error
        expect(() => unblockMutationCall.onError(new Error('Not blocked'))).not.toThrow()
    })

    it('mute mutation onSuccess calls cache invalidation', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const muteMutationCall = mockUseMutation.mock.calls[4]![0]
        muteMutationCall.onSuccess()

        expect(mockOnMuteChange).toHaveBeenCalledWith(
            expect.objectContaining({ invalidateQueries: expect.any(Function) }), '123'
        )
    })

    it('mute mutation onError handles Already muted error', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const muteMutationCall = mockUseMutation.mock.calls[4]![0]
        // Should not throw when handling known error
        expect(() => muteMutationCall.onError(new Error('Already muted'))).not.toThrow()
    })

    it('unmute mutation onSuccess calls cache invalidation', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const unmuteMutationCall = mockUseMutation.mock.calls[5]![0]
        unmuteMutationCall.onSuccess()

        expect(mockOnMuteChange).toHaveBeenCalledWith(
            expect.objectContaining({ invalidateQueries: expect.any(Function) }), '123'
        )
    })

    it('unmute mutation onError handles Not muted error', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const unmuteMutationCall = mockUseMutation.mock.calls[5]![0]
        // Should not throw when handling known error
        expect(() => unmuteMutationCall.onError(new Error('Not muted'))).not.toThrow()
    })

    it('removeFollower mutation onSuccess calls cache invalidation', () => {
        const userId = ref('123')
        const targetUsername = ref('target')
        const currentUserId = ref('456')
        useUserActionsQuery(userId, targetUsername, currentUserId)

        const removeFollowerMutationCall = mockUseMutation.mock.calls[6]![0]
        removeFollowerMutationCall.onSuccess()

        expect(mockOnRemoveFollower).toHaveBeenCalledWith(
            expect.objectContaining({ invalidateQueries: expect.any(Function) }), '456'
        )
    })

    it('removeFollower mutation onError handles Not following error', () => {
        const userId = ref('123')
        useUserActionsQuery(userId)

        const removeFollowerMutationCall = mockUseMutation.mock.calls[6]![0]
        // Should not throw when handling known error
        expect(() => removeFollowerMutationCall.onError(new Error('Not following'))).not.toThrow()
    })

    it('follow mutation onError logs other errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const userId = ref('123')
        useUserActionsQuery(userId)

        const followMutationCall = mockUseMutation.mock.calls[0]![0]
        followMutationCall.onError(new Error('Network error'))

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to follow:', expect.any(Error))
        consoleErrorSpy.mockRestore()
    })

    it('unfollow mutation onError logs other errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const userId = ref('123')
        useUserActionsQuery(userId)

        const unfollowMutationCall = mockUseMutation.mock.calls[1]![0]
        unfollowMutationCall.onError(new Error('Network error'))

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to unfollow:', expect.any(Error))
        consoleErrorSpy.mockRestore()
    })

    it('block mutation onError logs other errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const userId = ref('123')
        useUserActionsQuery(userId)

        const blockMutationCall = mockUseMutation.mock.calls[2]![0]
        blockMutationCall.onError(new Error('Network error'))

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to block:', expect.any(Error))
        consoleErrorSpy.mockRestore()
    })

    it('unblock mutation onError logs other errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const userId = ref('123')
        useUserActionsQuery(userId)

        const unblockMutationCall = mockUseMutation.mock.calls[3]![0]
        unblockMutationCall.onError(new Error('Network error'))

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to unblock:', expect.any(Error))
        consoleErrorSpy.mockRestore()
    })

    it('mute mutation onError logs other errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const userId = ref('123')
        useUserActionsQuery(userId)

        const muteMutationCall = mockUseMutation.mock.calls[4]![0]
        muteMutationCall.onError(new Error('Network error'))

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to mute:', expect.any(Error))
        consoleErrorSpy.mockRestore()
    })

    it('unmute mutation onError logs other errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const userId = ref('123')
        useUserActionsQuery(userId)

        const unmuteMutationCall = mockUseMutation.mock.calls[5]![0]
        unmuteMutationCall.onError(new Error('Network error'))

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to unmute:', expect.any(Error))
        consoleErrorSpy.mockRestore()
    })

    it('removeFollower mutation onError logs other errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const userId = ref('123')
        useUserActionsQuery(userId)

        const removeFollowerMutationCall = mockUseMutation.mock.calls[6]![0]
        removeFollowerMutationCall.onError(new Error('Network error'))

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to remove this follower:', expect.any(Error))
        consoleErrorSpy.mockRestore()
    })
})

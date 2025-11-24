import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useUserActions } from '../../composables/useUserActions'
import { useUserActionsQuery } from '../../queries/useUserActionsQuery'

vi.mock('../../queries/useUserActionsQuery', () => ({
    useUserActionsQuery: vi.fn(),
}))

describe('useUserActions', () => {
    let mockMutations: ReturnType<typeof useUserActionsQuery>

    beforeEach(() => {
        vi.useFakeTimers()

        mockMutations = {
            userQuery: {
                data: ref(undefined),
                isLoading: ref(false),
                error: ref(null),
            },
            unfollowMutation: {
                mutate: vi.fn(),
                mutateAsync: vi.fn().mockResolvedValue(undefined),
                isPending: ref(false),
            } as unknown,
            blockMutation: {
                mutate: vi.fn(),
                mutateAsync: vi.fn().mockResolvedValue(undefined),
                isPending: ref(false),
            } as unknown,
            unblockMutation: {
                mutate: vi.fn(),
                mutateAsync: vi.fn().mockResolvedValue(undefined),
                isPending: ref(false),
            } as unknown,
            muteMutation: {
                mutate: vi.fn(),
                mutateAsync: vi.fn().mockResolvedValue(undefined),
                isPending: ref(false),
            } as unknown,
            unmuteMutation: {
                mutate: vi.fn(),
                mutateAsync: vi.fn().mockResolvedValue(undefined),
                isPending: ref(false),
            } as unknown,
            removeFollowerMutation: {
                mutate: vi.fn(),
                mutateAsync: vi.fn().mockResolvedValue(undefined),
                isPending: ref(false),
            } as unknown,
            followMutation: {
                mutate: vi.fn(),
                mutateAsync: vi.fn().mockResolvedValue(undefined),
                isPending: ref(false),
            } as unknown,
        } as ReturnType<typeof useUserActionsQuery>

        vi.mocked(useUserActionsQuery).mockReturnValue(mockMutations)
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.useRealTimers()
    })

    it('should call unmuteMutation when handleUnmute is called', async () => {
        const userId = ref('12')
        const { handleUnmute } = useUserActions(userId)

        const promise = handleUnmute()
        await vi.advanceTimersByTimeAsync(300)
        await promise

        expect(mockMutations.unmuteMutation.mutateAsync).toHaveBeenCalledTimes(1)
    })

    it('should call muteMutation when handleMute is called', async () => {
        const userId = ref('12')
        const { handleMute } = useUserActions(userId)

        const promise = handleMute()
        await vi.advanceTimersByTimeAsync(300)
        await promise

        expect(mockMutations.muteMutation.mutateAsync).toHaveBeenCalledTimes(1)
    })

    it('should call blockMutation when handleBlock is called', async () => {
        const userId = ref('12')
        const { handleBlock } = useUserActions(userId)

        const promise = handleBlock()
        await vi.advanceTimersByTimeAsync(300)
        await promise

        expect(mockMutations.blockMutation.mutateAsync).toHaveBeenCalledTimes(1)
    })

    it('should call unblockMutation when handleUnblock is called', async () => {
        const userId = ref('12')
        const { handleUnblock } = useUserActions(userId)

        const promise = handleUnblock()
        await vi.advanceTimersByTimeAsync(300)
        await promise

        expect(mockMutations.unblockMutation.mutateAsync).toHaveBeenCalledTimes(1)
    })

    it('should call removeFollowerMutation when handleRemoveFollower is called', async () => {
        const userId = ref('12')
        const { handleRemoveFollower } = useUserActions(userId)

        const promise = handleRemoveFollower()
        await vi.advanceTimersByTimeAsync(300)
        await promise

        expect(mockMutations.removeFollowerMutation.mutateAsync).toHaveBeenCalledTimes(1)
    })

    it('should call unfollowMutation when handleUnfollow is called', async () => {
        const userId = ref('12')
        const { handleUnfollow } = useUserActions(userId)

        const promise = handleUnfollow()
        await vi.advanceTimersByTimeAsync(300)
        await promise

        expect(mockMutations.unfollowMutation.mutateAsync).toHaveBeenCalledTimes(1)
    })

    it('should call followMutation when handleFollow is called', async () => {
        const userId = ref('12')
        const { handleFollow } = useUserActions(userId)

        const promise = handleFollow()
        await vi.advanceTimersByTimeAsync(300)
        await promise

        expect(mockMutations.followMutation.mutateAsync).toHaveBeenCalledTimes(1)
    })

    it('should work with different userId', async () => {
        const userId = ref('different-user')
        const { handleBlock } = useUserActions(userId)

        const promise = handleBlock()
        await vi.advanceTimersByTimeAsync(300)
        await promise

        expect(useUserActionsQuery).toHaveBeenCalledWith(userId)
        expect(mockMutations.blockMutation.mutateAsync).toHaveBeenCalled()
    })
})

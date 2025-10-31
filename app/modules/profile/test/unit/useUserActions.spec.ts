import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useUserActions } from '../../composables/useUserActions'
import { useUserActionsQuery } from '../../queries/useUserActionsQuery'

vi.mock('../../queries/useUserActionsQuery', () => ({
    useUserActionsQuery: vi.fn(),
}))

describe('useUserActions', () => {
    let mockMutations: ReturnType<typeof useUserActionsQuery>

    beforeEach(() => {
        mockMutations = {
            userQuery: {
                data: ref(undefined),
                isLoading: ref(false),
                error: ref(null),
            },
            unfollowMutation: { mutate: vi.fn() } as unknown,
            blockMutation: { mutate: vi.fn() } as unknown,
            unblockMutation: { mutate: vi.fn() } as unknown,
            muteMutation: { mutate: vi.fn() } as unknown,
            unmuteMutation: { mutate: vi.fn() } as unknown,
            removeFollowerMutation: { mutate: vi.fn() } as unknown,
            followMutation: { mutate: vi.fn() } as unknown,
        } as ReturnType<typeof useUserActionsQuery>

        vi.mocked(useUserActionsQuery).mockReturnValue(mockMutations)
    })

    it('should call unmuteMutation when handleUnmute is called', () => {
        const userId = ref('12')
        const { handleUnmute } = useUserActions(userId)
        handleUnmute()
        expect(mockMutations.unmuteMutation.mutate).toHaveBeenCalledTimes(1)
    })

    it('should call muteMutation when handleMute is called', () => {
        const userId = ref('12')
        const { handleMute } = useUserActions(userId)
        handleMute()
        expect(mockMutations.muteMutation.mutate).toHaveBeenCalledTimes(1)
    })

    it('should call blockMutation when handleBlock is called', () => {
        const userId = ref('12')
        const { handleBlock } = useUserActions(userId)
        handleBlock()
        expect(mockMutations.blockMutation.mutate).toHaveBeenCalledTimes(1)
    })

    it('should call unblockMutation when handleUnblock is called', () => {
        const userId = ref('12')
        const { handleUnblock } = useUserActions(userId)
        handleUnblock()
        expect(mockMutations.unblockMutation.mutate).toHaveBeenCalledTimes(1)
    })

    it('should call removeFollowerMutation when handleRemoveFollower is called', () => {
        const userId = ref('12')
        const { handleRemoveFollower } = useUserActions(userId)
        handleRemoveFollower()
        expect(mockMutations.removeFollowerMutation.mutate).toHaveBeenCalledTimes(1)
    })

    it('should call unfollowMutation when handleUnfollow is called', () => {
        const userId = ref('12')
        const { handleUnfollow } = useUserActions(userId)
        handleUnfollow()
        expect(mockMutations.unfollowMutation.mutate).toHaveBeenCalledTimes(1)
    })

    it('should call followMutation when handleFollow is called', () => {
        const userId = ref('12')
        const { handleFollow } = useUserActions(userId)
        handleFollow()
        expect(mockMutations.followMutation.mutate).toHaveBeenCalledTimes(1)
    })

    it('should work with different userId', () => {
        const userId = ref('different-user')
        const { handleBlock } = useUserActions(userId)
        handleBlock()
        expect(useUserActionsQuery).toHaveBeenCalledWith(userId)
        expect(mockMutations.blockMutation.mutate).toHaveBeenCalled()
    })
})

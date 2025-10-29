import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUserInteractions } from '../../composables/useUserInteractions'
import { useUserInfo } from '../../composables/useUserInfo'
import { useUserActions } from '../../composables/useUserActions'
import { ref, computed } from 'vue'

vi.mock('nuxt/app', () => ({}))

vi.mock('../../composables/useUserInfo', () => ({
    useUserInfo: vi.fn(),
}))

vi.mock('../../composables/useUserActions', () => ({
    useUserActions: vi.fn(),
}))

vi.mock('../../queries/useUserActionsQuery', () => ({
    useUserActionsQuery: vi.fn(() => ({
        unfollowMutation: { mutate: vi.fn() },
        blockMutation: { mutate: vi.fn() },
        unblockMutation: { mutate: vi.fn() },
        muteMutation: { mutate: vi.fn() },
        unmuteMutation: { mutate: vi.fn() },
        removeFollowerMutation: { mutate: vi.fn() },
        followMutation: { mutate: vi.fn() },
    })),
}))

describe('useUserInteractions', () => {
    let mockSnackbar: {
        showSnackbar: ReturnType<typeof ref<boolean>>
        handleShowSnackbar: ReturnType<typeof vi.fn>
    }
    let mockConfirmation: {
        showConfirmation: ReturnType<typeof ref<boolean>>
        handleShowConfirmation: ReturnType<typeof vi.fn>
    }
    let mockUserInfo: {
        id: ReturnType<typeof computed<string>>
        username: ReturnType<typeof computed<string>>
        isFollower: ReturnType<typeof computed<boolean>>
        isFollowing: ReturnType<typeof computed<boolean>>
        isBlocked: ReturnType<typeof computed<boolean>>
        isMuted: ReturnType<typeof computed<boolean>>
        name: ReturnType<typeof computed<string>>
        bio: ReturnType<typeof computed<string>>
        avatarUrl: ReturnType<typeof computed<string>>
        followersCount: ReturnType<typeof computed<number | ''>>
        followingCount: ReturnType<typeof computed<number | ''>>
        coverUrl: ReturnType<typeof computed<string>>
    }
    let mockUserActions: {
        handleUnfollow: ReturnType<typeof vi.fn>
        handleUnmute: ReturnType<typeof vi.fn>
        handleMute: ReturnType<typeof vi.fn>
        handleBlock: ReturnType<typeof vi.fn>
        handleUnblock: ReturnType<typeof vi.fn>
        handleRemoveFollower: ReturnType<typeof vi.fn>
        handleFollow: ReturnType<typeof vi.fn>
    }
    let mockInject: unknown
    beforeEach(() => {
        mockSnackbar = {
            showSnackbar: ref(false),
            handleShowSnackbar: vi.fn(),
        }

        mockConfirmation = {
            showConfirmation: ref(false),
            handleShowConfirmation: vi.fn(),
        }

        mockUserActions = {
            handleUnfollow: vi.fn(),
            handleUnmute: vi.fn(),
            handleMute: vi.fn(),
            handleBlock: vi.fn(),
            handleUnblock: vi.fn(),
            handleRemoveFollower: vi.fn(),
            handleFollow: vi.fn(),
        }

        mockUserInfo = {
            id: computed({ get: () => '12', set: () => {} }),
            username: computed({ get: () => 'hagar', set: () => {} }),
            name: computed({ get: () => 'Hagar', set: () => {} }),
            bio: computed({ get: () => '', set: () => {} }),
            avatarUrl: computed({ get: () => '', set: () => {} }),
            coverUrl: computed({ get: () => '', set: () => {} }),
            followersCount: computed<number | ''>({ get: () => 0, set: () => {} }),
            followingCount: computed<number | ''>({ get: () => 0, set: () => {} }),
            isFollower: computed({ get: () => false, set: () => {} }),
            isFollowing: computed({ get: () => false, set: () => {} }),
            isMuted: computed({ get: () => false, set: () => {} }),
            isBlocked: computed({ get: () => false, set: () => {} }),
        }
        mockInject = vi.fn((key: string) => {
            if (key === 'snackbar') return mockSnackbar
            if (key === 'confirmation') return mockConfirmation
            return null
        })

        vi.stubGlobal('inject', mockInject)

        vi.mocked(useUserInfo).mockReturnValue(mockUserInfo)
        vi.mocked(useUserActions).mockReturnValue(mockUserActions)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    describe('handleBlockWithConfirmation', () => {
        it('should calls block confirmation and shows snackbar', () => {
            const userId = ref('12')
            const { handleBlockWithConfirmation } = useUserInteractions(userId)
            handleBlockWithConfirmation()
            const { username } = useUserInfo(userId)
            expect(mockConfirmation.showConfirmation.value).toBe(true)
            expect(mockConfirmation.handleShowConfirmation).toHaveBeenCalledWith(
                'Block',
                'Block',
                'bg-red-500',
                'text-white',
                'hover:bg-red-500/85',
                expect.stringContaining('They will be able to see your public posts'),
                expect.any(Function),
                username.value,
            )
            expect(mockUserActions.handleBlock).not.toHaveBeenCalled()
        })
        it('should hide list when provided', () => {
            const userId = ref('12')
            const showList = ref(true)
            const { handleBlockWithConfirmation } = useUserInteractions(userId)
            handleBlockWithConfirmation(showList)
            expect(showList.value).toBe(false)
        })

        it('should execute block function and show snackbar on confirmation', () => {
            const userId = ref('12')
            const { handleBlockWithConfirmation } = useUserInteractions(userId)
            handleBlockWithConfirmation()

            const callArgs = mockConfirmation.handleShowConfirmation.mock.calls[0]
            if (callArgs && callArgs[6]) {
                const handleClick = callArgs[6]
                handleClick()
            }

            expect(mockUserActions.handleBlock).toHaveBeenCalled()
            expect(mockSnackbar.handleShowSnackbar).toHaveBeenCalledWith(
                'Successfully blocked.',
                '',
                'Unblock',
                mockUserActions.handleUnblock,
            )
        })
    })
    describe('handleUnfollowWithConfirmation', () => {
        it('should calls unfollow confirmation', () => {
            const userId = ref('12')
            const { handleUnfollowWithConfirmation } = useUserInteractions(userId)
            handleUnfollowWithConfirmation()
            expect(mockConfirmation.showConfirmation.value).toBe(true)
            expect(mockConfirmation.handleShowConfirmation).toHaveBeenCalledWith(
                'Unfollow',
                'Unfollow',
                'bg-[#ebf1f1]',
                'text-black',
                'hover:bg-gray-200/90',
                expect.stringContaining(
                    'Their posts will no longer show up in your Following timeline.',
                ),
                mockUserActions.handleUnfollow,
                'hagar',
            )
            expect(mockUserActions.handleUnfollow).not.toHaveBeenCalled()
        })
    })

    it('should call handleFollow', () => {
        const userId = ref('12')
        const { handleFollowAction } = useUserInteractions(userId)

        handleFollowAction()

        expect(mockUserActions.handleFollow).toHaveBeenCalled()
    })

    describe('handleMuteWithSnackbar', () => {
        it('should mute user and show snackbar', () => {
            const userId = ref('12')
            const { handleMuteWithSnackbar } = useUserInteractions(userId)

            handleMuteWithSnackbar()

            expect(mockUserActions.handleMute).toHaveBeenCalled()
            expect(mockSnackbar.showSnackbar.value).toBe(true)
            expect(mockSnackbar.handleShowSnackbar).toHaveBeenCalledWith(
                ' has been muted.',
                'hagar',
                'Undo',
                expect.any(Function),
            )
        })
        it('should hide list when provided', () => {
            const userId = ref('12')
            const showList = ref(true)
            const { handleMuteWithSnackbar } = useUserInteractions(userId)
            handleMuteWithSnackbar(showList)

            expect(showList.value).toBe(false)
        })
    })

    describe('handleRemoveFollowerWithConfirmation', () => {
        it('should calls remove this follower confirmation and shows snackbar', () => {
            const userId = ref('12')
            const { handleRemoveFollowerWithConfirmation } = useUserInteractions(userId)

            handleRemoveFollowerWithConfirmation()

            expect(mockConfirmation.showConfirmation.value).toBe(true)
            expect(mockConfirmation.handleShowConfirmation).toHaveBeenCalledWith(
                'Remove',
                'Remove this follower',
                'bg-red-500',
                'text-white',
                'hover:bg-red-500/85',
                expect.stringContaining('They can follow you again in the future.'),
                expect.any(Function),
            )
            expect(mockUserActions.handleRemoveFollower).not.toHaveBeenCalled()
        })
        it('should remove follower and show snackbar on confirmation', () => {
            const userId = ref('12')
            const { handleRemoveFollowerWithConfirmation } = useUserInteractions(userId)

            handleRemoveFollowerWithConfirmation()

            const callArgs = mockConfirmation.handleShowConfirmation.mock.calls[0]
            if (callArgs && callArgs[6]) {
                const handleClick = callArgs[6]
                handleClick()
            }
            expect(mockUserActions.handleRemoveFollower).toHaveBeenCalled()
            expect(mockSnackbar.handleShowSnackbar).toHaveBeenCalledWith(
                ' is no longer following you.',
                'hagar',
            )
        })
    })
    describe('handleUnblockWithConfirmation', () => {
        it('should call unblock confirmation', () => {
            const userId = ref('12')
            const { handleUnblockWithConfirmation } = useUserInteractions(userId)
            handleUnblockWithConfirmation()
            expect(mockConfirmation.showConfirmation.value).toBe(true)
            expect(mockConfirmation.handleShowConfirmation).toHaveBeenCalledWith(
                'Unblock',
                'Unblock',
                'bg-[#ebf1f1]',
                'text-black',
                'hover:bg-gray-200/90',
                'They will be able to follow you and engage with your public posts.',
                mockUserActions.handleUnblock,
                'hagar',
            )
        })

        it('should hide list when provided', () => {
            const userId = ref('12')
            const showList = ref(true)
            const { handleUnblockWithConfirmation } = useUserInteractions(userId)

            handleUnblockWithConfirmation(showList)

            expect(showList.value).toBe(false)
        })
    })
    it('should calls unmute confirmaiton', () => {
        const userId = ref('12')
        const { handleUnmuteWithConfirmation } = useUserInteractions(userId)

        handleUnmuteWithConfirmation()
        expect(mockConfirmation.showConfirmation.value).toBe(true)
        expect(mockConfirmation.handleShowConfirmation).toHaveBeenCalledWith(
            'UnMute',
            'UnMute',
            'bg-[#ebf1f1]',
            'text-black',
            'hover:bg-gray-200/90',
            'Posts from this account will now be allowed in your Home timeline. ',
            expect.any(Function),
            'hagar',
        )
        expect(mockUserActions.handleUnmute).not.toHaveBeenCalled()
    })
    describe('handleUnmuteWithSnackbar', () => {
        it('should unmute user and show snackbar', () => {
            const userId = ref('12')
            const { handleUnmuteWithSnackbar } = useUserInteractions(userId)

            handleUnmuteWithSnackbar()

            expect(mockUserActions.handleUnmute).toHaveBeenCalled()
            expect(mockSnackbar.handleShowSnackbar).toHaveBeenCalledWith(
                ' has been unmuted.',
                'hagar',
            )
        })

        it('should hide list when provided', () => {
            const userId = ref('12')
            const { handleUnmuteWithSnackbar } = useUserInteractions(userId)
            const showList = ref(true)
            handleUnmuteWithSnackbar(showList)
            expect(showList.value).toBe(false)
        })
    })
})

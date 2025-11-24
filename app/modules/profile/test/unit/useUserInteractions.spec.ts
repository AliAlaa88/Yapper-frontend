import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, computed } from 'vue'
import { useUserInfo } from '../../composables/useUserInfo'
import { useUserActions } from '../../composables/useUserActions'
import { useUserInteractions } from '../../composables/useUserInteractions'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

const mockSnackbar = {
    showSnackbar: ref(false),
    handleShowSnackbar: vi.fn(),
}

const mockConfirmation = {
    showConfirmation: ref(false),
    handleShowConfirmation: vi.fn(),
}

vi.mock('vue', async () => {
    const actual = await vi.importActual<typeof import('vue')>('vue')
    return {
        ...actual,
        inject: vi.fn((key: string) => {
            if (key === 'snackbar') return mockSnackbar
            if (key === 'confirmation') return mockConfirmation
            return undefined
        }),
    }
})

vi.mock('../../composables/useUserInfo', () => ({
    useUserInfo: vi.fn(),
}))

vi.mock('../../composables/useUserActions', () => ({
    useUserActions: vi.fn(),
}))


describe('useUserInteractions', () => {
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


    beforeEach(() => {
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

        vi.mocked(useUserInfo).mockReturnValue(mockUserInfo)
        vi.mocked(useUserActions).mockReturnValue(mockUserActions)
    })

    afterEach(() => {
        // vi.unstubAllGlobals()
        vi.clearAllMocks()
    })

    describe('handleBlockWithConfirmation', () => {
        it('should calls block confirmation and shows snackbar', () => {
            const userId = ref('12')
            const { handleBlockWithConfirmation } = useUserInteractions(userId)

            handleBlockWithConfirmation()

            expect(mockConfirmation.showConfirmation.value).toBe(true)
            expect(mockConfirmation.handleShowConfirmation).toHaveBeenCalledWith(
                'profile.actions.block.title',
                'profile.actions.block.button',
                'bg-red',
                'text-primary',
                'hover:opacity-90',
                'profile.actions.block.description',
                expect.any(Function),
                'hagar',
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

        it('should execute block function and show snackbar on confirmation', async () => {
            const userId = ref('12')
            const { handleBlockWithConfirmation } = useUserInteractions(userId)

            handleBlockWithConfirmation()

            const callArgs = mockConfirmation.handleShowConfirmation.mock.calls[0]
            expect(callArgs).toBeDefined()

            if (callArgs && callArgs[6]) {
                const handleClick = callArgs[6]
                await handleClick()
            }

            expect(mockUserActions.handleBlock).toHaveBeenCalled()
            expect(mockSnackbar.handleShowSnackbar).toHaveBeenCalledWith(
                'profile.actions.block.snackbar',
                '',
                'profile.actions.block.undoButton',
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
                'profile.actions.unfollow.title',
                'profile.actions.unfollow.button',
                'bg-alternate',
                'text-alternate',
                'hover:opacity-90',
                'profile.actions.unfollow.description',
                mockUserActions.handleUnfollow,
                'hagar',
            )
            expect(mockUserActions.handleUnfollow).not.toHaveBeenCalled()
        })
    })

    it('should call handleFollow', async () => {
        const userId = ref('12')
        const { handleFollowAction } = useUserInteractions(userId)

        await handleFollowAction()

        expect(mockUserActions.handleFollow).toHaveBeenCalled()
    })

    describe('handleMuteWithSnackbar', () => {
        it('should mute user and show snackbar', async () => {
            const userId = ref('12')
            const { handleMuteWithSnackbar } = useUserInteractions(userId)

            await handleMuteWithSnackbar()

            expect(mockUserActions.handleMute).toHaveBeenCalled()
            expect(mockSnackbar.showSnackbar.value).toBe(true)
            expect(mockSnackbar.handleShowSnackbar).toHaveBeenCalledWith(
                'profile.actions.mute.snackbar',
                '',
                'profile.actions.mute.undoButton',
                expect.any(Function),
            )
        })

        it('should hide list when provided', async () => {
            const userId = ref('12')
            const showList = ref(true)
            const { handleMuteWithSnackbar } = useUserInteractions(userId)

            await handleMuteWithSnackbar(showList)

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
                'profile.actions.removeFollower.title',
                'profile.actions.removeFollower.button',
                'bg-red',
                'text-primary',
                'hover:opacity-90',
                'profile.actions.removeFollower.description',
                expect.any(Function),
            )
            expect(mockUserActions.handleRemoveFollower).not.toHaveBeenCalled()
        })

        it('should remove follower and show snackbar on confirmation', async () => {
            const userId = ref('12')
            const { handleRemoveFollowerWithConfirmation } = useUserInteractions(userId)

            handleRemoveFollowerWithConfirmation()

            const callArgs = mockConfirmation.handleShowConfirmation.mock.calls[0]
            expect(callArgs).toBeDefined()

            if (callArgs && callArgs[6]) {
                const handleClick = callArgs[6]
                await handleClick()
            }

            expect(mockUserActions.handleRemoveFollower).toHaveBeenCalled()
            expect(mockSnackbar.handleShowSnackbar).toHaveBeenCalledWith(
                'profile.actions.removeFollower.snackbar',
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
                'profile.actions.unblock.title',
                'profile.actions.unblock.button',
                'bg-alternate',
                'text-alternate',
                'hover:opacity-90',
                'profile.actions.unblock.description',
                expect.any(Function),
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
            'profile.actions.unmute.title',
            'profile.actions.unmute.button',
            'bg-alternate',
            'text-alternate',
            'hover:opacity-90',
            'profile.actions.unmute.description',
            expect.any(Function),
            'hagar',
        )
        expect(mockUserActions.handleUnmute).not.toHaveBeenCalled()
    })

    describe('handleUnmuteWithSnackbar', () => {
        it('should unmute user and show snackbar', async () => {
            const userId = ref('12')
            const { handleUnmuteWithSnackbar } = useUserInteractions(userId)

            await handleUnmuteWithSnackbar()

            expect(mockUserActions.handleUnmute).toHaveBeenCalled()
            expect(mockSnackbar.handleShowSnackbar).toHaveBeenCalledWith(
                'profile.actions.unmute.snackbar',
            )
        })

        it('should hide list when provided', async () => {
            const userId = ref('12')
            const showList = ref(true)
            const { handleUnmuteWithSnackbar } = useUserInteractions(userId)

            await handleUnmuteWithSnackbar(showList)

            expect(showList.value).toBe(false)
        })
    })
})

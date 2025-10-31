import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { useUserInfo } from '../../composables/useUserInfo'
import { useFollow } from '../../composables/useFollow'

vi.mock('../../composables/useUserInfo', () => ({
    useUserInfo: vi.fn(),
}))

const mockUserInfoRef = {
    id: ref('12'),
    username: ref('hagar'),
    name: ref('Hagar'),
    bio: ref(''),
    avatarUrl: ref(''),
    coverUrl: ref(''),
    followersCount: ref(120),
    followingCount: ref(30),
    isFollower: ref(false),
    isFollowing: ref(false),
    isMuted: ref(false),
    isBlocked: ref(false),
}

const mockUserInfo = {
    id: computed(() => mockUserInfoRef.id.value),
    username: computed(() => mockUserInfoRef.username.value),
    name: computed(() => mockUserInfoRef.name.value),
    bio: computed(() => mockUserInfoRef.bio.value),
    avatarUrl: computed(() => mockUserInfoRef.avatarUrl.value),
    coverUrl: computed(() => mockUserInfoRef.coverUrl.value),
    followersCount: computed(() => mockUserInfoRef.followersCount.value),
    followingCount: computed(() => mockUserInfoRef.followingCount.value),
    isFollower: computed(() => mockUserInfoRef.isFollower.value),
    isFollowing: computed(() => mockUserInfoRef.isFollowing.value),
    isMuted: computed(() => mockUserInfoRef.isMuted.value),
    isBlocked: computed(() => mockUserInfoRef.isBlocked.value),
}

describe('useFollow Composable', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useUserInfo).mockReturnValue(mockUserInfo)
        mockUserInfoRef.isMuted.value = false
        mockUserInfoRef.id.value = '12'
        mockUserInfoRef.username.value = 'hagar'
        mockUserInfoRef.name.value = 'Hagar'
        mockUserInfoRef.bio.value = ''
        mockUserInfoRef.avatarUrl.value = ''
        mockUserInfoRef.coverUrl.value = ''
        mockUserInfoRef.followersCount.value = 120
        mockUserInfoRef.followingCount.value = 30
        mockUserInfoRef.isFollower.value = false
        mockUserInfoRef.isFollowing.value = false
        mockUserInfoRef.isBlocked.value = false
    })

    describe('Button Text Logic', () => {
        it('should return Follow text when not follower and not following', () => {
            mockUserInfoRef.isFollower.value = false
            mockUserInfoRef.isFollowing.value = false

            const userId = ref('12')
            const {buttonText} = useFollow(userId)
            expect(buttonText.value).toBe('Follow')
        })

        it('should return Follow back text when is follower and not following', () => {
            mockUserInfoRef.isFollower.value = true
            mockUserInfoRef.isFollowing.value = false

            const userId = ref('12')
            const { buttonText } = useFollow(userId)
            expect(buttonText.value).toBe('Follow back')
        })

        it('should return Following text when following and not hovering', () => {
            mockUserInfoRef.isFollowing.value = true

            const userId = ref('12')
            const { buttonText, handleMouseOut } = useFollow(userId)
            handleMouseOut()

            expect(buttonText.value).toBe('Following')
        })

        it('should return Unfollow text when following and hovering', () => {
            mockUserInfoRef.isFollowing.value = true

            const userId = ref('12')
            const { buttonText, handleMouseOver } = useFollow(userId)
            handleMouseOver()

            expect(buttonText.value).toBe('Unfollow')
        })
    })

    it('should update buttonText when isFollowing changes', () => {
        mockUserInfoRef.isFollowing.value = false

        const userId = ref('12')
        const { buttonText } = useFollow(userId)

        expect(buttonText.value).toBe('Follow')

        mockUserInfoRef.isFollowing.value = true
        expect(buttonText.value).toBe('Following')
    })

    it('should update buttonText when isFollower changes', () => {
        mockUserInfoRef.isFollowing.value = false
        mockUserInfoRef.isFollower.value = false
        const userId = ref('12')
        const { buttonText } = useFollow(userId)

        expect(buttonText.value).toBe('Follow')

        mockUserInfoRef.isFollower.value = true
        expect(buttonText.value).toBe('Follow back')
    })

    describe('All Button State Combinations', () => {
        const testCases = [
            {
                isFollower: false,
                isFollowing: false,
                hover: false,
                expectedText: 'Follow',
                expectedClassContains: 'bg-[#F7F9F9]',
            },
            {
                isFollower: true,
                isFollowing: false,
                hover: false,
                expectedText: 'Follow back',
                expectedClassContains: 'bg-[#F7F9F9]',
            },
            {
                isFollower: false,
                isFollowing: true,
                hover: false,
                expectedText: 'Following',
                expectedClassContains: 'bg-transparent',
            },
            {
                isFollower: true,
                isFollowing: true,
                hover: false,
                expectedText: 'Following',
                expectedClassContains: 'bg-transparent',
            },
            {
                isFollower: false,
                isFollowing: true,
                hover: true,
                expectedText: 'Unfollow',
                expectedClassContains: 'bg-red-500/10',
            },
            {
                isFollower: true,
                isFollowing: true,
                hover: true,
                expectedText: 'Unfollow',
                expectedClassContains: 'bg-red-500/10',
            },
        ]

        testCases.forEach(
            ({ isFollower, isFollowing, hover, expectedText, expectedClassContains }) => {
                it(`should display "${expectedText}" when isFollower=${isFollower}, isFollowing=${isFollowing}, hover=${hover}`, () => {
                    mockUserInfoRef.isFollower.value = isFollower
                    mockUserInfoRef.isFollowing.value = isFollowing

                    const userId = ref('12')
                    const { buttonText, buttonClass, handleMouseOver, handleMouseOut } =
                        useFollow(userId)

                    if (hover) {
                        handleMouseOver()
                    } else {
                        handleMouseOut()
                    }

                    expect(buttonText.value).toBe(expectedText)
                    expect(buttonClass.value).toContain(expectedClassContains)
                })
            },
        )
    })
})

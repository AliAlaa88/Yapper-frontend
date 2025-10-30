import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserInteractions } from '../../composables/useUserInteractions'
import { useUserInfo } from '../../composables/useUserInfo'
import { ref, computed, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useFollow } from '../../composables/useFollow'
import ProfileFollowAction from '../../components/ProfileHeader/SubComponents/ProfileFollowAction.vue'

vi.mock('../../composables/useUserInfo', () => ({
    useUserInfo: vi.fn(),
}))

vi.mock('../../composables/useUserInteractions', () => ({
    useUserInteractions: vi.fn(),
}))

vi.mock('../../composables/useFollow', () => ({
    useFollow: vi.fn(),
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
const mockUserInteractions = {
    handleUnmuteWithConfirmation: vi.fn(),
    handleBlockWithConfirmation: vi.fn(),
    handleMuteWithSnackbar: vi.fn(),
    handleRemoveFollowerWithConfirmation: vi.fn(),
    handleUnblockWithConfirmation: vi.fn(),
    handleUnmuteWithSnackbar: vi.fn(),
    handleUnfollowWithConfirmation: vi.fn(),
    handleFollowAction: vi.fn(),
}

const buttonClass = ref('bg-[#F7F9F9] text-[#15202B]')
const buttonText = ref('Follow')

const mockUseFollow = {
    buttonClass: computed(() => buttonClass.value),
    buttonText: computed(() => buttonText.value),
    handleMouseOut: vi.fn(),
    handleMouseOver: vi.fn(),
}

describe('ProfileMuteMessage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useUserInfo).mockReturnValue(mockUserInfo)
        vi.mocked(useUserInteractions).mockReturnValue(mockUserInteractions)
        vi.mocked(useFollow)
            .mockReturnValue(mockUseFollow as unknown as ReturnType<typeof useFollow>)
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

    it('should render button when user is not blocked', () => {
        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should not render button when user is not blocked', async () => {
        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })
        mockUserInfoRef.isBlocked.value = true
        await nextTick()

        expect(wrapper.find('div').exists()).toBe(false)

    })

    it('should show/hide button when isBlocked changes', async () => {
        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        expect(wrapper.find('button').exists()).toBe(true)

        mockUserInfoRef.isBlocked.value = true
        await nextTick()

        expect(wrapper.find('button').exists()).toBe(false)

        mockUserInfoRef.isBlocked.value = false
        await nextTick()

        expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should display correct button text', async () => {

        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })
        buttonText.value = 'Follow'
        await nextTick()

        expect(wrapper.find('button').text()).toBe('Follow')
    })

    it('should apply correct button classes', async () => {
        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        buttonClass.value = 'bg-[#F7F9F9] text-[#15202B]'
        await nextTick()
        const button = wrapper.find('button')
        expect(button.classes()).toContain('cursor-pointer')
        expect(button.classes()).toContain('font-bold')
        expect(button.classes()).toContain('rounded-full')
    })

    it('should call handleFollowAction when not following and button is clicked', async () => {
        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })
        mockUserInfoRef.isFollowing.value = false
        await nextTick()

        const followButton = wrapper.find('button')
        await followButton.trigger('click')

        expect(mockUserInteractions.handleFollowAction).toHaveBeenCalledTimes(1)
        expect(mockUserInteractions.handleUnfollowWithConfirmation).not.toHaveBeenCalled()
    })

    it('should call handleUnfollowWithConfirmation when following and button is clicked', async () => {
        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })
        mockUserInfoRef.isFollowing.value = true
        await nextTick()

        const followButton = wrapper.find('button')
        await followButton.trigger('click')

        expect(mockUserInteractions.handleUnfollowWithConfirmation).toHaveBeenCalledTimes(1)
        expect(mockUserInteractions.handleFollowAction).not.toHaveBeenCalled()
    })

    it('should handle hover sequence correctly', async () => {
        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        const followButton = wrapper.find('button')

        await followButton.trigger('mouseover')
        expect(mockUseFollow.handleMouseOver).toHaveBeenCalledTimes(1)

        await followButton.trigger('mouseout')
        expect(mockUseFollow.handleMouseOut).toHaveBeenCalledTimes(1)

        await followButton.trigger('mouseover')
        expect(mockUseFollow.handleMouseOver).toHaveBeenCalledTimes(2)
    })

    it('should update button text when buttonText changes', async () => {
        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        expect(wrapper.find('button').text()).toBe('Follow')

        buttonText.value = 'Following'
        await nextTick()

        expect(wrapper.find('button').text()).toBe('Following')
    })

    it('should throw error when userId is missing', () => {
        expect(() => {
            mount(ProfileFollowAction, {
                global: {
                    provide: {},
                },
            })
        }).toThrow('Missing required provide: user-id')
    })

    it('should handle rapid clicks', async () => {
        mockUserInfoRef.isFollowing.value = false

        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        const button = wrapper.find('button')
        await button.trigger('click')
        await button.trigger('click')
        await button.trigger('click')

        expect(mockUserInteractions.handleFollowAction).toHaveBeenCalledTimes(3)
    })

    it('should handle state change during interaction', async () => {
        mockUserInfoRef.isFollowing.value = false

        const wrapper = mount(ProfileFollowAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        const button = wrapper.find('button')
        await button.trigger('click')

        mockUserInfoRef.isFollowing.value = true
        await nextTick()

        await button.trigger('click')

        expect(mockUserInteractions.handleFollowAction).toHaveBeenCalledTimes(1)
        expect(mockUserInteractions.handleUnfollowWithConfirmation).toHaveBeenCalledTimes(1)
    })
})

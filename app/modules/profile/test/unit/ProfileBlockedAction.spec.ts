import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserInteractions } from '../../composables/useUserInteractions'
import { useUserInfo } from '../../composables/useUserInfo'
import { ref, computed, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import ProfileBlockedAction from '../../components/ProfileHeader/SubComponents/ProfileBlockedAction.vue'

vi.mock('../../composables/useUserInfo', () => ({
    useUserInfo: vi.fn(),
}))

vi.mock('../../composables/useUserInteractions', () => ({
    useUserInteractions: vi.fn(),
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

describe('ProfileMuteMessage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useUserInfo).mockReturnValue(mockUserInfo)
        vi.mocked(useUserInteractions).mockReturnValue(mockUserInteractions)
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

    it('should not render when user is not blocked', () => {
        const wrapper = mount(ProfileBlockedAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        expect(wrapper.find('div').exists()).toBe(false)
    })

    it('should render when user is blocked', async () => {
        const wrapper = mount(ProfileBlockedAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        mockUserInfoRef.isBlocked.value = true
        await nextTick()

        expect(wrapper.find('div').exists()).toBe(true)
        expect(wrapper.text()).toContain('Blocked')
    })

    it('should change button text on hover', async () => {
        const wrapper = mount(ProfileBlockedAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        mockUserInfoRef.isBlocked.value = true
        await nextTick()

        const button = wrapper.find('button')
        expect(button.text()).toBe('Blocked')

        await button.trigger('mouseover')
        expect(button.text()).toBe('Unblock')

        await button.trigger('mouseout')
        expect(button.text()).toBe('Blocked')
    })

    it('should call handleUnblockWithConfirmation when unblock is clicked', async () => {
        const wrapper = mount(ProfileBlockedAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        mockUserInfoRef.isBlocked.value = true
        await nextTick()

        const button = wrapper.find('button')
        await button.trigger('click')
        expect(mockUserInteractions.handleUnblockWithConfirmation).toHaveBeenCalledTimes(1)
    })

    it('should handle missing userId gracefully', () => {
        expect(() => {
            mount(ProfileBlockedAction, {
                global: {
                    provide: {},
                },
            })
        }).toThrow()
    })

    it('should have correct Tailwind classes', async () => {
        const wrapper = mount(ProfileBlockedAction, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })
        mockUserInfoRef.isBlocked.value = true
        await nextTick()

        const button = wrapper.find('button')
        expect(button.classes()).toContain('bg-red-500')
        expect(button.classes()).toContain('text-white')
    })
})

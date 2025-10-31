import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserInteractions } from '../../composables/useUserInteractions'
import { useUserInfo } from '../../composables/useUserInfo'
import { ref, computed, nextTick } from 'vue'
import ProfileMuteMessage from '../../components/ProfileHeader/SubComponents/ProfileMuteMessage.vue'
import { mount } from '@vue/test-utils'

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

    it('should not render when user is unmuted', () => {
        const wrapper = mount(ProfileMuteMessage, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        expect(wrapper.find('div').exists()).toBe(false)
    })

    it('should render when user is muted', async () => {
        const wrapper = mount(ProfileMuteMessage, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        expect(wrapper.find('div').exists()).toBe(false)

        mockUserInfoRef.isMuted.value = true
        await nextTick()

        expect(wrapper.find('div').exists()).toBe(true)
        expect(wrapper.text()).toContain('You have muted posts from this account.')
        expect(wrapper.text()).toContain('Unmute')
    })

    it('should call handleUnmuteWithConfirmation when unmute is clicked', async () => {
        const wrapper = mount(ProfileMuteMessage, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        mockUserInfoRef.isMuted.value = true
        await nextTick()
        console.log(wrapper.html())
        const unmuteLink = wrapper.find('.text-blue-400')
        expect(unmuteLink.exists()).toBe(true)
        await unmuteLink.trigger('click')

        expect(mockUserInteractions.handleUnmuteWithConfirmation).toHaveBeenCalledTimes(1)
    })

    it('should hide message after clicking unmute', async () => {
        const wrapper = mount(ProfileMuteMessage, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        mockUserInfoRef.isMuted.value = true
        await nextTick()

        expect(wrapper.find('div').exists()).toBe(true)

        const unmuteLink = wrapper.find('.text-blue-400')
        expect(unmuteLink.exists()).toBe(true)
        await unmuteLink.trigger('click')
        await nextTick()

        expect(wrapper.find('div').exists()).toBe(false)

    })

    it('should show message when isMuted changes to true', async () => {
        const wrapper = mount(ProfileMuteMessage, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        expect(wrapper.find('div').exists()).toBe(false)

        mockUserInfoRef.isMuted.value = true
        await nextTick()

        expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should hide message when isMuted changes to false', async () => {

        const wrapper = mount(ProfileMuteMessage, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })
        mockUserInfoRef.isMuted.value = true

        await nextTick()
        expect(wrapper.find('div').exists()).toBe(true)

        mockUserInfoRef.isMuted.value = false
        await nextTick()

        expect(wrapper.find('div').exists()).toBe(false)
    })

    it('should react to multiple mute/unmute toggles', async () => {
        const wrapper = mount(ProfileMuteMessage, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        expect(wrapper.find('div').exists()).toBe(false)

        mockUserInfoRef.isMuted.value = true
        await nextTick()
        expect(wrapper.find('div').exists()).toBe(true)

        mockUserInfoRef.isMuted.value = false
        await nextTick()
        expect(wrapper.find('div').exists()).toBe(false)

        mockUserInfoRef.isMuted.value = true
        await nextTick()
        expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should handle rapid clicks on Unmute button', async () => {
        const wrapper = mount(ProfileMuteMessage, {
            global: {
                provide: {
                    'user-id': ref('12'),
                },
            },
        })

        mockUserInfoRef.isMuted.value = true
        await nextTick()

        const unmuteLink = wrapper.find('.text-blue-400')

        await unmuteLink.trigger('click')
        await unmuteLink.trigger('click')
        await unmuteLink.trigger('click')

        expect(mockUserInteractions.handleUnmuteWithConfirmation).toHaveBeenCalledTimes(3)
    })
})

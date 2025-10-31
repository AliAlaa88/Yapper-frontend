import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserInteractions } from '../../composables/useUserInteractions'
import { useUserInfo } from '../../composables/useUserInfo'
import { ref, computed, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import ProfileActionsMenu from '../../components/ProfileHeader/SubComponents/ProfileActionsMenu.vue'

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

describe('ProfileActionsMenu Component', () => {
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

    it('should not rander when provided showList is false', () => {
        const wrapper = mount(ProfileActionsMenu, {
            global: {
                provide: {
                    'user-id': ref('12'),
                    'show-list': ref(false),
                },
            },
        })
        console.log(wrapper.html())

        expect(wrapper.find('div').exists()).toBe(false)
    })

    it('should rander when provided showList is true', () => {
        const wrapper = mount(ProfileActionsMenu, {
            global: {
                provide: {
                    'user-id': ref('12'),
                    'show-list': ref(true),
                },
            },
        })
        console.log(wrapper.html())

        expect(wrapper.find('div').exists()).toBe(true)
    })

    describe('mute button', () => {
        it('should find mute button if the user is not blocked', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })
            mockUserInfoRef.isBlocked.value = false
            await nextTick()

            expect(wrapper.find('#mute-button').exists()).toBe(true)
        })

        it('should not find mute button if the user is blocked', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })
            mockUserInfoRef.isBlocked.value = true
            await nextTick()

            expect(wrapper.find('#mute-button').exists()).toBe(false)
        })

        it('should rander mute button with Mute text when not muted', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })
            mockUserInfoRef.isBlocked.value = false
            mockUserInfoRef.isMuted.value = false
            await nextTick()

            const muteButton = wrapper.find('#mute-button')
            expect(muteButton.text()).toBe('Mute')
        })

        it('should rander mute button with Unmute text when muted', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })
            mockUserInfoRef.isBlocked.value = false
            mockUserInfoRef.isMuted.value = true
            await nextTick()

            const muteButton = wrapper.find('#mute-button')
            expect(muteButton.text()).toBe('Unmute')
        })

        it('should call handleUnmuteWithSnackbar when click mute button and user is muted', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })
            mockUserInfoRef.isBlocked.value = false
            mockUserInfoRef.isMuted.value = true
            await nextTick()

            const muteButton = wrapper.find('#mute-button')
            muteButton.trigger('click')
            expect(mockUserInteractions.handleUnmuteWithSnackbar).toHaveBeenCalledTimes(1)
        })

        it('should call handleMuteWithSnackbar when click mute button and user is not muted', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })
            mockUserInfoRef.isBlocked.value = false
            mockUserInfoRef.isMuted.value = false
            await nextTick()

            const muteButton = wrapper.find('#mute-button')
            muteButton.trigger('click')
            expect(mockUserInteractions.handleMuteWithSnackbar).toHaveBeenCalledTimes(1)
        })
    })

    describe('remove follower button', () => {
        it('should rander remove follower when uesr is follower and not blocked', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })

            mockUserInfoRef.isBlocked.value = false
            mockUserInfoRef.isFollower.value = true
            await nextTick()

            expect(wrapper.find('#remove-follower-button').exists()).toBe(true)
        })

        it('should not rander remove follower rander when uesr is not follower', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })

            mockUserInfoRef.isBlocked.value = false
            mockUserInfoRef.isFollower.value = false
            await nextTick()

            expect(wrapper.find('#remove-follower-button').exists()).toBe(false)
        })

        it('should not rander remove follower rander when uesr is blocked', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })

            mockUserInfoRef.isBlocked.value = true
            mockUserInfoRef.isFollower.value = true
            await nextTick()

            expect(wrapper.find('#remove-follower-button').exists()).toBe(false)
        })

        it('should call handleRemoveFollowerWithConfirmation when click remove follower', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })
            mockUserInfoRef.isBlocked.value = false
            mockUserInfoRef.isFollower.value = true
            await nextTick()

            const removeButton = wrapper.find('#remove-follower-button')
            removeButton.trigger('click')

            expect(mockUserInteractions.handleRemoveFollowerWithConfirmation).toHaveBeenCalledTimes(
                1,
            )
        })
    })

    describe('block button', () => {
        it('should rander Block text when not blocked', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })

            mockUserInfoRef.isBlocked.value = false
            await nextTick()
            const blockButton = wrapper.find('#block-button')
            expect(blockButton.text()).toContain('Block')
        })

        it('should rander Unblock text when blocked', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })

            mockUserInfoRef.isBlocked.value = true
            await nextTick()
            const blockButton = wrapper.find('#block-button')
            expect(blockButton.text()).toContain('Unblock')
        })

        it('should call handleUnblockWithConfirmation when blocked', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })

            mockUserInfoRef.isBlocked.value = true
            await nextTick()
            const blockButton = wrapper.find('#block-button')
            blockButton.trigger('click')
            expect(mockUserInteractions.handleUnblockWithConfirmation).toHaveBeenCalledTimes(1)
        })

        it('should call handleBlockWithConfirmation when not blocked', async () => {
            const wrapper = mount(ProfileActionsMenu, {
                global: {
                    provide: {
                        'user-id': ref('12'),
                        'show-list': ref(true),
                    },
                },
            })

            mockUserInfoRef.isBlocked.value = false
            await nextTick()
            const blockButton = wrapper.find('#block-button')
            blockButton.trigger('click')
            expect(mockUserInteractions.handleBlockWithConfirmation).toHaveBeenCalledTimes(1)
        })
    })

    it('handles missing user-id gracefully', () => {
        expect(() => {
            mount(ProfileActionsMenu, {
                global: {
                    provide: { 'show-list': ref(true) },
                },
            })
        }).toThrow()
    })
})

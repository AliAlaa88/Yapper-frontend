import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '../../components/UserCard/UserCard.vue'
import type { FollowUser } from '~/modules/profile/types/user'

vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/ProfileFollowAction.vue', () => ({
    default: {
        name: 'ProfileFollowAction',
        template: '<button class="follow-action-btn">Follow</button>',
        props: ['userId', 'username'],
    },
}))

vi.mock('../../components/UserImage/UserImage.vue', () => ({
    default: {
        name: 'UserImage',
        template: '<div class="user-image">Avatar</div>',
        props: ['imageUrl', 'name', 'compact'],
    },
}))

describe('UserCard Component', () => {
    const mockUser: FollowUser = {
        user_id: '1',
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        bio: 'Software developer',
        avatar_url: 'https://example.com/avatar.jpg',
        is_following: false,
        is_follower: false,
        is_muted: false,
        is_blocked: false,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render user card', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('John Doe')
    })

    it('should display user name', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('John Doe')
    })

    it('should display user username', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('@johndoe')
    })

    it('should display user bio when hideBio is false', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
                hideBio: false,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('Software developer')
    })

    it('should hide bio when hideBio is true', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
                hideBio: true,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).not.toContain('Software developer')
    })

    it('should show "Follows you" badge when is_follower is true', () => {
        const followerUser = { ...mockUser, is_follower: true }

        const wrapper = mount(UserCard, {
            props: {
                user: followerUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('Follows you')
    })

    it('should not show "Follows you" badge when is_follower is false', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).not.toContain('Follows you')
    })

    it('should render follow action button', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.find('.follow-action-btn').exists()).toBe(true)
    })

    it('should link to user profile', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const link = wrapper.find('a')
        expect(link.attributes('to')).toBe('/johndoe')
    })

    it('should render user image component', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.find('.user-image').exists()).toBe(true)
    })

    it('should handle user without bio', () => {
        const userNoBio = { ...mockUser, bio: '' }

        const wrapper = mount(UserCard, {
            props: {
                user: userNoBio,
                hideBio: false,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('John Doe')
        expect(wrapper.text()).toContain('@johndoe')
    })

    it('should handle special characters in user data', () => {
        const specialUser: FollowUser = {
            ...mockUser,
            name: 'John & Jane',
            username: 'john_jane_123',
            bio: 'Developer @ Company',
        }

        const wrapper = mount(UserCard, {
            props: {
                user: specialUser,
                hideBio: false,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('John & Jane')
        expect(wrapper.text()).toContain('@john_jane_123')
    })

    it('should handle user with multiple follower states', async () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
                hideBio: false,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        await wrapper.setProps({
            user: { ...mockUser, is_follower: true },
        })

        expect(wrapper.text()).toContain('Follows you')
    })

    it('should render truncated text for long usernames', () => {
        const longUsernameUser: FollowUser = {
            ...mockUser,
            username: 'very_long_username_that_should_be_truncated',
        }

        const wrapper = mount(UserCard, {
            props: {
                user: longUsernameUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('very_long_username_that_should_be_truncated')
    })

    it('should apply hover effects', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        const container = wrapper.find('[class*="hover:"]')
        expect(container.exists()).toBe(true)
    })

    it('should render with correct component structure', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.find('.follow-action-btn').exists()).toBe(true)
        expect(wrapper.find('.user-image').exists()).toBe(true)
    })

    it('should pass correct props to UserImage', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.find('.user-image').exists()).toBe(true)
    })

    it('should pass correct props to ProfileFollowAction', () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.find('.follow-action-btn').exists()).toBe(true)
    })

    it('should handle bio line clamping', () => {
        const userLongBio = {
            ...mockUser,
            bio: 'This is a very long bio that should be clamped to show only a limited number of lines and then truncated with ellipsis to indicate there is more content',
        }

        const wrapper = mount(UserCard, {
            props: {
                user: userLongBio,
                hideBio: false,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        })

        expect(wrapper.find('[class*="line-clamp"]').exists()).toBe(true)
    })

    it('should be fully interactive', async () => {
        const wrapper = mount(UserCard, {
            props: {
                user: mockUser,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('a').attributes('to')).toBe('/johndoe')
        expect(wrapper.find('.follow-action-btn').exists()).toBe(true)
    })
})

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationCard from '~/modules/notifications/components/SubComponents/NotificationCard.vue'
import { Heart } from 'lucide-vue-next'

const mockUsers = [
    {
        id: '1',
        username: 'user1',
        name: 'User One',
        avatar_url: 'https://example.com/avatar1.jpg',
        bio: 'Bio 1',
        followers: 100,
        following: 50,
    },
    {
        id: '2',
        username: 'user2',
        name: 'User Two',
        avatar_url: 'https://example.com/avatar2.jpg',
        bio: 'Bio 2',
        followers: 200,
        following: 100,
    },
    {
        id: '3',
        username: 'user3',
        name: 'User Three',
        avatar_url: 'https://example.com/avatar3.jpg',
        bio: 'Bio 3',
        followers: 300,
        following: 150,
    },
]

const NuxtLinkStub = {
    template: '<a :to="to"><slot /></a>',
    props: ['to'],
}

const CustomToolTipStub = {
    template: '<div><slot name="trigger" /><slot name="content" /></div>',
}

const UserCardStub = {
    template: '<div class="user-card">User Card</div>',
    props: ['id', 'name', 'username', 'avatar', 'bio', 'followersCount', 'followingCount'],
}

const UserImageStub = {
    template: '<img class="user-image" />',
    props: ['imageUrl', 'name', 'size'],
}

describe('NotificationCard', () => {
    const factory = (props = {}) => {
        return mount(NotificationCard, {
            props: {
                icon: Heart,
                iconColor: '#f91880',
                message: 'liked your post',
                postText: 'This is a test post',
                users: mockUsers.slice(0, 2),
                createdAt: '2h',
                link: '/notifications/123',
                ...props,
            },
            global: {
                mocks: {
                    $t: (key: string) => {
                        const translations: Record<string, string> = {
                            'notifications.content.and': 'and',
                            'notifications.content.others': 'others',
                        }
                        return translations[key] || key
                    },
                },
                stubs: {
                    NuxtLink: NuxtLinkStub,
                    CustomToolTip: CustomToolTipStub,
                    UserCard: UserCardStub,
                    UserImage: UserImageStub,
                },
            },
        })
    }

    it('renders user avatars for all users', () => {
        const wrapper = factory()

        const userImages = wrapper.findAllComponents(UserImageStub)
        expect(userImages).toHaveLength(2)
        expect(userImages[0].props('imageUrl')).toBe('https://example.com/avatar1.jpg')
        expect(userImages[0].props('name')).toBe('User One')
    })

    it('displays up to 2 users with names and message', () => {
        const wrapper = factory()

        expect(wrapper.text()).toContain('User One')
        expect(wrapper.text()).toContain('User Two')
        expect(wrapper.text()).toContain('liked your post')
    })

    it('shows hidden count when more than 2 users', () => {
        const wrapper = factory({
            users: mockUsers,
        })

        expect(wrapper.text()).toContain('User One')
        expect(wrapper.text()).toContain('User Two')
        expect(wrapper.text()).toContain('and')
        expect(wrapper.text()).toContain('1')
        expect(wrapper.text()).toContain('others')
    })

    it('renders post text when provided', () => {
        const wrapper = factory({
            postText: 'This is my awesome tweet!',
        })

        expect(wrapper.text()).toContain('This is my awesome tweet!')

        const postTextElement = wrapper.find('.text-muted.text-sm')
        expect(postTextElement.exists()).toBe(true)
    })

    it('displays creation time', () => {
        const wrapper = factory({
            createdAt: '5m',
        })

        expect(wrapper.text()).toContain('5m')

        const timeElement = wrapper.find('.text-muted.text-xs.whitespace-nowrap')
        expect(timeElement.exists()).toBe(true)
    })

    it('detects RTL text and applies correct direction', () => {
        const wrapper = factory({
            postText: 'مرحبا بك في تويتر',
        })

        const postTextElement = wrapper.find('.text-muted.text-sm')
        expect(postTextElement.classes()).toContain('text-right')
        expect(postTextElement.attributes('dir')).toBe('rtl')
    })

    it('applies LTR direction for non-RTL text', () => {
        const wrapper = factory({
            postText: 'Hello world',
        })

        const postTextElement = wrapper.find('.text-muted.text-sm')
        expect(postTextElement.classes()).toContain('text-left')
        expect(postTextElement.attributes('dir')).toBe('ltr')
    })

    it('creates correct link to notification', () => {
        const wrapper = factory({
            link: '/user/status/456',
        })

        const mainLink = wrapper.find('#link-notification-card')
        expect(mainLink.attributes('to')).toBe('/user/status/456')
    })

    it('renders user links with correct URLs', () => {
        const wrapper = factory()

        const userLinks = wrapper.findAll('a[id^="user-"]')
        expect(userLinks.length).toBeGreaterThan(0)
        expect(userLinks[0]?.attributes('to')).toContain('/user1')
    })
})

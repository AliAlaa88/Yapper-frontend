import { describe, it, expect, vi, afterAll, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import NotificationItem from '~/modules/notifications/components/SubComponents/NotificationItem.vue'

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({}),
}))

vi.mock('vue-router', () => ({
    useRoute: () => ({ path: '/notifications' }),
    useRouter: () => ({
        back: vi.fn(),
        push: vi.fn(),
    }),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: { value: { username: 'testuser' } },
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: { value: 'en' },
    }),
}))

vi.stubGlobal('useNuxtApp', () => ({}))
vi.stubGlobal('useRoute', () => ({ path: '/notifications' }))
vi.stubGlobal('useRouter', () => ({
    back: vi.fn(),
    push: vi.fn(),
}))
vi.stubGlobal('useI18n', () => ({
    t: (key: string) => key,
    locale: { value: 'en' },
}))

vi.useFakeTimers()
const FIXED_NOW = 1699999999999
vi.spyOn(global.Date, 'now').mockImplementation(() => FIXED_NOW)

const recentDate = () => new Date(FIXED_NOW - 1000).toISOString()
const oldDate = () => '2020-01-01T00:00:00.000Z'

const baseNotification = {
    id: '1',
    type: 'follow' as const,
    created_at: recentDate(),
    followers: [],
}

const mountWrapper = (overrides: Partial<typeof baseNotification> = {}) =>
    mount(NotificationItem, {
        props: {
            notification: {
                ...baseNotification,
                ...overrides,
            },
        },
        global: {
            stubs: {
                NuxtLink: true,
                Tweet: true,
                NotificationCard: true,
            },
        },
    })

describe('NotificationItem', () => {
    beforeEach(() => {
        vi.clearAllTimers()
        vi.clearAllMocks()
    })

    it('renders notification item', () => {
        const wrapper = mount(NotificationItem, {
            props: {
                notification: baseNotification,
            },
            global: {
                stubs: {
                    NuxtLink: true,
                    Tweet: true,
                    NotificationCard: true,
                },
            },
        })
        expect(wrapper.exists()).toBe(true)
    })


    it('computes correct notification message for follow type', () => {
        const wrapper = mountWrapper({
            type: 'follow',
        })
        const message = wrapper.vm.notificationMessage
        expect(message).toBe('notifications.content.followedYou')
    })

    it('computes correct notification message for message type', () => {
        const wrapper = mountWrapper({
            type: 'message' as const,
            sender: {
                id: 'user1',
                name: 'User One',
                username: 'user1',
                avatar_url: null,
            } as any,
            message_id: 'msg1',
            chat_id: 'chat1',
        } as any)
        const message = (wrapper.vm as any).notificationMessage
        expect(message).toBe('notifications.content.sentYouAMessage')
    })

    it('computes correct notification icon for follow', () => {
        const wrapper = mountWrapper({
            type: 'follow',
        })
        expect((wrapper.vm as any).notificationIcon).toBeDefined()
    })

    it('computes correct notification icon for like', () => {
        const wrapper = mountWrapper({
            type: 'like' as const,
            tweets: [],
        } as any)
        expect((wrapper.vm as any).notificationIcon).toBeDefined()
    })

    it('computes correct notification icon for repost', () => {
        const wrapper = mountWrapper({
            type: 'repost' as const,
            tweets: [],
        } as any)
        expect((wrapper.vm as any).notificationIcon).toBeDefined()
    })

    it('computes correct notification icon for message', () => {
        const wrapper = mountWrapper({
            type: 'message' as const,
            sender: { id: 'u1', name: 'U', username: 'u', avatar_url: null } as any,
            message_id: 'msg1',
            chat_id: 'chat1',
        } as any)
        expect((wrapper.vm as any).notificationIcon).toBeDefined()
    })

    it('computes correct notification icon color for follow', () => {
        const wrapper = mountWrapper({ type: 'follow' })
        expect((wrapper.vm as any).notificationIconColor).toBe('#1d9bf0')
    })

    it('computes correct notification icon color for like', () => {
        const wrapper = mountWrapper({ type: 'like' as const, tweets: [] } as any)
        expect((wrapper.vm as any).notificationIconColor).toBe('#f91880')
    })

    it('computes correct notification icon color for repost', () => {
        const wrapper = mountWrapper({ type: 'repost' as const, tweets: [] } as any)
        expect((wrapper.vm as any).notificationIconColor).toBe('#00ba7c')
    })

    it('computes correct notification icon color for message', () => {
        const wrapper = mountWrapper({
            type: 'message' as const,
            sender: { id: 'u1', name: 'U', username: 'u', avatar_url: null } as any,
            message_id: 'msg1',
            chat_id: 'chat1',
        } as any)
        expect((wrapper.vm as any).notificationIconColor).toBe('#7856ff')
    })

    it('computes correct fill color for like', () => {
        const wrapper = mountWrapper({ type: 'like' as const, tweets: [] } as any)
        expect((wrapper.vm as any).notificationFillColor).toBe('#f91880')
    })

    it('computes correct fill color for follow', () => {
        const wrapper = mountWrapper({ type: 'follow' })
        expect((wrapper.vm as any).notificationFillColor).toBe('#1d9bf0')
    })

    it('computes notification link for single follower', () => {
        const wrapper = mountWrapper({
            type: 'follow',
            followers: [
                {
                    id: 'user1',
                    name: 'User One',
                    username: 'user1',
                    avatar_url: null,
                } as any,
            ],
        })
        expect(wrapper.vm.notificationLink).toBe('/user1')
    })

    it('computes notification link for like notification', () => {
        const wrapper = mountWrapper({
            type: 'like',
            likers: [
                {
                    id: 'user1',
                    name: 'User One',
                    username: 'user1',
                    avatar_url: null,
                } as any,
            ],
            tweets: [
                {
                    tweet_id: 'tweet1',
                    type: 'tweet',
                    content: 'Hello',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T10:00:00Z',
                    updated_at: '2025-12-15T10:00:00Z',
                } as any,
            ],
        })
        expect(wrapper.vm.notificationLink).toContain('user1')
        expect(wrapper.vm.notificationLink).toContain('status')
    })

    it('computes notification link for repost notification', () => {
        const wrapper = mountWrapper({
            type: 'repost',
            reposters: [
                {
                    id: 'user1',
                    name: 'User One',
                    username: 'user1',
                    avatar_url: null,
                } as any,
            ],
            tweets: [
                {
                    tweet_id: 'tweet1',
                    type: 'tweet',
                    content: 'Hello',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T10:00:00Z',
                    updated_at: '2025-12-15T10:00:00Z',
                } as any,
            ],
        })
        expect(wrapper.vm.notificationLink).toContain('user1')
        expect(wrapper.vm.notificationLink).toContain('status')
    })

    it('computes notification link for message notification', () => {
        const wrapper = mountWrapper({
            type: 'message',
            sender: { id: 'u1', name: 'U', username: 'u', avatar_url: null } as any,
            message_id: 'msg1',
            chat_id: 'chat1',
        })
        expect(wrapper.vm.notificationLink).toBe('/messages/chat1')
    })


    it('exposes isNew to parent component', () => {
        const wrapper = mountWrapper()
        expect(wrapper.vm.isNew).toBeDefined()
    })
})

afterAll(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
})

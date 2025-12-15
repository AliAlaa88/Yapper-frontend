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

    // it('marks notification as new on mount', async () => {
    //     const wrapper = mountWrapper({ created_at: recentDate() })
    //     await nextTick()

    //     await new Promise((resolve) => setTimeout(resolve, 0))
    //     vi.runAllTimers()
    //     await nextTick()

    //     expect(wrapper.vm.isNew).toBe(true)
    //     expect(wrapper.classes()).toContain('is-new')
    // })

    // it('removes isNew after timeout', async () => {
    //     const wrapper = mountWrapper({ created_at: recentDate() })
    //     await nextTick()

    //     await new Promise((resolve) => setTimeout(resolve, 0))
    //     vi.runAllTimers()
    //     await nextTick()

    //     expect(wrapper.vm.isNew).toBe(true)

    //     // Advance time by 10 seconds to trigger the timeout that sets isNew to false
    //     vi.advanceTimersByTime(10000)
    //     await nextTick()

    //     expect(wrapper.vm.isNew).toBe(false)
    //     expect(wrapper.classes()).not.toContain('is-new')
    // })

    // it('reacts to created_at changes', async () => {
    //     const wrapper = mountWrapper({ created_at: oldDate() })
    //     await nextTick()
    //     await new Promise((resolve) => setTimeout(resolve, 0))
    //     vi.runAllTimers()
    //     await nextTick()

    //     expect(wrapper.vm.isNew).toBe(false)

    //     await wrapper.setProps({
    //         notification: { ...wrapper.props().notification, created_at: recentDate() },
    //     })

    //     await nextTick()
    //     await new Promise((resolve) => setTimeout(resolve, 0))
    //     vi.runAllTimers()
    //     await nextTick()

    //     expect(wrapper.vm.isNew).toBe(true)
    //     expect(wrapper.classes()).toContain('is-new')
    // })
})

afterAll(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
})

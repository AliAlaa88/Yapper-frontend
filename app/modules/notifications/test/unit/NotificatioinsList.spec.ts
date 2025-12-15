import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import NotificationsList from '~/modules/notifications/components/NotificationsList.vue'
import NotificationItem from '~/modules/notifications/components/SubComponents/NotificationItem.vue'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'

let observerCallback: IntersectionObserverCallback
let disconnectMock = vi.fn()

beforeEach(() => {
    disconnectMock = vi.fn()

    global.IntersectionObserver = vi.fn((cb: IntersectionObserverCallback) => {
        observerCallback = cb
        return {
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: disconnectMock,
        }
    }) as any
})

afterEach(() => {
    vi.clearAllMocks()
})


const mockNotifications = [
    { id: '1', type: 'like', created_at: '2025-12-10T10:00:00Z' },
    { id: '2', type: 'follow', created_at: '2025-12-10T11:00:00Z' },
] as any[]

vi.mock('~/modules/notifications/components/SubComponents/NotificationItem.vue', () => ({
    default: { template: '<div class="notification-item" />' },
}))

vi.mock('~/modules/Common/components/Loading/LoadingSpinner.vue', () => ({
    default: { template: '<div class="loading-spinner" />' },
}))

const factory = (props = {}) => {
    const fetchNextPage = vi.fn()

    const wrapper = mount(NotificationsList, {
        props: {
            notifications: mockNotifications,
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage,
            ...props,
        },
        global: {
            stubs: {
                NotificationItem: true,
                LoadingSpinner: true,
            },
        },
    })

    return { wrapper, fetchNextPage }
}


describe('NotificationsList', () => {
    it('renders correct number of NotificationItem components', () => {
        const { wrapper } = factory()
        const items = wrapper.findAllComponents(NotificationItem)
        expect(items).toHaveLength(mockNotifications.length)
    })

    it('renders LoadingSpinner when hasNextPage is true', () => {
        const { wrapper } = factory({ hasNextPage: true })
        expect(wrapper.findComponent(LoadingSpinner).exists()).toBe(true)
    })

    it('does not render LoadingSpinner when hasNextPage is false', () => {
        const { wrapper } = factory({ hasNextPage: false })
        expect(wrapper.findComponent(LoadingSpinner).exists()).toBe(false)
    })

    it('calls fetchNextPage when intersecting and hasNextPage is true', async () => {
        const { fetchNextPage } = factory({ hasNextPage: true })

        await nextTick()

        observerCallback([{ isIntersecting: true }] as any, {} as any)

        expect(fetchNextPage).toHaveBeenCalledTimes(1)
    })

    it('does not call fetchNextPage when already fetching next page', async () => {
        const { fetchNextPage } = factory({
            hasNextPage: true,
            isFetchingNextPage: true,
        })

        await nextTick()

        observerCallback([{ isIntersecting: true }] as any, {} as any)

        expect(fetchNextPage).not.toHaveBeenCalled()
    })

    it('does not call fetchNextPage when hasNextPage is false', async () => {
        const { fetchNextPage } = factory({ hasNextPage: false })

        await nextTick()

        observerCallback([{ isIntersecting: true }] as any, {} as any)

        expect(fetchNextPage).not.toHaveBeenCalled()
    })

    it('disconnects observer on unmount', async () => {
        const { wrapper } = factory()

        await nextTick()
        wrapper.unmount()

        expect(disconnectMock).toHaveBeenCalledTimes(1)
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationsView from '~/modules/notifications/views/NotificationsView.vue'
import { ref } from 'vue'

vi.stubGlobal('provide', vi.fn())

const pushMock = vi.fn()
const backMock = vi.fn()
const markSeenMock = vi.fn()

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $notificationsSocketService: {
            markNotificationsAsSeen: markSeenMock,
        },
    }),
    useRuntimeConfig: () => ({
        public: { env: 'test' },
    }),
}))

vi.stubGlobal('useNuxtApp', () => ({
    $notificationsSocketService: {
        markNotificationsAsSeen: markSeenMock,
    },
}))
vi.stubGlobal('useRuntimeConfig', () => ({
    public: { env: 'test' },
}))
vi.stubGlobal('useRouter', () => ({
    push: pushMock,
    back: backMock,
}))
vi.stubGlobal('useRoute', () => ({
    path: '/notifications',
}))

vi.mock('vue-router', async () => {
    const actual = await vi.importActual('vue-router')
    return {
        ...actual,
        useRouter: () => ({
            push: pushMock,
            back: backMock,
        }),
        useRoute: () => ({
            path: '/notifications',
        }),
        onBeforeRouteLeave: vi.fn(),
    }
})

const userStoreState = ref({ isLoggedIn: true })

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => userStoreState.value,
}))

const notifications = ref([{ id: '1' }])
const mentions = ref([{ id: '2' }])
const isLoadingNotifications = ref(false)

vi.mock('~/modules/notifications/queries/useGetNotificationsQuery', () => ({
    useGetNotificationsQuery: () => ({
        notifications,
        isLoadingNotifications,
        isSuccessfullyNotifications: ref(true),
        hasNextNotifications: ref(false),
        isFetchingNextNotifications: ref(false),
        fetchNextNotifications: vi.fn(),
    }),
}))

vi.mock('~/modules/notifications/queries/useGetMentionsQuery', () => ({
    useGetMentionsQuery: () => ({
        mentions,
        isLoadingMentions: ref(false),
        isSuccessfullyMentions: ref(true),
        hasNextMentions: ref(false),
        isFetchingNextMentions: ref(false),
        fetchNextMentions: vi.fn(),
    }),
}))

const TabsStub = {
    template: `
        <div>
            <button id="all-tab" @click="$emit('change', 'all')" />
            <button id="mentions-tab" @click="$emit('change', 'mentions')" />
        </div>
    `,
}

const NotificationsListStub = {
    template: `<div class="notifications-list" />`,
}

const LoadingSpinnerStub = {
    template: `<div class="loading-spinner" />`,
}


const factory = () =>
    mount(NotificationsView, {
        global: {
            mocks: {
                $t: (key: string) => key,
            },
            stubs: {
                Tabs: TabsStub,
                NotificationsList: NotificationsListStub,
                LoadingSpinner: LoadingSpinnerStub,
                ArrowLeft: true,
            },
        },
    })



describe('Notifications Page', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        markSeenMock.mockClear()
        isLoadingNotifications.value = false
        userStoreState.value = { isLoggedIn: true }
    })

    it('renders page title', () => {
        const wrapper = factory()
        expect(wrapper.text()).toContain('notifications')
    })

    it('renders NotificationsList by default', () => {
        const wrapper = factory()
        expect(wrapper.find('.notifications-list').exists()).toBe(true)
    })

    it('switches to mentions tab', async () => {
        const wrapper = factory()
        await wrapper.find('#mentions-tab').trigger('click')
        expect(wrapper.find('.notifications-list').exists()).toBe(true)
    })

    it('shows loading spinner when loading', () => {
        isLoadingNotifications.value = true
        const wrapper = factory()
        expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    })

    it('redirects to auth if user is not logged in', () => {
        userStoreState.value = { isLoggedIn: false }
        factory()
        expect(pushMock).toHaveBeenCalledWith('/auth')
    })

    it('marks notifications as seen on mount', () => {
        factory()
        expect(markSeenMock).toHaveBeenCalled()
    })

    it('back button triggers router.back()', async () => {
        const wrapper = factory()
        await wrapper.find('#btn-back-bookmarks').trigger('click')
        expect(backMock).toHaveBeenCalled()
    })

    it('does not crash on outside click', () => {
        factory()
        document.dispatchEvent(new MouseEvent('click'))
        expect(true).toBe(true)
    })
})

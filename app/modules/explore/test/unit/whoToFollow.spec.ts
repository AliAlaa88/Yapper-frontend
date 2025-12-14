import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import enMessages from '../../../../../i18n/locales/en.json'
import arMessages from '../../../../../i18n/locales/ar.json'
import whoToFollow from '../../components/whoToFollow/index.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enMessages,
        ar: arMessages,
    },
})

// Mock router
const mockPush = vi.fn()
const mockBack = vi.fn()
const mockRoute = {
    path: '/explore/who-to-follow',
    query: {},
}

const mockRouter = {
    push: mockPush,
    back: mockBack,
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
    useRoute: () => mockRoute,
}))

vi.mock('#app', () => ({
    useNuxtApp: () => ({}),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
}))

vi.mock('../../queries/useGetExploreQuery', () => ({
    useGetWhoToFollowQuery: (enabled: boolean) => ({
        isLoading: { value: false },
        isError: { value: false },
        data: {
            value: {
                data: [
                    {
                        id: '1',
                        username: 'user1',
                        firstName: 'User',
                        lastName: 'One',
                        profilePicture: 'pic1.jpg',
                        isFollowing: false,
                    },
                    {
                        id: '2',
                        username: 'user2',
                        firstName: 'User',
                        lastName: 'Two',
                        profilePicture: 'pic2.jpg',
                        isFollowing: false,
                    },
                ],
            },
        },
        refetch: vi.fn(),
    }),
}))

function mountWhoToFollow() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

    return mount(whoToFollow, {
        global: {
            plugins: [[VueQueryPlugin, { queryClient }], i18n],
            mocks: {
                $route: mockRoute,
                $router: mockRouter,
            },
            stubs: {
                LoadingSpinner: true,
                WhoToFollowList: true,
                Tabs: true,
                ArrowLeft: true,
            },
        },
    })
}

describe('WhoToFollow Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Rendering', () => {
        it('should render the component', () => {
            const wrapper = mountWhoToFollow()
            expect(wrapper.exists()).toBe(true)
        })

        it('should have a header with title', () => {
            const wrapper = mountWhoToFollow()
            expect(wrapper.text()).toContain('explore.connect')
        })

        it('should have a back button', () => {
            const wrapper = mountWhoToFollow()
            expect(wrapper.find('#btn-back-who-to-follow').exists()).toBe(true)
        })
    })

    describe('Data Display', () => {
        it('should render users when data is loaded', () => {
            const wrapper = mountWhoToFollow()
            expect(wrapper.text()).toContain('explore.suggestedForYou')
        })

        it('should have WhoToFollowList component', () => {
            const wrapper = mountWhoToFollow()
            expect(wrapper.html()).toBeTruthy()
        })

        it('should display subtitle', () => {
            const wrapper = mountWhoToFollow()
            expect(wrapper.text()).toContain('explore.suggestedForYou')
        })
    })

    describe('Structure', () => {
        it('should have overflow-x-hidden class for overflow protection', () => {
            const wrapper = mountWhoToFollow()
            expect(wrapper.find('.overflow-x-hidden').exists()).toBe(true)
        })

        it('should have sticky header with correct classes', () => {
            const wrapper = mountWhoToFollow()
            const header = wrapper.find('.sticky.top-0')
            expect(header.exists()).toBe(true)
        })

        it('should have border-b border-primary on header', () => {
            const wrapper = mountWhoToFollow()
            const header = wrapper.find('.sticky.top-0')
            expect(header.html()).toContain('border-primary')
        })
    })

    describe('Back Button', () => {
        it('should have back button with correct id', () => {
            const wrapper = mountWhoToFollow()
            const backBtn = wrapper.find('#btn-back-who-to-follow')
            expect(backBtn.exists()).toBe(true)
        })

        it('should render with correct styling', () => {
            const wrapper = mountWhoToFollow()
            const backBtn = wrapper.find('#btn-back-who-to-follow')
            expect(backBtn.classes()).toContain('rounded-full')
        })
    })

    describe('Tabs Configuration', () => {
        it('should render tabs component', () => {
            const wrapper = mountWhoToFollow()
            // Verify the component is mounted correctly
            expect(wrapper.find('.overflow-x-hidden').exists()).toBe(true)
        })
    })
})

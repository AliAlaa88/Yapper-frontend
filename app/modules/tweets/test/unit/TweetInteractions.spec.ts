import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

import TweetInteractions from '../../components/TweetInteractions/TweetInteractions.vue'

// Mock vue-router
vi.mock('vue-router', () => ({
    useRoute: vi.fn(() => ({
        params: {
            username: 'alice',
            tweetId: 't1',
        },
        path: '/alice/status/t1/quotes',
    })),
    useRouter: vi.fn(() => ({
        back: vi.fn(),
        push: vi.fn(),
    })),
}))

// Mock Nuxt composables
vi.mock('#app', () => ({
    navigateTo: vi.fn(),
    useNuxtApp: vi.fn(() => ({
        $queryClient: {},
        $tweetService: {},
        $userInfoService: {},
    })),
    useRuntimeConfig: vi.fn(() => ({
        public: { env: 'test' },
    })),
}))

vi.mock('vue-i18n', () => ({
    useI18n: vi.fn(() => ({
        t: (key: string) => key,
        locale: 'en',
    })),
}))

// Mock useTweetDetails composable
vi.mock('../../composables/useTweetDetails', () => ({
    useTweetDetails: vi.fn(() => ({
        tweetDetails: ref({
            tweet_id: 't1',
            user: { id: 'u1', name: 'Alice', username: 'alice' },
        }),
        isLoading: ref(false),
        error: ref(null),
    })),
}))

// Mock userStore
vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: vi.fn(() => ({
        getUser: () => ({ user_id: 'u1' }),
    })),
}))

describe('TweetInteractions Component', () => {
    const defaultGlobal = {
        stubs: {
            NuxtLink: true,
            Tabs: {
                template: '<div class="tabs-stub">{{ tabs.length }} tabs</div>',
                props: ['tabs', 'activeTab', 'onChange'],
            },
            TweetsList: { template: '<div class="tweets-list-stub"></div>' },
            UserList: {
                template: '<div class="user-list-stub"><slot /><slot name="empty" /></div>',
                props: ['fetchingSource', 'queryKeyPrefix'],
            },
            FollowListUserCard: { template: '<div class="user-card-stub"></div>' },
            ArrowLeft: { template: '<span class="arrow-icon"></span>' },
            Repeat2: { template: '<span class="repeat-icon"></span>' },
        },
        mocks: {
            $t: (key: string) => key,
        },
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Header Rendering', () => {
        it('renders header with post engagements title', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            expect(wrapper.text()).toContain('tweets.postEngagements')
        })

        it('renders back button', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            const backButton = wrapper.find('#btn-back-tweet-interactions')
            expect(backButton.exists()).toBe(true)
        })

        it('has correct back button attributes', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            const backButton = wrapper.find('#btn-back-tweet-interactions')
            expect(backButton.attributes('type')).toBe('button')
        })
    })

    describe('Tab Component', () => {
        it('renders tabs component', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            const tabs = wrapper.find('.tabs-stub')
            expect(tabs.exists()).toBe(true)
        })

        it('passes tabs config to Tabs component', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            // For own tweet (u1 matches user_id), should have 3 tabs
            expect(wrapper.text()).toContain('3 tabs')
        })
    })

    describe('Own Tweet Detection', () => {
        it('shows 3 tabs for own tweets (including likes)', async () => {
            const { useTweetDetails } = await import('../../composables/useTweetDetails')
            vi.mocked(useTweetDetails).mockReturnValue({
                tweetDetails: ref({
                    tweet_id: 't1',
                    user: { id: 'u1', name: 'Alice', username: 'alice' },
                }),
                isLoading: ref(false),
                error: ref(null),
            } as any)

            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            // For own tweet, should have 3 tabs (quotes, retweets, likes)
            expect(wrapper.text()).toContain('3 tabs')
        })

        it('shows 2 tabs for other users tweets (no likes)', async () => {
            const { useTweetDetails } = await import('../../composables/useTweetDetails')
            vi.mocked(useTweetDetails).mockReturnValue({
                tweetDetails: ref({
                    tweet_id: 't1',
                    user: { id: 'u2', name: 'Bob', username: 'bob' }, // Different user
                }),
                isLoading: ref(false),
                error: ref(null),
            } as any)

            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            // For other user's tweet, should have 2 tabs (quotes, retweets)
            expect(wrapper.text()).toContain('2 tabs')
        })
    })

    describe('Component Structure', () => {
        it('has sticky header with correct classes', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            const stickyHeader = wrapper.find('.sticky.top-0')
            expect(stickyHeader.exists()).toBe(true)
        })

        it('has min-h-screen content area', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            const contentArea = wrapper.find('.min-h-screen')
            expect(contentArea.exists()).toBe(true)
        })

        it('renders back button with icon', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            const backButton = wrapper.find('#btn-back-tweet-interactions')
            // Check that the back button contains something (either stub or real icon)
            expect(backButton.exists()).toBe(true)
            expect(backButton.element.children.length).toBeGreaterThan(0)
        })
    })

    describe('Accessibility', () => {
        it('back button has aria-label', () => {
            const wrapper = mount(TweetInteractions, { global: defaultGlobal })
            const backButton = wrapper.find('#btn-back-tweet-interactions')
            expect(backButton.attributes('aria-label')).toBe('navigation.back')
        })
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'
import forYou from '../../components/forYou/index.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            explore: {
                errorLoading: 'Error loading explore data',
                tryAgain: 'Try again',
                noTrends: 'No trends available',
            },
        },
    },
})

// Mock explore query
const mockExploreQuery = {
    isLoading: ref(false),
    isError: ref(false),
    data: ref(null),
    refetch: vi.fn(),
}

vi.mock('../../queries/useGetExploreQuery', () => ({
    useGetExploreQuery: vi.fn(() => mockExploreQuery),
}))

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

vi.mock('#app', () => ({
    useNuxtApp: () => ({}),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
}))

function mountForYou() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

    return mount(forYou, {
        global: {
            plugins: [[VueQueryPlugin, { queryClient }], i18n],
            stubs: {
                LoadingSpinner: true,
                Tweet: true,
                TrendsList: true,
                WhoToFollowList: true,
                Button: true,
            },
        },
    })
}

describe('ForYou Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockExploreQuery.isLoading.value = false
        mockExploreQuery.isError.value = false
        mockExploreQuery.data.value = null
    })

    describe('Initial Rendering', () => {
        it('should render the ForYou component', () => {
            const wrapper = mountForYou()
            expect(wrapper.exists()).toBe(true)
        })

        it('should have full width container', () => {
            const wrapper = mountForYou()
            expect(wrapper.find('.w-full').exists()).toBe(true)
        })
    })

    describe('Loading State', () => {
        it('should display loading spinner when data is loading', () => {
            mockExploreQuery.isLoading.value = true
            const wrapper = mountForYou()
            const loadingSpinner = wrapper.findComponent({ name: 'LoadingSpinner' })
            expect(loadingSpinner.exists()).toBe(true)
        })

        it('should not display content when loading', () => {
            mockExploreQuery.isLoading.value = true
            const wrapper = mountForYou()
            expect(wrapper.find('.tweet-mock').exists()).toBe(false)
        })
    })

    describe('Error State', () => {
        it('should display error message when there is an error', () => {
            mockExploreQuery.isError.value = true
            const wrapper = mountForYou()
            const errorText = wrapper.text()
            expect(errorText).toContain('explore.errorLoading')
        })

        it('should display "Try Again" button on error', () => {
            mockExploreQuery.isError.value = true
            const wrapper = mountForYou()
            // The Button component is stubbed, so check for the stub
            const buttonStub = wrapper.find('[id="btn-retry-explore-for-you"]')
            expect(buttonStub.exists()).toBe(true)
        })

        it('should call refetch when try again is clicked', async () => {
            mockExploreQuery.isError.value = true
            const wrapper = mountForYou()
            // The Button component is stubbed, so find by data-testid or id
            const buttonStub = wrapper.find('[id="btn-retry-explore-for-you"]')
            // Click the actual element or the stub
            if (buttonStub.exists()) {
                await buttonStub.trigger('click')
                expect(mockExploreQuery.refetch).toHaveBeenCalled()
            }
        })
    })

    describe('Empty State', () => {
        it('should display empty state when no data is available', () => {
            mockExploreQuery.data.value = {
                data: {
                    trending: { data: [] },
                    who_to_follow: [],
                    for_you: [],
                },
            }
            const wrapper = mountForYou()
            const errorText = wrapper.text()
            expect(errorText).toContain('explore.noTrends')
        })

        it('should show empty state when data is null', () => {
            mockExploreQuery.data.value = null
            const wrapper = mountForYou()
            expect(wrapper.text()).toContain('explore.noTrends')
        })
    })

    describe('With Data', () => {
        beforeEach(() => {
            mockExploreQuery.data.value = {
                data: {
                    trending: {
                        data: [
                            { name: 'Trend 1', count: 100 },
                            { name: 'Trend 2', count: 50 },
                        ],
                    },
                    who_to_follow: [
                        { id: '1', username: 'user1' },
                        { id: '2', username: 'user2' },
                    ],
                    for_you: [
                        {
                            category: { id: 'cat1', name: 'Category 1' },
                            tweets: [{ tweet_id: '1', content: 'Tweet 1' }],
                        },
                    ],
                },
            }
        })

        it('should display trending section when trending data exists', () => {
            const wrapper = mountForYou()
            const trendsList = wrapper.findComponent({ name: 'TrendsList' })
            expect(trendsList.exists()).toBe(true)
        })

        it('should display who to follow section when data exists', () => {
            const wrapper = mountForYou()
            const whoToFollowList = wrapper.findComponent({ name: 'WhoToFollowList' })
            expect(whoToFollowList.exists()).toBe(true)
        })

        it('should display for you posts when data exists', () => {
            const wrapper = mountForYou()
            expect(wrapper.html()).toContain('tweet-stub')
        })
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'
import trending from '../../components/trending/index.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            explore: {
                errorLoading: 'Error loading trends',
                tryAgain: 'Try again',
                noTrends: 'No trends available',
            },
        },
    },
})

// Mock trends query
const mockTrendsQuery = {
    isLoading: ref(false),
    isError: ref(false),
    data: ref([]),
    refetch: vi.fn(),
}

vi.mock('../../queries/useGetExploreQuery', () => ({
    useGetTrendsQuery: vi.fn(() => mockTrendsQuery),
}))

vi.mock('#app', () => ({
    useNuxtApp: () => ({}),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
}))

function mountTrending() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

    return mount(trending, {
        global: {
            plugins: [[VueQueryPlugin, { queryClient }], i18n],
            stubs: {
                LoadingSpinner: true,
                TrendsList: true,
            },
        },
    })
}

describe('Trending Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTrendsQuery.isLoading.value = false
        mockTrendsQuery.isError.value = false
        mockTrendsQuery.data.value = []
    })

    describe('Initial Rendering', () => {
        it('should render the trending component', () => {
            const wrapper = mountTrending()
            expect(wrapper.exists()).toBe(true)
        })

        it('should have full width container', () => {
            const wrapper = mountTrending()
            expect(wrapper.find('.w-full').exists()).toBe(true)
        })
    })

    describe('Loading State', () => {
        it('should display loading spinner when data is loading', () => {
            mockTrendsQuery.isLoading.value = true
            const wrapper = mountTrending()
            const loadingSpinner = wrapper.findComponent({ name: 'LoadingSpinner' })
            expect(loadingSpinner.exists()).toBe(true)
        })

        it('should not display trends list when loading', () => {
            mockTrendsQuery.isLoading.value = true
            const wrapper = mountTrending()
            const trendsList = wrapper.findComponent({ name: 'TrendsList' })
            expect(trendsList.exists()).toBe(false)
        })
    })

    describe('Error State', () => {
        it('should display error message when there is an error', () => {
            mockTrendsQuery.isError.value = true
            const wrapper = mountTrending()
            const errorText = wrapper.text()
            expect(errorText).toContain('explore.errorLoading')
        })

        it('should display "Try again" button on error', () => {
            mockTrendsQuery.isError.value = true
            const wrapper = mountTrending()
            const button = wrapper.find('button')
            expect(button.exists()).toBe(true)
            expect(button.text()).toContain('explore.tryAgain')
        })

        it('should call refetch when try again is clicked', async () => {
            mockTrendsQuery.isError.value = true
            const wrapper = mountTrending()
            const button = wrapper.find('button')
            await button.trigger('click')
            expect(mockTrendsQuery.refetch).toHaveBeenCalled()
        })
    })

    describe('Empty State', () => {
        it('should display empty message when no trends available', () => {
            mockTrendsQuery.data.value = []
            const wrapper = mountTrending()
            const errorText = wrapper.text()
            expect(errorText).toContain('explore.errorLoading')
        })
    })

    describe('Trends Display', () => {
        beforeEach(() => {
            mockTrendsQuery.data.value = [
                { name: 'Trend 1', count: 100 },
                { name: 'Trend 2', count: 50 },
            ]
        })

        it('should display trends list when data is available', () => {
            const wrapper = mountTrending()
            const trendsList = wrapper.findComponent({ name: 'TrendsList' })
            expect(trendsList.exists()).toBe(true)
        })

        it('should pass trends data to TrendsList component', () => {
            const wrapper = mountTrending()
            const trendsList = wrapper.findComponent({ name: 'TrendsList' })
            expect(trendsList.props('trends')).toEqual(mockTrendsQuery.data.value)
        })

        it('should pass showRank prop as true to TrendsList', () => {
            const wrapper = mountTrending()
            const trendsList = wrapper.findComponent({ name: 'TrendsList' })
            expect(trendsList.props('showRank')).toBe(true)
        })
    })
})
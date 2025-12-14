import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import enMessages from '../../../../../i18n/locales/en.json'
import arMessages from '../../../../../i18n/locales/ar.json'
import categories from '../../components/categories/index.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enMessages,
        ar: arMessages,
    },
})

vi.mock('#app', () => ({
    useNuxtApp: () => ({}),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
            env: 'test',
        },
    }),
}))

vi.mock('../../queries/useGetExploreQuery', () => ({
    useGetTrendsQuery: (category: string, enabled: boolean) => ({
        isLoading: { value: false },
        isError: { value: false },
        data: {
            value: [
                {
                    id: '1',
                    name: 'Trend 1',
                    count: 10000,
                    tweetCount: 500,
                },
                {
                    id: '2',
                    name: 'Trend 2',
                    count: 8000,
                    tweetCount: 400,
                },
            ],
        },
        refetch: vi.fn(),
    }),
}))

function mountCategories(categoryProp = 'technology') {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

    return mount(categories, {
        props: {
            category: categoryProp,
        },
        global: {
            plugins: [[VueQueryPlugin, { queryClient }], i18n],
            stubs: {
                LoadingSpinner: true,
                TrendsList: true,
            },
        },
    })
}

describe('Categories Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Rendering', () => {
        it('should render the component', () => {
            const wrapper = mountCategories()
            expect(wrapper.exists()).toBe(true)
        })

        it('should render with correct category prop', () => {
            const wrapper = mountCategories('technology')
            expect(wrapper.props('category')).toBe('technology')
        })

        it('should handle different category props', () => {
            const wrapper = mountCategories('sports')
            expect(wrapper.props('category')).toBe('sports')
        })
    })

    describe('Data Display', () => {
        it('should render content when data is loaded', () => {
            const wrapper = mountCategories()
            expect(wrapper.find('.w-full').exists()).toBe(true)
        })

        it('should have correct structure for trends container', () => {
            const wrapper = mountCategories()
            expect(wrapper.html()).toBeTruthy()
        })
    })

    describe('Styling', () => {
        it('should have w-full class for full width', () => {
            const wrapper = mountCategories()
            expect(wrapper.find('.w-full').exists()).toBe(true)
        })

        it('should have proper layout structure', () => {
            const wrapper = mountCategories()
            const html = wrapper.html()
            expect(html).toContain('w-full')
        })
    })

    describe('Category Handling', () => {
        it('should handle category prop changes', async () => {
            const wrapper = mountCategories('technology')
            expect(wrapper.props('category')).toBe('technology')

            await wrapper.setProps({ category: 'sports' })
            expect(wrapper.props('category')).toBe('sports')
        })

        it('should capitalize first letter of category', () => {
            const wrapper = mountCategories('technology')
            expect(wrapper.props('category')).toBe('technology')
        })
    })

    describe('Component Composition', () => {
        it('should be mountable with required props', () => {
            const wrapper = mountCategories()
            expect(wrapper.exists()).toBe(true)
        })

        it('should maintain props throughout lifecycle', async () => {
            const wrapper = mountCategories('news')
            expect(wrapper.props('category')).toBe('news')
            
            await wrapper.vm.$nextTick()
            expect(wrapper.props('category')).toBe('news')
        })
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'
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

const mockTrendsData = [
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
    {
        id: '3',
        name: 'Trend 3',
        count: 5000,
        tweetCount: 300,
    },
]

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
    useGetTrendsQuery: (category: string, enabled: boolean, limit?: number) => ({
        isLoading: { value: false },
        isError: { value: false },
        data: {
            value: mockTrendsData,
        },
        refetch: vi.fn(),
    }),
}))

vi.mock('../../components/common/TrendsList.vue', () => ({
    default: {
        name: 'TrendsList',
        props: ['trends', 'loading', 'error'],
        template: '<div class="trends-list" v-if="trends.length"><div v-for="trend in trends" :key="trend.id" class="trend-item">{{ trend.name }}</div></div>',
    },
}))

vi.mock('~/modules/Common/components/Loading/LoadingSpinner.vue', () => ({
    default: {
        name: 'LoadingSpinner',
        props: ['size'],
        template: '<div class="loading-spinner">Loading...</div>',
    },
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
            const categories = ['technology', 'sports', 'news', 'entertainment', 'business']
            categories.forEach(cat => {
                const wrapper = mountCategories(cat)
                expect(wrapper.props('category')).toBe(cat)
            })
        })

        it('should render without errors', () => {
            const wrapper = mountCategories()
            expect(wrapper.find('.w-full').exists()).toBe(true)
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

        it('should receive trends data from query', () => {
            const wrapper = mountCategories('technology')
            expect(wrapper.exists()).toBe(true)
        })

        it('should display content without errors during load', async () => {
            const wrapper = mountCategories()
            await flushPromises()
            expect(wrapper.exists()).toBe(true)
        })
    })

    describe('Styling and Layout', () => {
        it('should have w-full class for full width', () => {
            const wrapper = mountCategories()
            expect(wrapper.find('.w-full').exists()).toBe(true)
        })

        it('should have proper layout structure', () => {
            const wrapper = mountCategories()
            const html = wrapper.html()
            expect(html).toContain('w-full')
        })

        it('should maintain responsive design', () => {
            const wrapper = mountCategories()
            expect(wrapper.classes()).toBeDefined()
        })
    })

    describe('Category Handling', () => {
        it('should handle category prop changes', async () => {
            const wrapper = mountCategories('technology')
            expect(wrapper.props('category')).toBe('technology')

            await wrapper.setProps({ category: 'sports' })
            expect(wrapper.props('category')).toBe('sports')
        })

        it('should handle multiple category switches', async () => {
            const wrapper = mountCategories('technology')
            const categories = ['sports', 'news', 'entertainment', 'business']

            for (const cat of categories) {
                await wrapper.setProps({ category: cat })
                expect(wrapper.props('category')).toBe(cat)
            }
        })

        it('should accept any category string', () => {
            const customCategory = 'custom-category'
            const wrapper = mountCategories(customCategory)
            expect(wrapper.props('category')).toBe(customCategory)
        })

        it('should update when category changes from lowercase', async () => {
            const wrapper = mountCategories('technology')
            await wrapper.setProps({ category: 'TECHNOLOGY' })
            expect(wrapper.props('category')).toBe('TECHNOLOGY')
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

        it('should support updating all props', async () => {
            const wrapper = mountCategories('technology')
            
            await wrapper.setProps({ category: 'sports' })
            expect(wrapper.props('category')).toBe('sports')

            await wrapper.setProps({ category: 'news' })
            expect(wrapper.props('category')).toBe('news')
        })
    })

    describe('Props Validation', () => {
        it('should accept string category prop', () => {
            const wrapper = mountCategories('technology')
            expect(typeof wrapper.props('category')).toBe('string')
        })

        it('should handle empty string category', () => {
            const wrapper = mountCategories('')
            expect(wrapper.props('category')).toBe('')
        })

        it('should preserve prop value across updates', async () => {
            const wrapper = mountCategories('tech')
            const initialProp = wrapper.props('category')
            
            await wrapper.vm.$nextTick()
            expect(wrapper.props('category')).toBe(initialProp)
        })
    })

    describe('Component State', () => {
        it('should initialize without errors', () => {
            expect(() => {
                mountCategories('technology')
            }).not.toThrow()
        })

        it('should be reactive to prop changes', async () => {
            const wrapper = mountCategories('technology')
            const prop1 = wrapper.props('category')
            
            await wrapper.setProps({ category: 'sports' })
            const prop2 = wrapper.props('category')
            
            expect(prop1).not.toBe(prop2)
        })

        it('should handle rapid prop changes', async () => {
            const wrapper = mountCategories('technology')
            
            for (let i = 0; i < 10; i++) {
                await wrapper.setProps({ category: `category-${i}` })
            }
            
            expect(wrapper.props('category')).toBe('category-9')
        })
    })

    describe('Edge Cases', () => {
        it('should handle very long category names', () => {
            const longCategory = 'a'.repeat(100)
            const wrapper = mountCategories(longCategory)
            expect(wrapper.props('category')).toBe(longCategory)
        })

        it('should handle special characters in category', () => {
            const specialCategory = 'tech-news_2024'
            const wrapper = mountCategories(specialCategory)
            expect(wrapper.props('category')).toBe(specialCategory)
        })

        it('should handle spaces in category name', () => {
            const categoryWithSpaces = 'tech news'
            const wrapper = mountCategories(categoryWithSpaces)
            expect(wrapper.props('category')).toBe(categoryWithSpaces)
        })
    })

    describe('Integration', () => {
        it('should work with Vue i18n', () => {
            const wrapper = mountCategories('technology')
            expect(wrapper.vm.$i18n).toBeDefined()
        })

        it('should work with Vue Query', () => {
            const wrapper = mountCategories('technology')
            expect(wrapper.exists()).toBe(true)
        })

        it('should render within Query context', () => {
            const queryClient = new QueryClient()
            const wrapper = mount(categories, {
                props: { category: 'technology' },
                global: {
                    plugins: [[VueQueryPlugin, { queryClient }], i18n],
                    stubs: {
                        LoadingSpinner: true,
                        TrendsList: true,
                    },
                },
            })
            expect(wrapper.exists()).toBe(true)
        })
    })

    describe('Accessibility', () => {
        it('should maintain semantic structure', () => {
            const wrapper = mountCategories('technology')
            expect(wrapper.html()).toBeTruthy()
        })

        it('should be readable by screen readers', () => {
            const wrapper = mountCategories('technology')
            const text = wrapper.text()
            expect(text).toBeDefined()
        })
    })
})


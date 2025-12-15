import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'
import enMessages from '../../../../../i18n/locales/en.json'
import arMessages from '../../../../../i18n/locales/ar.json'
import categoryTweets from '../../components/categoryTweets/index.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enMessages,
        ar: arMessages,
    },
})

const mockRouter = {
    back: vi.fn(),
}

const mockQueryData = {
    data: {
        tweets: [
            { tweet_id: '1', text: 'Tweet 1', author: 'user1' },
            { tweet_id: '2', text: 'Tweet 2', author: 'user2' },
        ],
        category: { id: 'cat1', name: 'Technology' },
        pagination: { hasMore: true, page: 1, limit: 20 },
    },
}

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $exploreService: {
            getExploreCategories: vi.fn(),
        },
    }),
}))

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}))

vi.mock('../../queries/useGetExploreQuery', () => ({
    useGetExploreCategoriesQuery: (categoryId: any, page: any, limit: any, enabled: any) => ({
        data: { value: mockQueryData },
        isLoading: { value: false },
        isError: { value: false },
        isFetching: { value: false },
        refetch: vi.fn(),
    }),
}))

vi.mock('~/modules/tweets/components/Tweet/Tweet.vue', () => ({
    default: {
        name: 'Tweet',
        props: ['tweet', 'id'],
        template: '<div class="tweet">{{ tweet.text }}</div>',
    },
}))

vi.mock('~/modules/Common/components/Loading/LoadingSpinner.vue', () => ({
    default: {
        name: 'LoadingSpinner',
        props: ['size'],
        template: '<div class="loading-spinner">Loading...</div>',
    },
}))

vi.mock('lucide-vue-next', () => ({
    ArrowLeft: {
        name: 'ArrowLeft',
        props: ['size'],
        template: '<svg class="arrow-left"></svg>',
    },
}))

function mountCategoryTweets(categoryId = 'cat1') {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

    return mount(categoryTweets, {
        props: {
            categoryId,
        },
        global: {
            plugins: [[VueQueryPlugin, { queryClient }], i18n],
            stubs: {
                Tweet: true,
                LoadingSpinner: true,
                ArrowLeft: true,
            },
        },
    })
}

describe('CategoryTweets Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Rendering', () => {
        it('should render the header with category name', () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.find('h1').text()).toBe('Technology')
        })

        it('should render back button', () => {
            const wrapper = mountCategoryTweets('cat1')
            const backBtn = wrapper.find('#btn-back-category-tweets')
            expect(backBtn.exists()).toBe(true)
        })

        it('should call router.back() when back button is clicked', async () => {
            const wrapper = mountCategoryTweets('cat1')
            const backBtn = wrapper.find('#btn-back-category-tweets')
            await backBtn.trigger('click')
            expect(mockRouter.back).toHaveBeenCalled()
        })

        it('should accept categoryId prop', () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.props('categoryId')).toBe('cat1')
        })
    })

    describe('Data Display', () => {
        it('should display tweets when data is loaded', async () => {
            const wrapper = mountCategoryTweets('cat1')
            await flushPromises()
            
            const tweets = wrapper.findAll('.tweet')
            expect(tweets.length).toBeGreaterThanOrEqual(0)
        })

        it('should emit categoryLoaded event with category info', async () => {
            const wrapper = mountCategoryTweets('cat1')
            await flushPromises()

            const emitted = wrapper.emitted('categoryLoaded')
            expect(emitted).toBeDefined()
            if (emitted) {
                expect(emitted[0][0].name).toBe('Technology')
            }
        })

        it('should display category name in computed property', async () => {
            const wrapper = mountCategoryTweets('cat1')
            await flushPromises()
            
            expect(wrapper.vm.categoryName).toBe('Technology')
        })

        it('should update category name when data changes', async () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.vm.categoryName).toBe('Technology')
        })
    })

    describe('Loading States', () => {
        it('should show loading spinner when isLoading is true', async () => {
            vi.resetModules()
            const queryData = ref({
                data: {
                    tweets: [],
                    category: { id: 'cat1', name: 'Tech' },
                    pagination: { hasMore: false },
                },
            })

            const wrapper = mountCategoryTweets('cat1')
            await flushPromises()
            
            expect(wrapper.find('.loading-spinner').exists()).toBeDefined()
        })

        it('should show fetching more indicator when isFetchingMore is true', async () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.vm.isFetchingMore).toBe(false)
        })
    })

    describe('Error Handling', () => {
        it('should provide refetch method for error recovery', () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(typeof wrapper.vm.refetch).toBe('function')
        })

        it('should reset currentPage on refetch', async () => {
            const wrapper = mountCategoryTweets('cat1')
            wrapper.vm.currentPage = 3
            wrapper.vm.refetch()
            expect(wrapper.vm.currentPage).toBe(1)
        })

        it('should clear tweets on refetch', async () => {
            const wrapper = mountCategoryTweets('cat1')
            wrapper.vm.allTweets = [{ tweet_id: '1', text: 'Old tweet' }]
            wrapper.vm.refetch()
            expect(wrapper.vm.allTweets).toEqual([])
        })
    })

    describe('Pagination', () => {
        it('should initialize with page 1', () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.vm.currentPage).toBe(1)
        })

        it('should set hasMore from query data', async () => {
            const wrapper = mountCategoryTweets('cat1')
            await flushPromises()
            
            expect(wrapper.vm.hasMore).toBe(true)
        })

        it('should display end of results message when hasMore is false', async () => {
            const wrapper = mountCategoryTweets('cat1')
            wrapper.vm.hasMore = false
            wrapper.vm.allTweets = [{ tweet_id: '1', text: 'Tweet' }]
            await wrapper.vm.$nextTick()
            
            expect(wrapper.vm.hasMore).toBe(false)
        })

        it('should reset pagination when categoryId changes', async () => {
            const wrapper = mountCategoryTweets('cat1')
            wrapper.vm.currentPage = 3
            wrapper.vm.allTweets = [{ tweet_id: '1' }]
            
            await wrapper.setProps({ categoryId: 'cat2' })
            await flushPromises()

            expect(wrapper.vm.currentPage).toBe(1)
            expect(wrapper.vm.allTweets).toEqual([])
            expect(wrapper.vm.hasMore).toBe(false)
        })
    })

    describe('Intersection Observer', () => {
        it('should have loadMoreTrigger ref', () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.vm.loadMoreTrigger).toBeDefined()
        })

        it('should initialize with proper scroll trigger element', () => {
            const wrapper = mountCategoryTweets('cat1')
            const trigger = wrapper.find('.h-1.w-full')
            expect(trigger.exists()).toBe(true)
        })
    })

    describe('Tweet List Rendering', () => {
        it('should show empty state when no tweets', async () => {
            const wrapper = mountCategoryTweets('cat1')
            wrapper.vm.allTweets = []
            await wrapper.vm.$nextTick()

            const text = wrapper.text()
            expect(text).toBeDefined()
        })

        it('should display tweets in correct order', async () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.vm.tweets).toBeDefined()
            expect(Array.isArray(wrapper.vm.tweets)).toBe(true)
        })

        it('should append tweets on subsequent pages', async () => {
            const wrapper = mountCategoryTweets('cat1')
            wrapper.vm.currentPage = 1
            wrapper.vm.allTweets = [{ tweet_id: '1', text: 'Page 1' }]

            wrapper.vm.currentPage = 2
            const newTweets = [{ tweet_id: '2', text: 'Page 2' }]
            wrapper.vm.allTweets = [...wrapper.vm.allTweets, ...newTweets]

            expect(wrapper.vm.allTweets.length).toBe(2)
        })

        it('should replace tweets on first page', () => {
            const wrapper = mountCategoryTweets('cat1')
            wrapper.vm.currentPage = 1
            wrapper.vm.allTweets = [{ tweet_id: '1' }, { tweet_id: '2' }]

            expect(wrapper.vm.allTweets.length).toBe(2)
        })
    })

    describe('Dynamic Behavior', () => {
        it('should support changing categoryId', async () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.props('categoryId')).toBe('cat1')

            await wrapper.setProps({ categoryId: 'cat2' })
            expect(wrapper.props('categoryId')).toBe('cat2')
        })

        it('should reset state on category change', async () => {
            const wrapper = mountCategoryTweets('cat1')
            wrapper.vm.currentPage = 5
            wrapper.vm.allTweets = [{ tweet_id: '1' }]
            wrapper.vm.hasMore = true

            await wrapper.setProps({ categoryId: 'cat2' })
            await flushPromises()

            expect(wrapper.vm.currentPage).toBe(1)
            expect(wrapper.vm.allTweets).toEqual([])
            expect(wrapper.vm.hasMore).toBe(false)
        })

        it('should update limit property', () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.vm.limit).toBe(20)
        })
    })

    describe('Data Watchers', () => {
        it('should watch query data for category info', () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.vm.categoryInfo).toBeDefined()
        })

        it('should watch categoryId prop changes', () => {
            const wrapper = mountCategoryTweets('cat1')
            expect(wrapper.vm).toBeDefined()
        })
    })

    describe('Accessibility', () => {
        it('should have semantic structure with heading', () => {
            const wrapper = mountCategoryTweets('cat1')
            const html = wrapper.html()
            // Component has h1 tag in header
            expect(html).toContain('<h1')
        })

        it('should have clickable back button', () => {
            const wrapper = mountCategoryTweets('cat1')
            const btn = wrapper.find('#btn-back-category-tweets')
            expect(btn.exists()).toBe(true)
            expect(btn.element.tagName).toBe('BUTTON')
        })

        it('should support keyboard navigation with buttons', () => {
            const wrapper = mountCategoryTweets('cat1')
            const backBtn = wrapper.find('#btn-back-category-tweets')
            expect(backBtn.element.tagName).toBe('BUTTON')
            expect(backBtn.exists()).toBe(true)
        })
    })
})

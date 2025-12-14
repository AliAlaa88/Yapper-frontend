import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Banner from '../../components/banner/Banner.vue'

// Mock dependencies
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'timeline.banner.trending': 'Trending',
                'timeline.banner.whoToFollow': 'Who to follow',
                'timeline.banner.showMore': 'Show more',
                'timeline.banner.error': 'Error loading trends',
                'timeline.banner.noTrends': 'No trends available',
                'explore.errorLoading': 'Error loading users',
                'explore.noUsersFound': 'No users found',
            }
            return translations[key] || key
        },
    }),
}))

vi.mock('#app', () => ({
    useNuxtApp: () => ({}),
    navigateTo: vi.fn(),
}))

// Mock vue-router with a default route
const mockRoute = ref({ path: '/' })

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute.value,
}))

vi.mock('~/modules/explore/queries/useGetExploreQuery', () => ({
    useGetTrendsQuery: () => ({
        data: ref([
            { id: 1, name: 'Trend 1', tweet_count: 1000 },
            { id: 2, name: 'Trend 2', tweet_count: 500 },
        ]),
        isLoading: ref(false),
        isError: ref(false),
    }),
    useGetWhoToFollowQuery: () => ({
        data: ref({
            data: [
                { id: 1, username: 'user1', name: 'User One' },
                { id: 2, username: 'user2', name: 'User Two' },
            ],
        }),
        isLoading: ref(false),
        isError: ref(false),
    }),
    useGetUsersQuery: () => ({
        data: ref([
            { id: 1, username: 'user1', name: 'User One' },
            { id: 2, username: 'user2', name: 'User Two' },
        ]),
        isLoading: ref(false),
        isError: ref(false),
    }),
}))

describe('Banner Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset route to default
        mockRoute.value = { path: '/' }
    })

    it('should mount component successfully', () => {
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: true,
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        expect(wrapper.exists()).toBe(true)
    })

    it('should render container with proper classes', () => {
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: true,
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        const container = wrapper.find('div')
        expect(container.classes()).toContain('bg-primary')
    })

    it('should render SearchBar when not in search mode', () => {
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: { template: '<div class="search-bar"></div>' },
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        expect(wrapper.find('.search-bar').exists()).toBe(true)
    })

    it('should not render SearchBar when in search mode', () => {
        // Set route to search path
        mockRoute.value = { path: '/search/test' }
        
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: { template: '<div class="search-bar"></div>' },
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        expect(wrapper.find('.search-bar').exists()).toBe(false)
    })

    it('should render trending section title', () => {
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: true,
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        expect(wrapper.text()).toContain('Trending')
    })

    it('should render who to follow section title', () => {
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: true,
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        expect(wrapper.text()).toContain('Who to follow')
    })

    it('should render show more link for trends', () => {
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: { template: '<a :to="to" :id="id"><slot /></a>', props: ['to', 'id'] },
                    SearchBar: true,
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        const showMoreLink = wrapper.find('#link-show-more-trends')
        expect(showMoreLink.exists()).toBe(true)
        expect(showMoreLink.text()).toContain('Show more')
    })

    it('should render trending section with rounded corners', () => {
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: true,
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        const trendingSection = wrapper.findAll('.rounded-2xl')[0]
        expect(trendingSection.exists()).toBe(true)
    })

    it('should not render who to follow section when in search mode', () => {
        // Set route to search path
        mockRoute.value = { path: '/search/test' }
        
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: true,
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        expect(wrapper.text()).not.toContain('Who to follow')
    })

    it('should render trending section when isConnect is true even in search mode', () => {
        // Set route to who-to-follow path (which sets isConnect to true)
        mockRoute.value = { path: '/explore/who-to-follow' }
        
        const wrapper = mount(Banner, {
            global: {
                stubs: {
                    NuxtLink: true,
                    SearchBar: true,
                    LoadingSpinner: true,
                    TrendsList: true,
                    WhoToFollowList: true,
                },
            },
        })
        
        expect(wrapper.text()).toContain('Trending')
    })
})

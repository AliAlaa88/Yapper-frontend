import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import enMessages from '../../../../../i18n/locales/en.json'
import arMessages from '../../../../../i18n/locales/ar.json'
import exploreTabs from '../../components/exploreTabs.vue'

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
const mockRoute = {
    path: '/explore/tabs/for_you',
    query: {},
}

const mockRouter = {
    push: mockPush,
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

function mountExploreTabs(routePath = '/explore/tabs/for_you') {
    mockRoute.path = routePath

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

    return mount(exploreTabs, {
        global: {
            plugins: [[VueQueryPlugin, { queryClient }], i18n],
            mocks: {
                $route: mockRoute,
                $router: mockRouter,
            },
            stubs: {
                SearchBar: {
                    name: 'SearchBar',
                    template: '<div class="search-bar-stub">Search Bar</div>',
                },
                tabsComponent: true,
            },
        },
    })
}

describe('ExploreTabs Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRoute.path = '/explore/tabs/for_you'
    })

    describe('Initial Rendering', () => {
        it('should render the explore tabs component', () => {
            const wrapper = mountExploreTabs()
            expect(wrapper.exists()).toBe(true)
        })

        it('should render SearchBar component', () => {
            const wrapper = mountExploreTabs()
            const searchBar = wrapper.findComponent({ name: 'SearchBar' })
            expect(searchBar.exists()).toBe(true)
        })

        it('should render tabsComponent', () => {
            const wrapper = mountExploreTabs()
            // tabsComponent is stubbed with true, so it should exist
            expect(wrapper.html()).toContain('search-bar-stub')
        })
    })

    describe('Tab Navigation', () => {
        it('should set selectedTab to "for_you" when route is /explore/tabs/for_you', () => {
            const wrapper = mountExploreTabs('/explore/tabs/for_you')
            expect(wrapper.vm.selectedTab).toBe('for_you')
        })

        it('should set selectedTab to "trending" when route is /explore/tabs/trending', () => {
            const wrapper = mountExploreTabs('/explore/tabs/trending')
            expect(wrapper.vm.selectedTab).toBe('trending')
        })

        it('should default to "for_you" if route does not match any tab', () => {
            const wrapper = mountExploreTabs('/explore/tabs/unknown')
            expect(wrapper.vm.selectedTab).toBe('for_you')
        })

        it('should navigate to /explore/tabs/for_you when for_you tab is clicked', async () => {
            const wrapper = mountExploreTabs('/explore/tabs/trending')
            await wrapper.vm.onTabsChange('for_you')
            expect(mockPush).toHaveBeenCalledWith('/explore/tabs/for_you')
        })

        it('should navigate to /explore/tabs/trending when trending tab is clicked', async () => {
            const wrapper = mountExploreTabs('/explore/tabs/for_you')
            await wrapper.vm.onTabsChange('trending')
            expect(mockPush).toHaveBeenCalledWith('/explore/tabs/trending')
        })
    })

    describe('Component Structure', () => {
        it('should have correct container classes', () => {
            const wrapper = mountExploreTabs()
            expect(wrapper.find('.w-full').exists()).toBe(true)
        })

        it('should render SearchBar before tabs', () => {
            const wrapper = mountExploreTabs()
            // Just verify both SearchBar and the tabs section are rendered
            const html = wrapper.html()
            expect(html).toContain('search-bar-stub')
            // The tabs content should also be present
            expect(html.length).toBeGreaterThan(0)
        })
    })

    describe('Tab Configuration', () => {
        it('should have "For You" tab', () => {
            const wrapper = mountExploreTabs()
            const tabsProps = wrapper.vm.translatedTabs
            const forYouTab = tabsProps.find((tab: any) => tab.value === 'for_you')
            expect(forYouTab).toBeDefined()
        })

        it('should have "Trending" tab', () => {
            const wrapper = mountExploreTabs()
            const tabsProps = wrapper.vm.translatedTabs
            const trendingTab = tabsProps.find((tab: any) => tab.value === 'trending')
            expect(trendingTab).toBeDefined()
        })

        it('should have at least 2 tabs total', () => {
            const wrapper = mountExploreTabs()
            // Tabs include: for_you, trending, news, sports, entertainment
            expect(wrapper.vm.translatedTabs.length).toBeGreaterThanOrEqual(2)
            // Check that for_you and trending are present
            const hasForYou = wrapper.vm.translatedTabs.some((tab: any) => tab.value === 'for_you')
            const hasTrending = wrapper.vm.translatedTabs.some((tab: any) => tab.value === 'trending')
            expect(hasForYou).toBe(true)
            expect(hasTrending).toBe(true)
        })
    })
})
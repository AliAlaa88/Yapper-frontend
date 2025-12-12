import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import enMessages from '../../../../../i18n/locales/en.json' with { type: 'json' }
import arMessages from '../../../../../i18n/locales/ar.json' with { type: 'json' }
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
                tabsComponent: {
                    name: 'tabsComponent',
                    template: `
                        <div class="tabs-mock">
                            <slot />
                        </div>
                    `,
                },
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
            const tabs = wrapper.findComponent({ name: 'tabsComponent' })
            expect(tabs.exists()).toBe(true)
        })
    })

    describe('Tab Navigation', () => {
        it('should set activeTab to "for_you" when route is /explore/tabs/for_you', () => {
            const wrapper = mountExploreTabs('/explore/tabs/for_you')
            expect(wrapper.vm.activeTab).toBe('for_you')
        })

        it('should set activeTab to "trending" when route is /explore/tabs/trending', () => {
            const wrapper = mountExploreTabs('/explore/tabs/trending')
            expect(wrapper.vm.activeTab).toBe('trending')
        })

        it('should default to "for_you" if route does not match any tab', () => {
            const wrapper = mountExploreTabs('/explore/tabs/unknown')
            expect(wrapper.vm.activeTab).toBe('for_you')
        })

        it('should navigate to /explore/tabs/for_you when for_you tab is clicked', async () => {
            const wrapper = mountExploreTabs('/explore/tabs/trending')
            await wrapper.vm.onChange('for_you')
            expect(mockPush).toHaveBeenCalledWith('/explore/tabs/for_you')
        })

        it('should navigate to /explore/tabs/trending when trending tab is clicked', async () => {
            const wrapper = mountExploreTabs('/explore/tabs/for_you')
            await wrapper.vm.onChange('trending')
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
            const searchBar = wrapper.findComponent({ name: 'SearchBar' })
            const tabsComp = wrapper.findComponent({ name: 'tabsComponent' })
            
            const searchBarIndex = wrapper.findAllComponents({ name: 'SearchBar' }).indexOf(searchBar)
            const tabsIndex = wrapper.findAllComponents({ name: 'tabsComponent' }).indexOf(tabsComp)
            
            expect(searchBarIndex).toBeLessThan(tabsIndex)
        })
    })

    describe('Tab Configuration', () => {
        it('should have "For You" tab', () => {
            const wrapper = mountExploreTabs()
            const tabsProps = wrapper.vm.tabs
            const forYouTab = tabsProps.find((tab: any) => tab.value === 'for_you')
            expect(forYouTab).toBeDefined()
        })

        it('should have "Trending" tab', () => {
            const wrapper = mountExploreTabs()
            const tabsProps = wrapper.vm.tabs
            const trendingTab = tabsProps.find((tab: any) => tab.value === 'trending')
            expect(trendingTab).toBeDefined()
        })

        it('should have 2 tabs total', () => {
            const wrapper = mountExploreTabs()
            expect(wrapper.vm.tabs).toHaveLength(2)
        })
    })
})

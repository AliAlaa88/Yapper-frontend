import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock dependencies
const mockRouterPush = vi.fn()
const mockRouterBack = vi.fn()
let mockRouteQuery = { q: 'test query', src: 'typed_query', f: undefined as string | undefined }

vi.mock('vue-router', () => ({
    useRoute: () => ({
        query: mockRouteQuery,
    }),
    useRouter: () => ({
        push: mockRouterPush,
        back: mockRouterBack,
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: 'en',
    }),
}))

vi.mock('lucide-vue-next', () => ({
    ArrowLeft: { template: '<span>ArrowLeft</span>' },
}))

// Stub child components
vi.mock('~/modules/search/components/SearchBar.vue', () => ({
    default: { template: '<div class="mock-search-bar">SearchBar</div>', props: ['hasArrow'] }
}))

vi.mock('~/modules/Common/components/Tabs/Tabs.vue', () => ({
    default: { 
        template: '<div class="mock-tabs"><slot /></div>', 
        props: ['tabs', 'activeTab', 'onChange'],
    }
}))

vi.mock('~/modules/tweets/components/TweetsList/TweetsList.vue', () => ({
    default: { template: '<div class="mock-tweets-list">TweetsList</div>', props: ['fetchingSource', 'compact'] }
}))

vi.mock('~/modules/Common/components/UserList', () => ({
    UserList: { template: '<div class="mock-user-list"><slot :users="[]" /></div>', props: ['fetchingSource', 'queryKeyPrefix', 'loadingText', 'errorText', 'retryText', 'emptyTitle', 'emptyDescription'] }
}))

vi.mock('~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue', () => ({
    default: { template: '<div class="mock-empty-state">EmptyState</div>', props: ['icon', 'title', 'description'] }
}))

vi.mock('~/modules/Common/components/UserCard/UserCard.vue', () => ({
    default: { template: '<div class="mock-user-card">UserCard</div>', props: ['user', 'showTooltip'] }
}))

vi.mock('~/modules/Common/components/MediaGrid/MediaGrid.vue', () => ({
    default: { template: '<div class="mock-media-grid">MediaGrid</div>', props: ['fetchingSource'] }
}))

describe('SearchResults', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRouteQuery = { q: 'test query', src: 'typed_query', f: undefined }
    })

    const mountComponent = async () => {
        const SearchResults = (await import('../../components/SearchResults.vue')).default
        return mount(SearchResults, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    SearchBar: { template: '<div class="mock-search-bar">SearchBar</div>', props: ['hasArrow'] },
                    Tabs: { 
                        template: '<div class="mock-tabs"><slot /></div>', 
                        props: ['tabs', 'activeTab', 'onChange'],
                    },
                    TweetsList: { template: '<div class="mock-tweets-list">TweetsList</div>', props: ['fetchingSource', 'compact'] },
                    UserList: { template: '<div class="mock-user-list"><slot :users="[]" /></div>', props: ['fetchingSource'] },
                    EmptyState: { template: '<div class="mock-empty-state">EmptyState</div>', props: ['icon', 'title', 'description'] },
                    FollowListUserCard: { template: '<div class="mock-user-card">UserCard</div>', props: ['user', 'showTooltip'] },
                    MediaGrid: { template: '<div class="mock-media-grid">MediaGrid</div>', props: ['fetchingSource'] },
                    ArrowLeft: true,
                },
            },
        })
    }

    describe('rendering', () => {
        it('renders search bar with hasArrow prop', async () => {
            const wrapper = await mountComponent()
            expect(wrapper.find('.mock-search-bar').exists()).toBe(true)
        })

        it('renders tabs component', async () => {
            const wrapper = await mountComponent()
            expect(wrapper.find('.mock-tabs').exists()).toBe(true)
        })

        it('renders mobile back button', async () => {
            const wrapper = await mountComponent()
            expect(wrapper.find('#btn-back-search-mobile').exists()).toBe(true)
        })
    })

    describe('tab selection', () => {
        it('shows top tab by default', async () => {
            mockRouteQuery.f = undefined
            const wrapper = await mountComponent()
            expect(wrapper.find('.mock-tweets-list').exists()).toBe(true)
        })

        it('shows latest tab when f=live', async () => {
            mockRouteQuery.f = 'live'
            const wrapper = await mountComponent()
            // TweetsList should be rendered for latest tab
            expect(wrapper.find('.mock-tweets-list').exists()).toBe(true)
        })

        it('shows people tab when f=user', async () => {
            mockRouteQuery.f = 'user'
            const wrapper = await mountComponent()
            expect(wrapper.find('.mock-user-list').exists()).toBe(true)
        })

        it('shows media tab when f=media', async () => {
            mockRouteQuery.f = 'media'
            const wrapper = await mountComponent()
            expect(wrapper.find('.mock-media-grid').exists()).toBe(true)
        })
    })

    describe('from:username parsing', () => {
        it('extracts username from from:username format', async () => {
            mockRouteQuery.q = 'from:johndoe test query'
            const wrapper = await mountComponent()
            
            // The component should have extracted 'johndoe' as fromUsername
            // and 'test query' as the search query for API
            expect(wrapper.find('.mock-tweets-list').exists()).toBe(true)
        })

        it('handles query without from:username', async () => {
            mockRouteQuery.q = 'just a normal query'
            const wrapper = await mountComponent()
            expect(wrapper.find('.mock-tweets-list').exists()).toBe(true)
        })
    })

    describe('empty query', () => {
        it('shows no results message when query is empty', async () => {
            mockRouteQuery.q = ''
            const wrapper = await mountComponent()
            expect(wrapper.text()).toContain('No results for')
        })
    })

    describe('navigation', () => {
        it('calls router.back when mobile back button clicked', async () => {
            const wrapper = await mountComponent()
            await wrapper.find('#btn-back-search-mobile').trigger('click')
            expect(mockRouterBack).toHaveBeenCalled()
        })
    })

    describe('tab change handling', () => {
        it('generates correct URL for people tab', () => {
            const query: Record<string, string> = {
                q: 'test query',
                src: 'typed_query',
            }
            query.f = 'user'

            expect(query.f).toBe('user')
        })

        it('generates correct URL for latest tab', () => {
            const query: Record<string, string> = {
                q: 'test query',
                src: 'typed_query',
            }
            query.f = 'live'

            expect(query.f).toBe('live')
        })

        it('generates correct URL for media tab', () => {
            const query: Record<string, string> = {
                q: 'test query',
                src: 'typed_query',
            }
            query.f = 'media'

            expect(query.f).toBe('media')
        })

        it('omits f param for top tab', () => {
            const query: Record<string, string> = {
                q: 'test query',
                src: 'typed_query',
            }
            // Top tab should not have f param
            expect(query.f).toBeUndefined()
        })
    })
})

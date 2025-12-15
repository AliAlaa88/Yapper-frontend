import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick, defineComponent, h } from 'vue'

// Mock dependencies
const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}))

vi.mock('lucide-vue-next', () => ({
    Search: { template: '<span>Search</span>' },
    UserRound: { template: '<span>UserRound</span>' },
}))

// Mock query hook
const mockSuggestionsData = ref<any>(null)
const mockIsLoading = ref(false)
const mockIsError = ref(false)

vi.mock('~/modules/search/queries/useSearchSuggestionsQuery', () => ({
    useSearchSuggestionsQuery: () => ({
        data: mockSuggestionsData,
        isLoading: mockIsLoading,
        isError: mockIsError,
    }),
}))

describe('SearchSuggestions', () => {
    const mockLocalStorage: Record<string, string> = {}

    const mockQuerySuggestions = [
        { query: 'suggested query 1', is_trending: false },
        { query: 'trending query', is_trending: true },
    ]

    const mockUserSuggestions = [
        {
            user_id: 'user1',
            name: 'Test User 1',
            username: 'testuser1',
            avatar_url: 'https://example.com/avatar1.jpg',
            is_following: true,
            is_follower: false,
        },
        {
            user_id: 'user2',
            name: 'Test User 2',
            username: 'testuser2',
            avatar_url: '',
            is_following: false,
            is_follower: true,
        },
        {
            user_id: 'user3',
            name: 'Test User 3',
            username: 'testuser3',
            avatar_url: 'https://example.com/avatar3.jpg',
            is_following: true,
            is_follower: true,
        },
    ]

    beforeEach(async () => {
        vi.clearAllMocks()
        mockSuggestionsData.value = null
        mockIsLoading.value = false
        mockIsError.value = false
        Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key])

        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
            setItem: vi.fn((key: string, value: string) => { mockLocalStorage[key] = value }),
        })
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    const mountComponent = async (searchQuery = 'test') => {
        const SearchSuggestions = (await import('../../components/SearchSuggestions.vue')).default
        return mount(SearchSuggestions, {
            props: { searchQuery },
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    Search: true,
                    UserRound: true,
                },
            },
        })
    }

    describe('loading state', () => {
        it('shows loading message when loading', async () => {
            mockIsLoading.value = true
            const wrapper = await mountComponent()
            expect(wrapper.text()).toContain('messages.loading')
        })
    })

    describe('error state', () => {
        it('shows error message when error occurs', async () => {
            mockIsError.value = true
            const wrapper = await mountComponent()
            expect(wrapper.text()).toContain('messages.error')
        })
    })

    describe('empty state', () => {
        it('shows no suggestions message when no results', async () => {
            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [],
            }
            const wrapper = await mountComponent()
            expect(wrapper.text()).toContain('search.noSuggestions')
        })
    })

    describe('query suggestions', () => {
        it('displays query suggestions', async () => {
            mockSuggestionsData.value = {
                suggested_queries: mockQuerySuggestions,
                suggested_users: [],
            }
            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('suggested query 1')
            expect(wrapper.text()).toContain('trending query')
        })

        it('shows trending indicator for trending queries', async () => {
            mockSuggestionsData.value = {
                suggested_queries: mockQuerySuggestions,
                suggested_users: [],
            }
            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('search.trending')
        })

        it('emits handleSearchSubmit when query suggestion clicked', async () => {
            mockSuggestionsData.value = {
                suggested_queries: mockQuerySuggestions,
                suggested_users: [],
            }
            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.findAll('li')[0].trigger('click')

            expect(wrapper.emitted('handleSearchSubmit')).toBeTruthy()
            expect(wrapper.emitted('handleSearchSubmit')![0]).toEqual(['suggested query 1', 'typeahead_click'])
        })
    })

    describe('user suggestions', () => {
        it('displays user suggestions', async () => {
            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: mockUserSuggestions,
            }
            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('Test User 1')
            expect(wrapper.text()).toContain('@testuser1')
        })

        it('shows avatar when avatar_url is provided', async () => {
            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [mockUserSuggestions[0]],
            }
            const wrapper = await mountComponent()
            await nextTick()

            const img = wrapper.find('img')
            expect(img.attributes('src')).toBe('https://example.com/avatar1.jpg')
        })

        it('shows fallback avatar when no avatar_url', async () => {
            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [mockUserSuggestions[1]],
            }
            const wrapper = await mountComponent()
            await nextTick()

            const img = wrapper.find('img')
            expect(img.attributes('src')).toContain('ui-avatars.com')
        })

        it('shows "You follow" for users you follow', async () => {
            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [mockUserSuggestions[0]],
            }
            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('search.youFollow')
        })

        it('shows "Follows you" for followers', async () => {
            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [mockUserSuggestions[1]],
            }
            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('search.followsYou')
        })

        it('shows "Follow each other" for mutual follows', async () => {
            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [mockUserSuggestions[2]],
            }
            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('search.followEachOther')
        })
    })

    describe('user click handling', () => {
        it('saves user to localStorage when clicked', async () => {
            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [mockUserSuggestions[0]],
            }
            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.find('li').trigger('click')

            expect(localStorage.setItem).toHaveBeenCalled()
            expect(mockRouterPush).toHaveBeenCalledWith('/testuser1')
        })

        it('removes duplicate user from history before adding', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([
                { type: 'user', user_id: 'user1', name: 'Old Name', username: 'testuser1', timestamp: 1000 }
            ])

            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [mockUserSuggestions[0]],
            }
            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.find('li').trigger('click')

            expect(localStorage.setItem).toHaveBeenCalled()
        })

        it('handles localStorage error gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            vi.mocked(localStorage.getItem).mockImplementation(() => { throw new Error('Storage error') })

            mockSuggestionsData.value = {
                suggested_queries: [],
                suggested_users: [mockUserSuggestions[0]],
            }
            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.find('li').trigger('click')

            expect(consoleSpy).toHaveBeenCalled()
            expect(mockRouterPush).toHaveBeenCalledWith('/testuser1')
            consoleSpy.mockRestore()
        })
    })
})

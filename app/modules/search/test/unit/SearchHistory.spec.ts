import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock dependencies
const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}))

vi.mock('lucide-vue-next', () => ({
    Search: { template: '<span>Search</span>' },
    X: { template: '<span data-testid="remove-icon">X</span>' },
}))

describe('SearchHistory', () => {
    const mockLocalStorage: Record<string, string> = {}

    const mockQueryItem = {
        type: 'query' as const,
        query: 'test query',
        timestamp: 1000,
    }

    const mockUserItem = {
        type: 'user' as const,
        user_id: 'user123',
        name: 'Test User',
        username: 'testuser',
        avatar_url: 'https://example.com/avatar.jpg',
        timestamp: 2000,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key])

        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
            setItem: vi.fn((key: string, value: string) => { mockLocalStorage[key] = value }),
            removeItem: vi.fn((key: string) => { delete mockLocalStorage[key] }),
            clear: vi.fn(),
        })
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    const mountComponent = async () => {
        const SearchHistory = (await import('../../components/SearchHistory.vue')).default
        return mount(SearchHistory, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    Search: true,
                    X: { template: '<span data-testid="remove-icon">X</span>' },
                },
            },
        })
    }

    describe('empty state', () => {
        it('shows enter query message when history is empty', async () => {
            const wrapper = await mountComponent()
            expect(wrapper.text()).toContain('search.enterQuery')
        })

        it('does not show clear all button when history is empty', async () => {
            const wrapper = await mountComponent()
            expect(wrapper.find('#btn-clear-all-search-history').exists()).toBe(false)
        })
    })

    describe('with history items', () => {
        it('shows recent header when history has items', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockQueryItem])

            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('search.recent')
        })

        it('shows clear all button when history has items', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockQueryItem])

            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.find('#btn-clear-all-search-history').exists()).toBe(true)
        })

        it('displays query items correctly', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockQueryItem])

            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('test query')
        })

        it('displays user items correctly', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockUserItem])

            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('Test User')
            expect(wrapper.text()).toContain('@testuser')
        })

        it('shows fallback avatar when no avatar_url', async () => {
            const userWithoutAvatar = {
                ...mockUserItem,
                avatar_url: '',
            }
            mockLocalStorage['yapper-search-history'] = JSON.stringify([userWithoutAvatar])

            const wrapper = await mountComponent()
            await nextTick()

            const img = wrapper.find('img')
            expect(img.exists()).toBe(true)
            expect(img.attributes('src')).toContain('ui-avatars.com')
        })
    })

    describe('sorting', () => {
        it('sorts items by timestamp descending', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([
                { ...mockQueryItem, query: 'old query', timestamp: 1000 },
                { ...mockQueryItem, query: 'new query', timestamp: 2000 },
            ])

            const wrapper = await mountComponent()
            await nextTick()

            const items = wrapper.findAll('li')
            expect(items[0].text()).toContain('new query')
            expect(items[1].text()).toContain('old query')
        })
    })

    describe('interactions', () => {
        it('emits handleSearchSubmit when query item clicked', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockQueryItem])

            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.find('.flex-1.min-w-0.cursor-pointer').trigger('click')

            expect(wrapper.emitted('handleSearchSubmit')).toBeTruthy()
            expect(wrapper.emitted('handleSearchSubmit')![0]).toEqual(['test query', 'recent_search_click'])
        })

        it('navigates to user profile when user item clicked', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockUserItem])

            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.find('li').find('.cursor-pointer').trigger('click')

            expect(mockRouterPush).toHaveBeenCalledWith('/testuser')
        })

        it('removes item when remove button clicked', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockQueryItem])

            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.find('#btn-remove-search-history-0').trigger('click')

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'yapper-search-history',
                JSON.stringify([])
            )
        })

        it('clears all history when clear all button clicked', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockQueryItem, mockUserItem])

            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.find('#btn-clear-all-search-history').trigger('click')

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'yapper-search-history',
                JSON.stringify([])
            )
        })
    })

    describe('data migration', () => {
        it('migrates old format without type field', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([
                { query: 'old format query' }
            ])

            const wrapper = await mountComponent()
            await nextTick()

            expect(wrapper.text()).toContain('old format query')
        })
    })

    describe('error handling', () => {
        it('handles localStorage parse error gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            mockLocalStorage['yapper-search-history'] = 'invalid json'

            const wrapper = await mountComponent()
            await nextTick()

            expect(consoleSpy).toHaveBeenCalled()
            expect(wrapper.text()).toContain('search.enterQuery')
            consoleSpy.mockRestore()
        })

        it('handles localStorage save error gracefully', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([mockQueryItem])
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            vi.mocked(localStorage.setItem).mockImplementation(() => { throw new Error('Storage full') })

            const wrapper = await mountComponent()
            await nextTick()

            await wrapper.find('#btn-clear-all-search-history').trigger('click')

            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })
    })
})

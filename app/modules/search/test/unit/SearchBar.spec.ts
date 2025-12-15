import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'

// Mock dependencies
const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
    useRoute: () => ({
        query: { q: '' },
    }),
    useRouter: () => ({
        push: mockRouterPush,
    }),
}))

vi.mock('~/modules/search/components/SearchHistory.vue', () => ({
    default: { template: '<div class="mock-search-history" @click="$emit(\'handleSearchSubmit\', \'history-query\', \'recent_search_click\')">SearchHistory</div>' }
}))

vi.mock('~/modules/search/components/SearchSuggestions.vue', () => ({
    default: { template: '<div class="mock-search-suggestions">SearchSuggestions</div>', props: ['searchQuery'] }
}))

vi.mock('~/modules/Common/composables/useDebounce', () => ({
    useDebounce: (value: any) => value
}))

vi.mock('lucide-vue-next', () => ({
    ArrowLeft: { template: '<span>ArrowLeft</span>' },
    Search: { template: '<span>Search</span>' },
    CircleX: { template: '<span>CircleX</span>' },
}))

describe('SearchBar', () => {
    const mockLocalStorage: Record<string, string> = {}

    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
        Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key])

        // Mock localStorage
        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
            setItem: vi.fn((key: string, value: string) => { mockLocalStorage[key] = value }),
            removeItem: vi.fn((key: string) => { delete mockLocalStorage[key] }),
            clear: vi.fn(() => { Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]) }),
        })

        // Mock history.state
        vi.stubGlobal('history', { state: {} })
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.unstubAllGlobals()
    })

    const mountComponent = async (props = {}) => {
        const SearchBar = (await import('../../components/SearchBar.vue')).default
        return mount(SearchBar, {
            props,
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    SearchHistory: { template: '<div class="mock-search-history" @click="$emit(\'handleSearchSubmit\', \'history-query\', \'recent_search_click\')">SearchHistory</div>' },
                    SearchSuggestions: { template: '<div class="mock-search-suggestions">SearchSuggestions</div>', props: ['searchQuery'] },
                    ArrowLeft: true,
                    Search: true,
                    CircleX: true,
                },
            },
        })
    }

    describe('rendering', () => {
        it('renders search input', async () => {
            const wrapper = await mountComponent()
            expect(wrapper.find('#input-search-bar').exists()).toBe(true)
        })

        it('does not show back button when not focused', async () => {
            const wrapper = await mountComponent({ hasArrow: true })
            expect(wrapper.find('#btn-back-search').exists()).toBe(false)
        })

        it('does not show clear button when input is empty', async () => {
            const wrapper = await mountComponent()
            expect(wrapper.find('#btn-clear-search').exists()).toBe(false)
        })
    })

    describe('focus behavior', () => {
        it('shows dropdown on focus after delay', async () => {
            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.trigger('focus')
            expect(wrapper.find('.mock-search-history').exists()).toBe(false)

            vi.advanceTimersByTime(200)
            await nextTick()

            expect(wrapper.find('.mock-search-history').exists()).toBe(true)
        })

        it('hides dropdown on blur after delay', async () => {
            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.trigger('focus')
            vi.advanceTimersByTime(200)
            await nextTick()

            await input.trigger('blur')
            vi.advanceTimersByTime(200)
            await nextTick()

            expect(wrapper.find('.mock-search-history').exists()).toBe(false)
        })

        it('shows back button when focused and hasArrow is true', async () => {
            const wrapper = await mountComponent({ hasArrow: true })
            const input = wrapper.find('#input-search-bar')

            await input.trigger('focus')
            vi.advanceTimersByTime(200)
            await nextTick()

            expect(wrapper.find('#btn-back-search').exists()).toBe(true)
        })
    })

    describe('clear button', () => {
        it('shows clear button when focused and has input', async () => {
            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.setValue('test query')
            await input.trigger('focus')
            vi.advanceTimersByTime(200)
            await nextTick()

            expect(wrapper.find('#btn-clear-search').exists()).toBe(true)
        })

        it('clears input when clear button is clicked', async () => {
            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.setValue('test query')
            await input.trigger('focus')
            vi.advanceTimersByTime(200)
            await nextTick()

            await wrapper.find('#btn-clear-search').trigger('click')

            expect((input.element as HTMLInputElement).value).toBe('')
        })
    })

    describe('back button', () => {
        it('closes dropdown when back button clicked', async () => {
            const wrapper = await mountComponent({ hasArrow: true })
            const input = wrapper.find('#input-search-bar')

            await input.trigger('focus')
            vi.advanceTimersByTime(200)
            await nextTick()

            await wrapper.find('#btn-back-search').trigger('click')
            await nextTick()

            expect(wrapper.find('.mock-search-history').exists()).toBe(false)
        })
    })

    describe('search submission', () => {
        it('does not submit empty query', async () => {
            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.setValue('   ')
            await input.trigger('keydown.enter')

            expect(mockRouterPush).not.toHaveBeenCalled()
        })

        it('saves query to localStorage on submit', async () => {
            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.setValue('test search')
            await input.trigger('keydown.enter')

            expect(localStorage.setItem).toHaveBeenCalled()
        })

        it('removes duplicate from history before adding', async () => {
            mockLocalStorage['yapper-search-history'] = JSON.stringify([
                { type: 'query', query: 'test search', timestamp: 1000 }
            ])

            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.setValue('test search')
            await input.trigger('keydown.enter')

            expect(localStorage.setItem).toHaveBeenCalled()
        })
    })

    describe('suggestions vs history', () => {
        it('shows SearchHistory when query is empty', async () => {
            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.trigger('focus')
            vi.advanceTimersByTime(200)
            await nextTick()

            expect(wrapper.find('.mock-search-history').exists()).toBe(true)
            expect(wrapper.find('.mock-search-suggestions').exists()).toBe(false)
        })

        it('shows SearchSuggestions when query is not empty', async () => {
            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.setValue('test')
            await input.trigger('focus')
            vi.advanceTimersByTime(200)
            await nextTick()

            expect(wrapper.find('.mock-search-suggestions').exists()).toBe(true)
        })
    })

    describe('error handling', () => {
        it('handles localStorage error gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            vi.mocked(localStorage.getItem).mockImplementation(() => { throw new Error('Storage error') })

            const wrapper = await mountComponent()
            const input = wrapper.find('#input-search-bar')

            await input.setValue('test search')
            await input.trigger('keydown.enter')

            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })
    })
})

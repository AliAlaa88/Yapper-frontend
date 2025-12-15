import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Import after mocking
import { useSearchSuggestionsQuery } from '../../queries/useSearchSuggestionsQuery'

// Mock useQuery
const mockUseQuery = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
    useQuery: (options: any) => mockUseQuery(options),
}))

// Mock useNuxtApp
const mockGetSearchSuggestions = vi.fn()

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $searchService: {
            getSearchSuggestions: mockGetSearchSuggestions,
        },
    }),
}))

describe('useSearchSuggestionsQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseQuery.mockReturnValue({
            data: ref(null),
            isLoading: ref(false),
            isError: ref(false),
        })
    })

    it('calls useQuery with correct query key', () => {
        const query = ref('test')
        useSearchSuggestionsQuery(query)

        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['search-suggestions', query],
            }),
        )
    })

    it('passes enabled ref to useQuery', () => {
        const query = ref('test')
        const enabled = ref(false)
        useSearchSuggestionsQuery(query, enabled)

        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                enabled,
            }),
        )
    })

    it('defaults enabled to true', () => {
        const query = ref('test')
        useSearchSuggestionsQuery(query)

        const callArgs = mockUseQuery.mock.calls[0][0]
        expect(callArgs.enabled.value).toBe(true)
    })

    it('queryFn calls searchService.getSearchSuggestions', () => {
        const query = ref('test search')
        useSearchSuggestionsQuery(query)

        const callArgs = mockUseQuery.mock.calls[0][0]
        callArgs.queryFn()

        expect(mockGetSearchSuggestions).toHaveBeenCalledWith('test search')
    })

    it('returns the query result', () => {
        const mockResult = {
            data: ref({ suggested_queries: [], suggested_users: [] }),
            isLoading: ref(false),
            isError: ref(false),
        }
        mockUseQuery.mockReturnValue(mockResult)

        const query = ref('test')
        const result = useSearchSuggestionsQuery(query)

        expect(result).toBe(mockResult)
    })
})

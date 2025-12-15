import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { useGenericInfiniteQuery } from '../../composables/useGenericInfiniteQuery'

// Mock useInfiniteScroll
vi.mock('../../composables/useInfiniteScroll', () => ({
    useInfiniteScroll: vi.fn(() => ({
        loadMoreTrigger: ref(null),
    })),
}))

// Mock useInfiniteQuery
const mockQueryResult = {
    data: ref({ pages: [] }),
    isPending: ref(false),
    isFetching: ref(false),
    isFetchingNextPage: ref(false),
    error: ref(null),
    hasNextPage: ref(false),
    fetchNextPage: vi.fn(),
    refetch: vi.fn(),
}

vi.mock('@tanstack/vue-query', () => ({
    useInfiniteQuery: vi.fn(() => mockQueryResult),
}))

describe('useGenericInfiniteQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockQueryResult.data.value = { pages: [] }
        mockQueryResult.isPending.value = false
        mockQueryResult.isFetching.value = false
        mockQueryResult.isFetchingNextPage.value = false
        mockQueryResult.error.value = null
        mockQueryResult.hasNextPage.value = false
    })

    it('returns expected structure with items computed', () => {
        const mockQueryFn = vi.fn().mockResolvedValue({ data: [], nextCursor: null })

        const result = useGenericInfiniteQuery({
            queryKey: ['test-query'],
            queryFn: mockQueryFn,
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(result.items).toBeDefined()
        expect(result.isPending).toBeDefined()
        expect(result.isFetching).toBeDefined()
        expect(result.isFetchingNextPage).toBeDefined()
        expect(result.hasNextPage).toBeDefined()
        expect(result.refetch).toBeDefined()
        expect(result.fetchNextPage).toBeDefined()
        expect(result.loadMoreTrigger).toBeDefined()
    })

    it('initializes items as empty array when no data', () => {
        const mockQueryFn = vi.fn().mockResolvedValue({ data: [], nextCursor: null })

        const result = useGenericInfiniteQuery({
            queryKey: ['test-query-empty'],
            queryFn: mockQueryFn,
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(result.items.value).toEqual([])
    })

    it('flattens pages into items correctly', () => {
        // Set up mock data with pages
        mockQueryResult.data.value = {
            pages: [
                { data: [{ id: 1 }, { id: 2 }], nextCursor: null },
            ],
        }

        const result = useGenericInfiniteQuery({
            queryKey: ['test-query-flat'],
            queryFn: vi.fn(),
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(result.items.value).toEqual([{ id: 1 }, { id: 2 }])
    })

    it('returns isPending state from query', () => {
        mockQueryResult.isPending.value = true

        const result = useGenericInfiniteQuery({
            queryKey: ['test-pending'],
            queryFn: vi.fn(),
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(result.isPending.value).toBe(true)
    })

    it('returns isFetching state from query', () => {
        mockQueryResult.isFetching.value = true

        const result = useGenericInfiniteQuery({
            queryKey: ['test-fetching'],
            queryFn: vi.fn(),
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(result.isFetching.value).toBe(true)
    })

    it('returns isFetchingNextPage state from query', () => {
        mockQueryResult.isFetchingNextPage.value = true

        const result = useGenericInfiniteQuery({
            queryKey: ['test-fetching-next'],
            queryFn: vi.fn(),
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(result.isFetchingNextPage.value).toBe(true)
    })

    it('returns hasNextPage computed correctly', () => {
        mockQueryResult.hasNextPage.value = true

        const result = useGenericInfiniteQuery({
            queryKey: ['test-has-next'],
            queryFn: vi.fn(),
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(result.hasNextPage.value).toBe(true)
    })

    it('exposes refetch function', () => {
        const result = useGenericInfiniteQuery({
            queryKey: ['test-refetch'],
            queryFn: vi.fn(),
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(typeof result.refetch).toBe('function')
    })

    it('exposes fetchNextPage function', () => {
        const result = useGenericInfiniteQuery({
            queryKey: ['test-fetch-next'],
            queryFn: vi.fn(),
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(typeof result.fetchNextPage).toBe('function')
    })

    it('returns loadMoreTrigger from useInfiniteScroll', () => {
        const result = useGenericInfiniteQuery({
            queryKey: ['test-trigger'],
            queryFn: vi.fn(),
            getNextPageParam: (page: any) => page.nextCursor,
            getPageData: (page: any) => page.data,
        })

        expect(result.loadMoreTrigger).toBeDefined()
    })
})

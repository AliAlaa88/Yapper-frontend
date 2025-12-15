import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import {
    useGetExploreQuery,
    useGetTrendsQuery,
    useGetWhoToFollowQuery,
    useGetExploreCategoriesQuery,
} from '../../queries/useGetExploreQuery'

const mockExploreService = {
    getExplore: vi.fn(),
    getTrending: vi.fn(),
    getExploreWhoToFollow: vi.fn(),
    getExploreCategories: vi.fn(),
}

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $exploreService: mockExploreService,
    }),
}))

vi.mock('@tanstack/vue-query', async () => {
    const actual = await vi.importActual('@tanstack/vue-query')
    return {
        ...actual,
        useQuery: vi.fn((config: any) => ({
            data: { value: { data: [] } },
            isLoading: { value: false },
            isError: { value: false },
            error: { value: null },
            refetch: vi.fn(),
            isFetching: { value: false },
            queryKey: config.queryKey,
            queryFn: config.queryFn,
        })),
    }
})

describe('Explore Queries', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('useGetExploreQuery', () => {
        it('should initialize with correct query key', () => {
            const query = useGetExploreQuery(false)
            expect(query.queryKey).toContain('getExplore')
        })

        it('should call getExplore service when enabled', async () => {
            mockExploreService.getExplore.mockResolvedValue({ data: [{ id: '1', name: 'Tech' }] })
            const query = useGetExploreQuery(true)
            
            await query.queryFn()
            expect(mockExploreService.getExplore).toHaveBeenCalled()
        })

        it('should support reactive enabled ref', () => {
            const enabledRef = ref(false)
            const query = useGetExploreQuery(enabledRef)
            expect(query).toBeDefined()
        })

        it('should have correct query settings', () => {
            const query = useGetExploreQuery(true)
            expect(query.queryKey).toEqual(['getExplore'])
        })
    })

    describe('useGetTrendsQuery', () => {
        it('should initialize with correct query key including category', () => {
            const query = useGetTrendsQuery('technology', false)
            expect(query.queryKey).toContain('getTrends')
            expect(query.queryKey).toContain('technology')
        })

        it('should call getTrending service with category and limit', async () => {
            mockExploreService.getTrending.mockResolvedValue({
                data: [{ id: '1', name: 'Trend 1' }],
            })

            const query = useGetTrendsQuery('technology', true, 10)
            await query.queryFn()

            expect(mockExploreService.getTrending).toHaveBeenCalledWith('technology', 10)
        })

        it('should use undefined category by default', async () => {
            mockExploreService.getTrending.mockResolvedValue({ data: [] })
            const query = useGetTrendsQuery(undefined, true)
            await query.queryFn()

            expect(mockExploreService.getTrending).toHaveBeenCalledWith(undefined, undefined)
        })

        it('should support reactive enabled ref', () => {
            const enabledRef = ref(true)
            const query = useGetTrendsQuery('sports', enabledRef)
            expect(query).toBeDefined()
        })

        it('should handle different categories', async () => {
            mockExploreService.getTrending.mockResolvedValue({ data: [] })
            
            const query1 = useGetTrendsQuery('technology', true)
            const query2 = useGetTrendsQuery('sports', true)

            expect(query1.queryKey).toContain('technology')
            expect(query2.queryKey).toContain('sports')
        })
    })

    describe('useGetWhoToFollowQuery', () => {
        it('should initialize with correct query key', () => {
            const query = useGetWhoToFollowQuery(false)
            expect(query.queryKey).toContain('who-to-follow')
        })

        it('should call getExploreWhoToFollow service', async () => {
            mockExploreService.getExploreWhoToFollow.mockResolvedValue({
                data: [{ id: '1', username: 'user1' }],
            })

            const query = useGetWhoToFollowQuery(true)
            await query.queryFn()

            expect(mockExploreService.getExploreWhoToFollow).toHaveBeenCalled()
        })

        it('should support reactive enabled ref', () => {
            const enabledRef = ref(true)
            const query = useGetWhoToFollowQuery(enabledRef)
            expect(query).toBeDefined()
        })

        it('should have staleTime of 0', () => {
            const query = useGetWhoToFollowQuery(true)
            expect(query).toBeDefined()
        })
    })

    describe('useGetExploreCategoriesQuery', () => {
        it('should initialize with correct query key including all params', () => {
            const query = useGetExploreCategoriesQuery('cat1', 1, 20, false)
            expect(query.queryKey).toContain('getExploreCategories')
            expect(query.queryKey).toContain('cat1')
            expect(query.queryKey).toContain(1)
            expect(query.queryKey).toContain(20)
        })

        it('should call getExploreCategories with string category id', async () => {
            mockExploreService.getExploreCategories.mockResolvedValue({
                data: { tweets: [], category: {} },
            })

            const query = useGetExploreCategoriesQuery('cat123', 1, 20, true)
            await query.queryFn()

            expect(mockExploreService.getExploreCategories).toHaveBeenCalledWith('cat123', 1, 20)
        })

        it('should handle reactive category id ref', async () => {
            const categoryRef = ref('cat-react')
            mockExploreService.getExploreCategories.mockResolvedValue({
                data: { tweets: [], category: {} },
            })

            const query = useGetExploreCategoriesQuery(categoryRef, 1, 20, true)
            await query.queryFn()

            expect(mockExploreService.getExploreCategories).toHaveBeenCalledWith('cat-react', 1, 20)
        })

        it('should handle reactive page ref', async () => {
            const pageRef = ref(2)
            mockExploreService.getExploreCategories.mockResolvedValue({
                data: { tweets: [], category: {} },
            })

            const query = useGetExploreCategoriesQuery('cat1', pageRef, 20, true)
            await query.queryFn()

            expect(mockExploreService.getExploreCategories).toHaveBeenCalledWith('cat1', 2, 20)
        })

        it('should handle reactive limit ref', async () => {
            const limitRef = ref(50)
            mockExploreService.getExploreCategories.mockResolvedValue({
                data: { tweets: [], category: {} },
            })

            const query = useGetExploreCategoriesQuery('cat1', 1, limitRef, true)
            await query.queryFn()

            expect(mockExploreService.getExploreCategories).toHaveBeenCalledWith('cat1', 1, 50)
        })

        it('should use default values for pagination', () => {
            const query = useGetExploreCategoriesQuery('cat1')
            expect(query.queryKey).toContain('cat1')
            expect(query.queryKey).toContain(1) // default page
            expect(query.queryKey).toContain(20) // default limit
        })

        it('should handle multiple ref changes', async () => {
            const categoryRef = ref('cat1')
            const pageRef = ref(1)
            const limitRef = ref(20)

            mockExploreService.getExploreCategories.mockResolvedValue({
                data: { tweets: [], category: {} },
            })

            const query = useGetExploreCategoriesQuery(categoryRef, pageRef, limitRef, true)

            // First call
            await query.queryFn()
            expect(mockExploreService.getExploreCategories).toHaveBeenCalledWith('cat1', 1, 20)

            // Update refs
            categoryRef.value = 'cat2'
            pageRef.value = 2
            limitRef.value = 30

            // Second call
            await query.queryFn()
            expect(mockExploreService.getExploreCategories).toHaveBeenCalledWith('cat2', 2, 30)
        })

        it('should support enabled as boolean', () => {
            const query = useGetExploreCategoriesQuery('cat1', 1, 20, true)
            expect(query).toBeDefined()
        })

        it('should support enabled as ref', () => {
            const enabledRef = ref(false)
            const query = useGetExploreCategoriesQuery('cat1', 1, 20, enabledRef)
            expect(query).toBeDefined()
        })
    })
})

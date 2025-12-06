import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'

// Setup mocks before importing the module under test
const mockUseInfiniteQuery = vi.fn()
const mockUseQuery = vi.fn()
const mockUseNuxtApp = vi.fn()
let useTweetsQuery: unknown
let useTweetDetailsQuery: unknown

vi.mock('@tanstack/vue-query', () => ({
    useInfiniteQuery: mockUseInfiniteQuery,
    useQuery: mockUseQuery,
}))
vi.mock('#app', () => ({
    useNuxtApp: mockUseNuxtApp,
}))

describe('useTweetQueries', () => {
    let mockTweetService: unknown

    beforeEach(async () => {
        // Dynamically import the module after mocks are set up
        const module = await import('../../queries/useTweetQueries')
        useTweetsQuery = module.useTweetsQuery
        useTweetDetailsQuery = module.useTweetDetailsQuery

        // Clear all mocks
        vi.clearAllMocks()

        // Setup mock tweet service
        mockTweetService = {
            fetchTweets: vi.fn().mockResolvedValue([]),
            fetchTweetDetails: vi.fn().mockResolvedValue(null),
            fetchtweetreplies: vi.fn().mockResolvedValue([]),
        }

        // Mock useNuxtApp to return our mock service
        mockUseNuxtApp.mockReturnValue({
            $tweetService: mockTweetService,
        })

        // Reset useQuery mock implementation
        mockUseInfiniteQuery.mockImplementation((_options: unknown) => {
            return {
                data: ref({ pages: [] }),
                isPending: ref(false),
                isFetching: ref(false),
                error: ref(null),
                fetchNextPage: vi.fn(),
                hasNextPage: ref(false),
                isFetchingNextPage: ref(false),
            }
        })

        mockUseQuery.mockImplementation((_options: unknown) => {
            return {
                data: ref(null),
                isLoading: ref(false),
                error: ref(null),
            }
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('useTweetsQuery', () => {
        it('generates correct query key with path', () => {
            const path = ref('/timeline')
            useTweetsQuery(path)

            expect(mockUseInfiniteQuery).toHaveBeenCalled()
            const options = mockUseInfiniteQuery.mock.calls[0]?.[0]
            // Query key should be computed, so we need to access its value
            expect(options.queryKey.value).toEqual(['tweets', '/timeline'])
        })

        it('generates correct query key with string path', () => {
            useTweetsQuery('/home')

            const options = mockUseInfiniteQuery.mock.calls[0]?.[0]
            expect(options.queryKey.value).toEqual(['tweets', '/home'])
        })

        it('calls fetchTweets with correct path', async () => {
            const path = ref('/timeline')
            const localMockTweetService = {
                fetchTweets: vi.fn().mockResolvedValue([]),
            }
            mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
            useTweetsQuery(path)

            const options = mockUseInfiniteQuery.mock.calls[0]?.[0]
            await options.queryFn({ pageParam: '' })

            expect(localMockTweetService.fetchTweets).toHaveBeenCalledWith('/timeline', '')
        })

        it('calls fetchTweets with correct path (string)', async () => {
            const path = '/test-path'
            const localMockTweetService = {
                fetchTweets: vi.fn().mockResolvedValue([]),
            }
            mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
            useTweetsQuery(path)

            const options = mockUseInfiniteQuery.mock.calls[0]?.[0]
            await options.queryFn({ pageParam: '' })

            expect(localMockTweetService.fetchTweets).toHaveBeenCalledWith('/test-path', '')
        })
    })

    it('handles empty path', async () => {
        const path = ref('')
        const localMockTweetService = {
            fetchTweets: vi.fn().mockResolvedValue([]),
        }
        mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
        useTweetsQuery(path)

        const options = mockUseInfiniteQuery.mock.calls[0]?.[0]
        await options.queryFn({ pageParam: '' })

        expect(localMockTweetService.fetchTweets).toHaveBeenCalledWith('', '')
    })

    it('handles different path values', async () => {
        const testPaths = ['/timeline', '/user/alice', '/tweets/trending', '/search']
        for (const testPath of testPaths) {
            vi.clearAllMocks()
            const localMockTweetService = {
                fetchTweets: vi.fn().mockResolvedValue([]),
            }
            mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
            useTweetsQuery(testPath)

            const options = mockUseInfiniteQuery.mock.calls[0]?.[0]
            expect(options.queryKey.value).toEqual(['tweets', testPath])

            await options.queryFn({ pageParam: '' })
            expect(localMockTweetService.fetchTweets).toHaveBeenCalledWith(testPath, '')
        }
    })
})

describe('useTweetDetailsQuery', () => {
    it('generates correct query key with tweetId', () => {
        useTweetDetailsQuery('tweet123')

        expect(mockUseQuery).toHaveBeenCalled()
        const options = mockUseQuery.mock.calls[0]?.[0]
        expect(options.queryKey).toEqual(['tweetDetails', 'tweet123'])
    })

    it('calls fetchTweetDetails with correct tweetId', async () => {
        vi.clearAllMocks()
        const localMockTweetService = {
            fetchTweetDetails: vi.fn().mockResolvedValue(null),
            fetchtweetreplies: vi.fn().mockResolvedValue([]),
        }
        mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
        useTweetDetailsQuery('tweet123')

        const options = mockUseQuery.mock.calls[0]?.[0]
        await options.queryFn()

        expect(localMockTweetService.fetchTweetDetails).toHaveBeenCalledWith('tweet123')
    })

    it('is enabled only when tweetId is provided', () => {
        useTweetDetailsQuery('tweet123')
        const enabledOptions = mockUseQuery.mock.calls[0]?.[0]
        expect(enabledOptions.enabled).toBe(true)

        vi.clearAllMocks()

        useTweetDetailsQuery('')
        const disabledOptions = mockUseQuery.mock.calls[0]?.[0]
        expect(disabledOptions.enabled).toBe(false)
    })

    it('handles different tweetId values', async () => {
        const testIds = ['tweet1', 'tweet2', 'abc123', 'xyz789']
        for (const testId of testIds) {
            vi.clearAllMocks()
            const localMockTweetService = {
                fetchTweetDetails: vi.fn().mockResolvedValue(null),
            }
            mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
            useTweetDetailsQuery(testId)

            const options = mockUseQuery.mock.calls[0]?.[0]
            expect(options.queryKey).toEqual(['tweetDetails', testId])

            await options.queryFn()
            expect(localMockTweetService.fetchTweetDetails).toHaveBeenCalledWith(testId)
        }
    })
})

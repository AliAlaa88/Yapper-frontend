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
    // Provide a basic mock for useMutation so imports don't fail,
    // but we will override or inspect calls in tests
    useMutation: vi.fn((opts) => opts),
    useQueryClient: vi.fn(() => ({
        invalidateQueries: vi.fn(),
        setQueriesData: vi.fn(),
        setQueryData: vi.fn(),
    })),
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
            // When path is /search, it gets duplicated due to splice logic in source
            const expectedKey =
                testPath === '/search' ? ['tweets', '/search', '/search'] : ['tweets', testPath]
            expect(options.queryKey.value).toEqual(expectedKey)

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

describe('useTweetSummaryQuery', () => {
    it('calls fetchTweetSummary with correct tweetId', async () => {
        vi.clearAllMocks()
        const localMockTweetService = {
            fetchTweetSummary: vi.fn().mockResolvedValue({ summary: 'test' }),
        }
        mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
        const { useTweetSummaryQuery } = await import('../../queries/useTweetQueries')

        useTweetSummaryQuery('tweet123')

        const options = mockUseQuery.mock.calls[0]?.[0]
        await options.queryFn()

        expect(localMockTweetService.fetchTweetSummary).toHaveBeenCalledWith('tweet123')
    })
})

describe('Mutation Queries', () => {
    let mutateTweetLikesQuery: any
    let mutateTweetRepostsQuery: any
    let mutateTweetBookmarkQuery: any
    let useDeleteTweetMutation: any
    let useUpdateTweetMutation: any
    let localMockTweetService: any
    let localMockQueryClient: any

    beforeEach(async () => {
        const module = await import('../../queries/useTweetQueries')
        mutateTweetLikesQuery = module.mutateTweetLikesQuery
        mutateTweetRepostsQuery = module.mutateTweetRepostsQuery
        mutateTweetBookmarkQuery = module.mutateTweetBookmarkQuery
        useDeleteTweetMutation = module.useDeleteTweetMutation
        useUpdateTweetMutation = module.useUpdateTweetMutation

        localMockTweetService = {
            likeTweet: vi.fn(),
            unlikeTweet: vi.fn(),
            repostTweet: vi.fn(),
            unrepostTweet: vi.fn(),
            bookmarkTweet: vi.fn(),
            unbookmarkTweet: vi.fn(),
            deleteTweet: vi.fn(),
            updateTweet: vi.fn(),
        }

        localMockQueryClient = {
            setQueryData: vi.fn(),
            setQueriesData: vi.fn(),
            invalidateQueries: vi.fn(),
        }

        mockUseNuxtApp.mockReturnValue({
            $tweetService: localMockTweetService,
            $queryClient: localMockQueryClient,
            $userStore: { getUser: () => ({ user_id: 'me' }) },
        })
    })

    it('mutateTweetLikesQuery calls like/unlike', async () => {
        vi.clearAllMocks()
        mutateTweetLikesQuery('t1', true)
        const options = (vi.mocked(await import('@tanstack/vue-query')).useMutation as any).mock
            .calls[0][0]

        await options.mutationFn(true)
        expect(localMockTweetService.likeTweet).toHaveBeenCalledWith('t1')

        await options.mutationFn(false)
        expect(localMockTweetService.unlikeTweet).toHaveBeenCalledWith('t1')
    })

    it('mutateTweetRepostsQuery calls repost/unrepost', async () => {
        vi.clearAllMocks()
        mutateTweetRepostsQuery('t1', true, '/path')
        const options = (vi.mocked(await import('@tanstack/vue-query')).useMutation as any).mock
            .calls[0][0]

        await options.mutationFn(true)
        expect(localMockTweetService.repostTweet).toHaveBeenCalledWith('t1')

        await options.mutationFn(false)
        expect(localMockTweetService.unrepostTweet).toHaveBeenCalledWith('t1')
    })

    it('mutateTweetBookmarkQuery calls bookmark/unbookmark', async () => {
        vi.clearAllMocks()
        mutateTweetBookmarkQuery('t1', true)
        const options = (vi.mocked(await import('@tanstack/vue-query')).useMutation as any).mock
            .calls[0][0]

        await options.mutationFn(true)
        expect(localMockTweetService.bookmarkTweet).toHaveBeenCalledWith('t1')

        await options.mutationFn(false)
        expect(localMockTweetService.unbookmarkTweet).toHaveBeenCalledWith('t1')
    })

    it('useDeleteTweetMutation calls deleteTweet', async () => {
        vi.clearAllMocks()
        useDeleteTweetMutation('t1', 'parent1')
        const options = (vi.mocked(await import('@tanstack/vue-query')).useMutation as any).mock
            .calls[0][0]

        await options.mutationFn()
        expect(localMockTweetService.deleteTweet).toHaveBeenCalledWith('t1')
    })

    it('useUpdateTweetMutation calls updateTweet', async () => {
        vi.clearAllMocks()
        useUpdateTweetMutation('t1')
        const options = (vi.mocked(await import('@tanstack/vue-query')).useMutation as any).mock
            .calls[0][0]

        await options.mutationFn('new content')
        expect(localMockTweetService.updateTweet).toHaveBeenCalledWith('t1', 'new content')
    })
})

describe('Other Queries', () => {
    it('useTweetQuotesQuery calls fetchtweetquotes', async () => {
        vi.clearAllMocks()
        const localMockTweetService = {
            fetchtweetquotes: vi.fn().mockResolvedValue([]),
        }
        mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
        const { useTweetQuotesQuery } = await import('../../queries/useTweetQueries')

        useTweetQuotesQuery('t1')
        const options = mockUseQuery.mock.calls[0]?.[0]
        await options.queryFn()
        expect(localMockTweetService.fetchtweetquotes).toHaveBeenCalledWith('t1')
    })

    it('useTweetRepostsQuery calls fetchTweetReposts', async () => {
        vi.clearAllMocks()
        const localMockTweetService = {
            fetchTweetReposts: vi.fn().mockResolvedValue([]),
        }
        mockUseNuxtApp.mockReturnValue({ $tweetService: localMockTweetService })
        const { useTweetRepostsQuery } = await import('../../queries/useTweetQueries')

        useTweetRepostsQuery('t1')
        const options = mockUseQuery.mock.calls[0]?.[0]
        await options.queryFn()
        expect(localMockTweetService.fetchTweetReposts).toHaveBeenCalledWith('t1')
    })
})

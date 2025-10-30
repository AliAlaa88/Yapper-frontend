import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'

// Mock dependencies BEFORE importing the module under test
const mockUseQuery = vi.fn()
const mockUseNuxtApp = vi.fn()
const mockUseRoute = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
  useQuery: mockUseQuery,
}))

vi.mock('#app', () => ({
  useNuxtApp: mockUseNuxtApp,
  useRoute: mockUseRoute,
}))

// Import AFTER mocking - use dynamic import to avoid hoisting issues
let useTweetsQuery: any
let useTweetQuery: any
let useTweetDetailsQuery: any
let useUserTweetsQuery: any
let useUserQuery: any

describe('useTweetQueries', () => {
  let mockTweetService: any

  beforeEach(async () => {
    // Dynamically import the module after mocks are set up
    const module = await import('../../queries/useTweetQueries')
    useTweetsQuery = module.useTweetsQuery
    useTweetQuery = module.useTweetQuery
    useTweetDetailsQuery = module.useTweetDetailsQuery
    useUserTweetsQuery = module.useUserTweetsQuery
    useUserQuery = module.useUserQuery

    // Clear all mocks
    vi.clearAllMocks()

    // Setup mock tweet service
    mockTweetService = {
      fetchTweets: vi.fn().mockResolvedValue([]),
      fetchUserTweets: vi.fn().mockResolvedValue([]),
      fetchLikedTweets: vi.fn().mockResolvedValue([]),
      fetchMediaTweets: vi.fn().mockResolvedValue([]),
      fetchReplies: vi.fn().mockResolvedValue([]),
      fetchTweetById: vi.fn().mockResolvedValue(null),
      fetchTweetDetails: vi.fn().mockResolvedValue(null),
      fetchUserById: vi.fn().mockResolvedValue(null),
    }

    // Mock useNuxtApp to return our mock service
    mockUseNuxtApp.mockReturnValue({
      $tweetService: mockTweetService,
    })

    // Mock useRoute with default values
    mockUseRoute.mockReturnValue({
      params: {},
    })

    // Reset useQuery mock implementation
    mockUseQuery.mockImplementation((options: any) => {
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
    it('generates correct query key for "all" when no fetchingSource provided', () => {
      useTweetsQuery()

      expect(mockUseQuery).toHaveBeenCalled()
      const options = mockUseQuery.mock.calls[0]?.[0]
      
      // Query key should be computed, so we need to access its value
      expect(options.queryKey.value).toEqual(['tweets', 'all'])
    })

    it('generates correct query key for "home" fetchingSource', () => {
      const fetchingSource = ref('home')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey.value).toEqual(['tweets', 'home'])
    })

    it('generates correct query key for "user" fetchingSource with username', () => {
      mockUseRoute.mockReturnValue({
        params: { username: 'johndoe' },
      })

      const fetchingSource = ref('user')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey.value).toEqual(['tweets', 'user', 'johndoe'])
    })

    it('generates correct query key for "likes" fetchingSource', () => {
      const fetchingSource = ref('likes')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey.value).toEqual(['tweets', 'likes'])
    })

    it('generates correct query key for "media" fetchingSource', () => {
      const fetchingSource = ref('media')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey.value).toEqual(['tweets', 'media'])
    })

    it('generates correct query key for "replies" fetchingSource', () => {
      const fetchingSource = ref('replies')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey.value).toEqual(['tweets', 'replies'])
    })

    it('calls fetchTweets() for "home" fetchingSource', async () => {
      const fetchingSource = ref('home')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchTweets).toHaveBeenCalled()
    })

    it('calls fetchUserTweets() for "user" fetchingSource with username', async () => {
      mockUseRoute.mockReturnValue({
        params: { username: 'johndoe' },
      })

      const fetchingSource = ref('user')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchUserTweets).toHaveBeenCalledWith('johndoe')
    })

    it('calls fetchLikedTweets() for "likes" fetchingSource', async () => {
      const fetchingSource = ref('likes')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchLikedTweets).toHaveBeenCalled()
    })

    it('calls fetchMediaTweets() for "media" fetchingSource', async () => {
      const fetchingSource = ref('media')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchMediaTweets).toHaveBeenCalled()
    })

    it('calls fetchReplies() for "replies" fetchingSource', async () => {
      const fetchingSource = ref('replies')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchReplies).toHaveBeenCalled()
    })

    it('calls fetchTweets() when fetchingSource is null', async () => {
      const fetchingSource = ref(null)
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchTweets).toHaveBeenCalled()
    })

    it('falls back to fetchTweets() when service method does not exist', async () => {
      // Create a service without fetchUserTweets
      const fallbackService = {
        fetchTweets: vi.fn().mockResolvedValue([]),
      }
      
      mockUseNuxtApp.mockReturnValue({
        $tweetService: fallbackService,
      })

      const fetchingSource = ref('user')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(fallbackService.fetchTweets).toHaveBeenCalled()
    })

    it('query key is reactive to fetchingSource changes', () => {
      const fetchingSource = ref('home')
      useTweetsQuery(fetchingSource)

      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey.value).toEqual(['tweets', 'home'])

      // Change the source
      fetchingSource.value = 'likes'
      expect(options.queryKey.value).toEqual(['tweets', 'likes'])
    })
  })

  describe('useTweetQuery', () => {
    it('generates correct query key with tweetId', () => {
      useTweetQuery('tweet123')

      expect(mockUseQuery).toHaveBeenCalled()
      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey).toEqual(['tweet', 'tweet123'])
    })

    it('calls fetchTweetById with correct tweetId', async () => {
      useTweetQuery('tweet123')

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchTweetById).toHaveBeenCalledWith('tweet123')
    })

    it('is enabled only when tweetId is provided', () => {
      useTweetQuery('tweet123')
      const enabledOptions = mockUseQuery.mock.calls[0]?.[0]
      expect(enabledOptions.enabled).toBe(true)

      vi.clearAllMocks()

      useTweetQuery('')
      const disabledOptions = mockUseQuery.mock.calls[0]?.[0]
      expect(disabledOptions.enabled).toBe(false)
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
      useTweetDetailsQuery('tweet123')

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchTweetDetails).toHaveBeenCalledWith('tweet123')
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
  })

  describe('useUserTweetsQuery', () => {
    it('generates correct query key with userId', () => {
      useUserTweetsQuery('user123')

      expect(mockUseQuery).toHaveBeenCalled()
      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey).toEqual(['userTweets', 'user123'])
    })

    it('calls fetchUserTweets with correct userId', async () => {
      useUserTweetsQuery('user123')

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchUserTweets).toHaveBeenCalledWith('user123')
    })

    it('is enabled only when userId is provided', () => {
      useUserTweetsQuery('user123')
      const enabledOptions = mockUseQuery.mock.calls[0]?.[0]
      expect(enabledOptions.enabled).toBe(true)

      vi.clearAllMocks()

      useUserTweetsQuery('')
      const disabledOptions = mockUseQuery.mock.calls[0]?.[0]
      expect(disabledOptions.enabled).toBe(false)
    })
  })

  describe('useUserQuery', () => {
    it('generates correct query key with userId', () => {
      useUserQuery('user123')

      expect(mockUseQuery).toHaveBeenCalled()
      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey).toEqual(['user', 'user123'])
    })

    it('calls fetchUserById with correct userId', async () => {
      useUserQuery('user123')

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchUserById).toHaveBeenCalledWith('user123')
    })

    it('is enabled only when userId is provided', () => {
      useUserQuery('user123')
      const enabledOptions = mockUseQuery.mock.calls[0]?.[0]
      expect(enabledOptions.enabled).toBe(true)

      vi.clearAllMocks()

      useUserQuery('')
      const disabledOptions = mockUseQuery.mock.calls[0]?.[0]
      expect(disabledOptions.enabled).toBe(false)
    })
  })
})

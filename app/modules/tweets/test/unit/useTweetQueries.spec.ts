import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'

// Mock dependencies BEFORE importing the module under test
const mockUseQuery = vi.fn()
const mockUseNuxtApp = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
  useQuery: mockUseQuery,
}))

vi.mock('#app', () => ({
  useNuxtApp: mockUseNuxtApp,
}))

// Import AFTER mocking - use dynamic import to avoid hoisting issues
let useTweetsQuery: any
let useTweetDetailsQuery: any

describe('useTweetQueries', () => {
  let mockTweetService: any

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
    }

    // Mock useNuxtApp to return our mock service
    mockUseNuxtApp.mockReturnValue({
      $tweetService: mockTweetService,
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
    it('generates correct query key with path', () => {
      const path = ref('/timeline')
      useTweetsQuery(path)

      expect(mockUseQuery).toHaveBeenCalled()
      const options = mockUseQuery.mock.calls[0]?.[0]
      
      // Query key should be computed, so we need to access its value
      expect(options.queryKey.value).toEqual(['tweets', '/timeline'])
    })

    it('generates correct query key with string path', () => {
      useTweetsQuery('/home')

      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey.value).toEqual(['tweets', '/home'])
    })

    it('calls fetchTweets with correct path', async () => {
      const path = ref('/timeline')
      useTweetsQuery(path)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchTweets).toHaveBeenCalledWith('/timeline')
    })

    it('calls fetchTweets with string path', async () => {
      useTweetsQuery('/home')

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchTweets).toHaveBeenCalledWith('/home')
    })

    it('query key is reactive to path changes', () => {
      const path = ref('/timeline')
      useTweetsQuery(path)

      const options = mockUseQuery.mock.calls[0]?.[0]
      expect(options.queryKey.value).toEqual(['tweets', '/timeline'])

      // Change the path
      path.value = '/user/johndoe'
      expect(options.queryKey.value).toEqual(['tweets', '/user/johndoe'])
    })

    it('handles empty path', async () => {
      const path = ref('')
      useTweetsQuery(path)

      const options = mockUseQuery.mock.calls[0]?.[0]
      await options.queryFn()

      expect(mockTweetService.fetchTweets).toHaveBeenCalledWith('')
    })

    it('handles different path values', async () => {
      const testPaths = ['/timeline', '/user/alice', '/tweets/trending', '/search']
      
      for (const testPath of testPaths) {
        vi.clearAllMocks()
        useTweetsQuery(testPath)

        const options = mockUseQuery.mock.calls[0]?.[0]
        expect(options.queryKey.value).toEqual(['tweets', testPath])
        
        await options.queryFn()
        expect(mockTweetService.fetchTweets).toHaveBeenCalledWith(testPath)
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

    it('handles different tweetId values', async () => {
      const testIds = ['tweet1', 'tweet2', 'abc123', 'xyz789']
      
      for (const testId of testIds) {
        vi.clearAllMocks()
        useTweetDetailsQuery(testId)

        const options = mockUseQuery.mock.calls[0]?.[0]
        expect(options.queryKey).toEqual(['tweetDetails', testId])
        
        await options.queryFn()
        expect(mockTweetService.fetchTweetDetails).toHaveBeenCalledWith(testId)
      }
    })
  })
})

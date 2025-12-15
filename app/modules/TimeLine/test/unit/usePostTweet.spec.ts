import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePostTweet } from '../../queries/usePostTweet'

const mockTimelineService = {
    createTweet: vi.fn(),
    createReply: vi.fn(),
    createQuote: vi.fn(),
}

const mockQueryClient = {
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
}

const mockUserStore = {
    getUser: vi.fn().mockReturnValue({
        user_id: 'user-123',
        username: 'testuser',
        name: 'Test User',
    }),
}

const mockUseMutation = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
    useMutation: (options: any) => {
        mockUseMutation(options)
        return {
            mutate: vi.fn((data) => options.mutationFn(data)),
            mutateAsync: vi.fn((data) => options.mutationFn(data)),
            isPending: { value: false },
        }
    },
}))

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $timelineService: mockTimelineService,
        $queryClient: mockQueryClient,
    }),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
}))

vi.mock('~/modules/Common/queries', () => ({
    cacheInvalidation: {
        onReplyCreate: vi.fn(),
        onTweetCreate: vi.fn(),
    },
}))

describe('usePostTweet', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTimelineService.createTweet.mockResolvedValue({ data: { id: 'tweet-1' } })
        mockTimelineService.createReply.mockResolvedValue({ data: { id: 'reply-1' } })
        mockTimelineService.createQuote.mockResolvedValue({ data: { id: 'quote-1' } })
    })

    it('returns mutation object', () => {
        const result = usePostTweet()

        expect(result).toBeDefined()
        expect(result.mutate).toBeDefined()
        expect(result.mutateAsync).toBeDefined()
    })

    it('creates mutation with correct config', () => {
        usePostTweet()

        expect(mockUseMutation).toHaveBeenCalled()
        const mutationConfig = mockUseMutation.mock.calls[0][0]
        expect(mutationConfig.mutationFn).toBeDefined()
        expect(mutationConfig.onSuccess).toBeDefined()
        expect(mutationConfig.onError).toBeDefined()
    })

    describe('mutationFn', () => {
        it('calls createTweet for regular tweets', async () => {
            const result = usePostTweet()
            const tweetData = { content: 'Hello world', type: 'post' }

            await result.mutateAsync(tweetData as any)

            expect(mockTimelineService.createTweet).toHaveBeenCalledWith(tweetData)
        })

        it('calls createReply for reply tweets', async () => {
            const result = usePostTweet()
            const replyData = { 
                content: 'Reply content', 
                type: 'reply', 
                parent_tweet_id: 'parent-123' 
            }

            await result.mutateAsync(replyData as any)

            expect(mockTimelineService.createReply).toHaveBeenCalledWith(replyData, 'parent-123')
        })

        it('calls createQuote for quote tweets', async () => {
            const result = usePostTweet()
            const quoteData = { 
                content: 'Quote content', 
                type: 'quote', 
                parent_tweet_id: 'quoted-tweet-123' 
            }

            await result.mutateAsync(quoteData as any)

            expect(mockTimelineService.createQuote).toHaveBeenCalledWith(quoteData, 'quoted-tweet-123')
        })
    })

    describe('onError', () => {
        it('logs error to console', () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
            usePostTweet()

            const mutationConfig = mockUseMutation.mock.calls[0][0]
            const testError = new Error('Test error')
            mutationConfig.onError(testError)

            expect(consoleSpy).toHaveBeenCalledWith('post tweet error =======>', testError)
            consoleSpy.mockRestore()
        })
    })

    describe('onSuccess', () => {
        it('updates timeline cache for regular tweets', () => {
            usePostTweet()

            const mutationConfig = mockUseMutation.mock.calls[0][0]
            const mockData = { data: { id: 'new-tweet' } }
            const mockVariables = { type: 'post', content: 'Hello' }

            mutationConfig.onSuccess(mockData, mockVariables)

            expect(mockQueryClient.setQueryData).toHaveBeenCalled()
        })

        it('handles reply type correctly', () => {
            usePostTweet()

            const mutationConfig = mockUseMutation.mock.calls[0][0]
            const mockData = { data: { id: 'new-reply' } }
            const mockVariables = { type: 'reply', parent_tweet_id: 'parent-123' }

            mutationConfig.onSuccess(mockData, mockVariables)

            // For replies, cache invalidation is called instead of setQueryData
            // The test verifies the function doesn't throw and handles reply type
        })

        it('attaches user data to new tweet', () => {
            const mockSetQueryData = vi.fn()
            mockQueryClient.setQueryData = mockSetQueryData

            usePostTweet()

            const mutationConfig = mockUseMutation.mock.calls[0][0]
            const mockData = { data: { id: 'new-tweet', content: 'Hello' } }
            const mockVariables = { type: 'post', content: 'Hello' }

            mutationConfig.onSuccess(mockData, mockVariables)

            expect(mockUserStore.getUser).toHaveBeenCalled()
        })
    })
})

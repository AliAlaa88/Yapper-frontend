import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAxios = {
    post: vi.fn(),
}

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $axios: mockAxios,
    }),
}))

const { timelineService } = await import('./timelineService')

describe('timelineService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createTweet', () => {
        it('should post tweet data to /tweets endpoint', async () => {
            const tweetBody = {
                content: 'Hello world',
                attachments: [],
            }
            const mockResponse = { data: { ...tweetBody, id: '123' } }
            mockAxios.post.mockResolvedValue(mockResponse)

            const result = await timelineService.createTweet(tweetBody)

            expect(mockAxios.post).toHaveBeenCalledWith('/tweets', tweetBody)
            expect(result).toEqual(mockResponse.data)
        })

        it('should handle errors when creating tweet', async () => {
            const tweetBody = { content: 'Test', attachments: [] }
            const error = new Error('Network error')
            mockAxios.post.mockRejectedValue(error)

            await expect(timelineService.createTweet(tweetBody)).rejects.toThrow('Network error')
        })

        it('should return tweet with id from server', async () => {
            const tweetBody = { content: 'Test tweet', attachments: [] }
            const serverResponse = {
                data: {
                    id: 'tweet-123',
                    content: 'Test tweet',
                    attachments: [],
                    created_at: '2025-12-15T10:00:00Z',
                },
            }
            mockAxios.post.mockResolvedValue(serverResponse)

            const result = await timelineService.createTweet(tweetBody)

            expect(result.id).toBe('tweet-123')
            expect(result.created_at).toBeDefined()
        })
    })

    describe('createReply', () => {
        it('should post reply to correct endpoint', async () => {
            const tweetBody = { content: 'This is a reply', attachments: [] }
            const parentTweetId = 'parent-123'
            const mockResponse = { data: { ...tweetBody, id: 'reply-456', parent_id: parentTweetId } }
            mockAxios.post.mockResolvedValue(mockResponse)

            const result = await timelineService.createReply(tweetBody, parentTweetId)

            expect(mockAxios.post).toHaveBeenCalledWith(`tweets/${parentTweetId}/reply`, tweetBody)
            expect(result).toEqual(mockResponse.data)
        })

        it('should include parent_tweet_id in request', async () => {
            const tweetBody = { content: 'Reply content', attachments: [] }
            const parentTweetId = 'tweet-789'
            mockAxios.post.mockResolvedValue({ data: {} })

            await timelineService.createReply(tweetBody, parentTweetId)

            expect(mockAxios.post).toHaveBeenCalledWith(`tweets/${parentTweetId}/reply`, tweetBody)
        })

        it('should handle reply creation errors', async () => {
            const tweetBody = { content: 'Reply', attachments: [] }
            const parentTweetId = 'parent-123'
            mockAxios.post.mockRejectedValue(new Error('Parent tweet not found'))

            await expect(timelineService.createReply(tweetBody, parentTweetId)).rejects.toThrow(
                'Parent tweet not found'
            )
        })

        it('should return reply with parent_id', async () => {
            const tweetBody = { content: 'This is a reply', attachments: [] }
            const parentTweetId = 'parent-456'
            const serverResponse = {
                data: {
                    id: 'reply-789',
                    content: 'This is a reply',
                    parent_id: parentTweetId,
                    attachments: [],
                },
            }
            mockAxios.post.mockResolvedValue(serverResponse)

            const result = await timelineService.createReply(tweetBody, parentTweetId)

            expect(result.parent_id).toBe(parentTweetId)
            expect(result.id).toBe('reply-789')
        })
    })

    describe('createQuote', () => {
        it('should post quote to correct endpoint', async () => {
            const tweetBody = { content: 'This is a quote tweet', attachments: [] }
            const parentTweetId = 'quoted-tweet-123'
            const mockResponse = {
                data: { ...tweetBody, id: 'quote-456', quoted_tweet_id: parentTweetId },
            }
            mockAxios.post.mockResolvedValue(mockResponse)

            const result = await timelineService.createQuote(tweetBody, parentTweetId)

            expect(mockAxios.post).toHaveBeenCalledWith(`tweets/${parentTweetId}/quote`, tweetBody)
            expect(result).toEqual(mockResponse.data)
        })

        it('should include quoted_tweet_id in request', async () => {
            const tweetBody = { content: 'Quote tweet content', attachments: [] }
            const parentTweetId = 'original-tweet-789'
            mockAxios.post.mockResolvedValue({ data: {} })

            await timelineService.createQuote(tweetBody, parentTweetId)

            expect(mockAxios.post).toHaveBeenCalledWith(`tweets/${parentTweetId}/quote`, tweetBody)
        })

        it('should handle quote creation errors', async () => {
            const tweetBody = { content: 'Quote', attachments: [] }
            const parentTweetId = 'quote-123'
            mockAxios.post.mockRejectedValue(new Error('Original tweet not found'))

            await expect(timelineService.createQuote(tweetBody, parentTweetId)).rejects.toThrow(
                'Original tweet not found'
            )
        })

        it('should return quote with quoted_tweet_id', async () => {
            const tweetBody = { content: 'Great tweet', attachments: [] }
            const parentTweetId = 'tweet-999'
            const serverResponse = {
                data: {
                    id: 'quote-111',
                    content: 'Great tweet',
                    quoted_tweet_id: parentTweetId,
                    attachments: [],
                },
            }
            mockAxios.post.mockResolvedValue(serverResponse)

            const result = await timelineService.createQuote(tweetBody, parentTweetId)

            expect(result.quoted_tweet_id).toBe(parentTweetId)
            expect(result.id).toBe('quote-111')
        })
    })
})

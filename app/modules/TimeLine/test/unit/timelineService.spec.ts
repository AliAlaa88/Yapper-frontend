import { describe, it, expect, vi, beforeEach } from 'vitest'
import { timelineService } from '../../services/timelineService'
import type { TweetBody } from '../../types/tweetBody'

const mockAxios = {
    post: vi.fn(),
}

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $axios: mockAxios,
    }),
}))

describe('timelineService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createTweet', () => {
        it('should post a tweet successfully', async () => {
            const tweetData: TweetBody = {
                content: 'Hello World!',
                images: [],
                videos: [],
            }

            const expectedResponse = {
                ...tweetData,
                id: 'tweet-1',
                date: '2025-12-14T10:00:00Z',
            }

            mockAxios.post.mockResolvedValueOnce({ data: expectedResponse })

            const result = await timelineService.createTweet(tweetData)

            expect(mockAxios.post).toHaveBeenCalledWith('/tweets', tweetData)
            expect(result).toEqual(expectedResponse)
        })

        it('should handle tweet creation with images', async () => {
            const tweetData: TweetBody = {
                content: 'Check out this image!',
                images: ['image1.jpg', 'image2.jpg'],
                videos: [],
            }

            const expectedResponse = {
                ...tweetData,
                id: 'tweet-2',
                date: '2025-12-14T10:00:00Z',
            }

            mockAxios.post.mockResolvedValueOnce({ data: expectedResponse })

            const result = await timelineService.createTweet(tweetData)

            expect(mockAxios.post).toHaveBeenCalledWith('/tweets', tweetData)
            expect(result.images).toEqual(['image1.jpg', 'image2.jpg'])
        })

        it('should throw error when tweet creation fails', async () => {
            const tweetData: TweetBody = {
                content: 'Failed tweet',
                images: [],
                videos: [],
            }

            const error = new Error('Network error')
            mockAxios.post.mockRejectedValueOnce(error)

            await expect(timelineService.createTweet(tweetData)).rejects.toThrow('Network error')
        })
    })

    describe('createReply', () => {
        it('should post a reply successfully', async () => {
            const tweetData: TweetBody = {
                content: 'This is a reply!',
                images: [],
                videos: [],
            }

            const parentTweetId = 'parent-tweet-1'

            const expectedResponse = {
                ...tweetData,
                id: 'reply-1',
                parent_tweet_id: parentTweetId,
                date: '2025-12-14T10:00:00Z',
            }

            mockAxios.post.mockResolvedValueOnce({ data: expectedResponse })

            const result = await timelineService.createReply(tweetData, parentTweetId)

            expect(mockAxios.post).toHaveBeenCalledWith(`tweets/${parentTweetId}/reply`, tweetData)
            expect(result).toEqual(expectedResponse)
        })

        it('should handle reply with media', async () => {
            const tweetData: TweetBody = {
                content: 'Reply with image',
                images: ['reply-image.jpg'],
                videos: [],
            }

            const parentTweetId = 'parent-tweet-2'

            const expectedResponse = {
                ...tweetData,
                id: 'reply-2',
                parent_tweet_id: parentTweetId,
            }

            mockAxios.post.mockResolvedValueOnce({ data: expectedResponse })

            const result = await timelineService.createReply(tweetData, parentTweetId)

            expect(mockAxios.post).toHaveBeenCalledWith(`tweets/${parentTweetId}/reply`, tweetData)
            expect(result.images).toEqual(['reply-image.jpg'])
        })

        it('should throw error when reply creation fails', async () => {
            const tweetData: TweetBody = {
                content: 'Failed reply',
                images: [],
                videos: [],
            }

            const error = new Error('Server error')
            mockAxios.post.mockRejectedValueOnce(error)

            await expect(timelineService.createReply(tweetData, 'parent-1')).rejects.toThrow(
                'Server error',
            )
        })
    })

    describe('createQuote', () => {
        it('should post a quote tweet successfully', async () => {
            const tweetData: TweetBody = {
                content: 'This is a great tweet!',
                images: [],
                videos: [],
            }

            const parentTweetId = 'parent-tweet-3'

            const expectedResponse = {
                ...tweetData,
                id: 'quote-1',
                parent_tweet_id: parentTweetId,
                type: 'quote',
                date: '2025-12-14T10:00:00Z',
            }

            mockAxios.post.mockResolvedValueOnce({ data: expectedResponse })

            const result = await timelineService.createQuote(tweetData, parentTweetId)

            expect(mockAxios.post).toHaveBeenCalledWith(`tweets/${parentTweetId}/quote`, tweetData)
            expect(result).toEqual(expectedResponse)
        })

        it('should handle quote with multiple images', async () => {
            const tweetData: TweetBody = {
                content: 'Quote with images',
                images: ['quote-image1.jpg', 'quote-image2.jpg'],
                videos: [],
            }

            const parentTweetId = 'parent-tweet-4'

            const expectedResponse = {
                ...tweetData,
                id: 'quote-2',
                parent_tweet_id: parentTweetId,
                type: 'quote',
            }

            mockAxios.post.mockResolvedValueOnce({ data: expectedResponse })

            const result = await timelineService.createQuote(tweetData, parentTweetId)

            expect(mockAxios.post).toHaveBeenCalledWith(`tweets/${parentTweetId}/quote`, tweetData)
            expect(result.images.length).toBe(2)
        })

        it('should throw error when quote creation fails', async () => {
            const tweetData: TweetBody = {
                content: 'Failed quote',
                images: [],
                videos: [],
            }

            const error = new Error('Quote creation failed')
            mockAxios.post.mockRejectedValueOnce(error)

            await expect(timelineService.createQuote(tweetData, 'parent-1')).rejects.toThrow(
                'Quote creation failed',
            )
        })
    })
})

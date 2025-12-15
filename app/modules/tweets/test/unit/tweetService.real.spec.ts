import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tweetServiceReal } from '../../services/tweetService.real'

// Setup global mocks
const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
}

// Mock #app module
vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $axios: mockAxios,
    }),
}))

// Also mock globalThis.useNuxtApp just in case the transpilation/setup uses it
globalThis.useNuxtApp = () =>
    ({
        $axios: mockAxios,
    }) as any

describe('tweetServiceReal', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('fetchTweets', () => {
        it('fetches and maps tweets correctly', async () => {
            const apiResponse = {
                data: {
                    data: [
                        { tweet_id: '1', content: 'test' },
                        { tweet_id: undefined }, // Should be filtered out
                    ],
                    pagination: {
                        next_cursor: 'next',
                        has_more: true,
                        parent: 'parent1',
                    }, // Handle pagination structure
                },
            }
            mockAxios.get.mockResolvedValue({ data: apiResponse })

            const result = await tweetServiceReal.fetchTweets('/users/feed', 'cursor123')

            expect(mockAxios.get).toHaveBeenCalledWith('/users/feed?cursor=cursor123')
            expect(result.data).toHaveLength(1)
            expect(result.data[0].tweet_id).toBe('1')
            expect(result.nextCursor).toBe('next')
            expect(result.hasMore).toBe(true)
            expect(result.parent).toBe('parent1')
        })

        it('handles cursor in existing query params', async () => {
            const apiResponse = {
                data: {
                    data: [],
                    next_cursor: null,
                    has_more: false,
                },
            }
            mockAxios.get.mockResolvedValue({ data: apiResponse })

            await tweetServiceReal.fetchTweets('/search?q=test', 'cursor123')

            expect(mockAxios.get).toHaveBeenCalledWith('/search?q=test&cursor=cursor123')
        })

        it('handles fetch with no cursor', async () => {
            const apiResponse = {
                data: {
                    data: [],
                    next_cursor: null,
                    has_more: false,
                },
            }
            mockAxios.get.mockResolvedValue({ data: apiResponse })

            await tweetServiceReal.fetchTweets('/home', '')
            expect(mockAxios.get).toHaveBeenCalledWith('/home')
        })
    })

    describe('fetchTweetDetails', () => {
        it('fetches tweet details successfully', async () => {
            const tweet = { tweet_id: '1', content: 'details' }
            mockAxios.get.mockResolvedValue({ data: { data: tweet } })

            const result = await tweetServiceReal.fetchTweetDetails('1')
            expect(mockAxios.get).toHaveBeenCalledWith('/tweets/1')
            expect(result).toEqual(tweet)
        })

        it('returns null on error', async () => {
            mockAxios.get.mockRejectedValue(new Error('Failed'))
            const result = await tweetServiceReal.fetchTweetDetails('1')
            expect(result).toBeNull()
        })

        it('returns null if no data', async () => {
            mockAxios.get.mockResolvedValue({ data: null })
            const result = await tweetServiceReal.fetchTweetDetails('1')
            expect(result).toBeNull()
        })
    })

    describe('fetchTweetSummary', () => {
        it('fetches summary successfully', async () => {
            const summary = { summary: 'summary text' }
            mockAxios.get.mockResolvedValue({ data: { data: summary } })
            const result = await tweetServiceReal.fetchTweetSummary('1')
            expect(mockAxios.get).toHaveBeenCalledWith('/tweets/1/summary')
            expect(result).toEqual(summary)
        })

        it('returns null on failure', async () => {
            mockAxios.get.mockResolvedValue({ data: null })
            const result = await tweetServiceReal.fetchTweetSummary('1')
            expect(result).toBeNull()
        })
    })

    describe('fetchtweetreplies', () => {
        it('fetches replies successfully', async () => {
            const replies = [{ tweet_id: '2', type: 'reply' }]
            mockAxios.get.mockResolvedValue({ data: { data: replies } })
            const result = await tweetServiceReal.fetchtweetreplies('1')
            expect(mockAxios.get).toHaveBeenCalledWith('/tweets/1/replies')
            expect(result).toEqual(replies)
        })

        it('returns empty array on error', async () => {
            mockAxios.get.mockRejectedValue(new Error('Failed'))
            const result = await tweetServiceReal.fetchtweetreplies('1')
            expect(result).toEqual([])
        })
    })

    describe('fetchtweetquotes', () => {
        it('fetches quotes successfully', async () => {
            const quotes = [{ tweet_id: '3', type: 'quote' }]
            mockAxios.get.mockResolvedValue({ data: { data: { data: quotes } } }) // matches api shape logic in real service
            const result = await tweetServiceReal.fetchtweetquotes('1')
            expect(mockAxios.get).toHaveBeenCalledWith('/tweets/1/quotes')
            expect(result).toEqual(quotes)
        })

        it('returns empty array on error', async () => {
            mockAxios.get.mockRejectedValue(new Error('Failed'))
            const result = await tweetServiceReal.fetchtweetquotes('1')
            expect(result).toEqual([])
        })
    })

    describe('fetchTweetReposts', () => {
        it('fetches reposts successfully', async () => {
            const reposts = [{ user_id: 'u1' }]
            mockAxios.get.mockResolvedValue({ data: { data: { data: reposts } } })
            const result = await tweetServiceReal.fetchTweetReposts('1')
            expect(mockAxios.get).toHaveBeenCalledWith('/tweets/1/reposts')
            expect(result).toEqual(reposts)
        })
        it('returns empty array on error', async () => {
            mockAxios.get.mockRejectedValue(new Error('Failed'))
            const result = await tweetServiceReal.fetchTweetReposts('1')
            expect(result).toEqual([])
        })
    })

    describe('Mutations', () => {
        it('likeTweet', async () => {
            await tweetServiceReal.likeTweet('1')
            expect(mockAxios.post).toHaveBeenCalledWith('/tweets/1/like')
        })

        it('unlikeTweet', async () => {
            await tweetServiceReal.unlikeTweet('1')
            expect(mockAxios.delete).toHaveBeenCalledWith('/tweets/1/like')
        })

        it('repostTweet', async () => {
            await tweetServiceReal.repostTweet('1')
            expect(mockAxios.post).toHaveBeenCalledWith('/tweets/1/repost')
        })

        it('unrepostTweet', async () => {
            await tweetServiceReal.unrepostTweet('1')
            expect(mockAxios.delete).toHaveBeenCalledWith('/tweets/1/repost')
        })

        it('bookmarkTweet', async () => {
            await tweetServiceReal.bookmarkTweet('1')
            expect(mockAxios.post).toHaveBeenCalledWith('/tweets/1/bookmark')
        })

        it('unbookmarkTweet', async () => {
            await tweetServiceReal.unbookmarkTweet('1')
            expect(mockAxios.delete).toHaveBeenCalledWith('/tweets/1/bookmark')
        })

        it('deleteTweet', async () => {
            await tweetServiceReal.deleteTweet('1')
            expect(mockAxios.delete).toHaveBeenCalledWith('/tweets/1')
        })

        it('updateTweet', async () => {
            await tweetServiceReal.updateTweet('1', 'new content')
            expect(mockAxios.patch).toHaveBeenCalledWith('/tweets/1', { content: 'new content' })
        })
    })

    describe('Unimplemented methods', () => {
        it('throws error for fetchTweetById', async () => {
            await expect(tweetServiceReal.fetchTweetById('1')).rejects.toThrow('not implemented')
        })
        it('throws error for fetchUserTweets', async () => {
            await expect(tweetServiceReal.fetchUserTweets('u1')).rejects.toThrow('not implemented')
        })
        it('throws error for fetchUserById', async () => {
            await expect(tweetServiceReal.fetchUserById('u1')).rejects.toThrow('not implemented')
        })
    })
})

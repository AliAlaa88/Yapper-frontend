import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tweetServiceMock } from '../../services/tweetService.mock'

// Mock #app module
const mockAxios = {
    get: vi.fn(),
}

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $axios: mockAxios,
    }),
}))

describe('tweetService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('fetchTweets', () => {
        it('fetches and maps tweets from server', async () => {
            const serverTweets = [
                {
                    post_id: 'tweet1',
                    content: 'Hello world',
                    user_id: 'user1',
                    username: 'john',
                    avatar_url: '/avatar1.jpg',
                    likes_count: 10,
                    replies_count: 5,
                    reposts_count: 2,
                    views: 100,
                    type: 'tweet',
                    date: '2025-10-17T12:00:00.000Z',
                    images_url: [],
                    videos_url: [],
                },
            ]

            const userData = {
                user_id: 'user1',
                name: 'John Doe',
                username: 'john',
            }

            mockAxios.get
                .mockResolvedValueOnce({ data: serverTweets })
                .mockResolvedValueOnce({ data: [userData] })

            const result = await tweetServiceMock.fetchTweets()

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets')
            expect(mockAxios.get).toHaveBeenCalledWith('/users?user_id=user1')
            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                id: 'tweet1',
                content: {
                    text: 'Hello world',
                    images: [],
                    videos: [],
                },
                user: {
                    id: 'user1',
                    name: 'John Doe',
                    username: 'john',
                },
                type: 'tweet',
            })
        })

        it('handles user fetch failure gracefully', async () => {
            const serverTweets = [
                {
                    post_id: 'tweet1',
                    content: 'Test tweet',
                    user_id: 'user1',
                    username: 'testuser',
                    avatar_url: '/avatar.jpg',
                    likes_count: 0,
                    replies_count: 0,
                    reposts_count: 0,
                    views: 0,
                    type: 'tweet',
                    date: '2025-10-17T12:00:00.000Z',
                    images_url: [],
                    videos_url: [],
                },
            ]

            mockAxios.get
                .mockResolvedValueOnce({ data: serverTweets })
                .mockRejectedValueOnce(new Error('User fetch failed'))

            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

            const result = await tweetServiceMock.fetchTweets()

            expect(result).toHaveLength(1)
            expect(result[0]!.user.name).toBe('testuser')
            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user data for tweet:', 'tweet1')

            consoleSpy.mockRestore()
        })

        it('maps tweet with images correctly', async () => {
            const serverTweets = [
                {
                    post_id: 'tweet2',
                    content: 'Check these images',
                    user_id: 'user2',
                    username: 'jane',
                    avatar_url: '/avatar2.jpg',
                    likes_count: 50,
                    replies_count: 10,
                    reposts_count: 5,
                    views: 500,
                    type: 'tweet',
                    date: '2025-10-18T14:30:00.000Z',
                    images_url: ['/img1.jpg', '/img2.jpg'],
                    videos_url: [],
                },
            ]

            mockAxios.get
                .mockResolvedValueOnce({ data: serverTweets })
                .mockResolvedValueOnce({ data: [{ name: 'Jane' }] })

            const result = await tweetServiceMock.fetchTweets()

            expect(result[0]!.content.images).toEqual(['/img1.jpg', '/img2.jpg'])
        })
    })

    describe('fetchTweetById', () => {
        it('fetches a single tweet by ID', async () => {
            const serverTweet = {
                post_id: 'tweet123',
                content: 'Single tweet',
                user_id: 'user123',
                username: 'singleuser',
                avatar_url: '/avatar.jpg',
                likes_count: 5,
                replies_count: 2,
                reposts_count: 1,
                views: 50,
                type: 'tweet',
                date: '2025-10-19T10:00:00.000Z',
                images_url: [],
                videos_url: [],
            }

            const userData = {
                name: 'Single User',
            }

            mockAxios.get
                .mockResolvedValueOnce({ data: [serverTweet] })
                .mockResolvedValueOnce({ data: [userData] })

            const result = await tweetServiceMock.fetchTweetById('tweet123')

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets?post_id=tweet123')
            expect(result).not.toBeNull()
            expect(result?.id).toBe('tweet123')
            expect(result?.user.name).toBe('Single User')
        })

        it('returns null when tweet is not found', async () => {
            mockAxios.get.mockResolvedValueOnce({ data: [] })

            const result = await tweetServiceMock.fetchTweetById('nonexistent')

            expect(result).toBeNull()
        })

        it('handles user fetch failure for single tweet', async () => {
            const serverTweet = {
                post_id: 'tweet456',
                content: 'Test',
                user_id: 'user456',
                username: 'fallbackuser',
                avatar_url: '/avatar.jpg',
                likes_count: 0,
                replies_count: 0,
                reposts_count: 0,
                views: 0,
                type: 'tweet',
                date: '2025-10-20T08:00:00.000Z',
                images_url: [],
                videos_url: [],
            }

            mockAxios.get
                .mockResolvedValueOnce({ data: [serverTweet] })
                .mockRejectedValueOnce(new Error('User not found'))

            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

            const result = await tweetServiceMock.fetchTweetById('tweet456')

            expect(result?.user.name).toBe('fallbackuser')
            expect(consoleSpy).toHaveBeenCalled()

            consoleSpy.mockRestore()
        })
    })

    describe('fetchTweetDetails', () => {
        it('fetches tweet with replies', async () => {
            const mainTweet = {
                post_id: 'tweet999',
                content: 'Main tweet',
                user_id: 'user999',
                username: 'mainuser',
                avatar_url: '/avatar.jpg',
                likes_count: 100,
                replies_count: 20,
                reposts_count: 15,
                views: 1000,
                type: 'tweet',
                date: '2025-10-21T09:30:00.000Z',
                images_url: [],
                videos_url: [],
            }

            const replies = [
                {
                    post_id: 'reply1',
                    content: 'Reply 1',
                    user_id: 'user1',
                    username: 'replyuser1',
                    avatar_url: '/avatar1.jpg',
                    likes_count: 5,
                    replies_count: 0,
                    reposts_count: 0,
                    views: 25,
                    type: 'reply',
                    date: '2025-10-21T10:00:00.000Z',
                    images_url: [],
                    videos_url: [],
                },
            ]

            mockAxios.get
                .mockResolvedValueOnce({ data: [mainTweet] })
                .mockResolvedValueOnce({ data: [{ name: 'Main User' }] })
                .mockResolvedValueOnce({ data: replies })

            const result = await tweetServiceMock.fetchTweetDetails('tweet999')

            expect(result).not.toBeNull()
            expect(result?.tweet.id).toBe('tweet999')
            expect(result?.replies).toHaveLength(1)
            expect(result?.replies[0]!.type).toBe('reply')
        })

        it('returns null when main tweet is not found', async () => {
            mockAxios.get.mockResolvedValueOnce({ data: [] })

            const result = await tweetServiceMock.fetchTweetDetails('nonexistent')

            expect(result).toBeNull()
        })
    })

    describe('fetchUserTweets', () => {
        it('fetches tweets by username', async () => {
            const userTweets = [
                {
                    post_id: 'tweet1',
                    content: 'User tweet 1',
                    user_id: 'user1',
                    username: 'testuser',
                    avatar_url: '/avatar.jpg',
                    likes_count: 10,
                    replies_count: 2,
                    reposts_count: 1,
                    views: 100,
                    type: 'tweet',
                    date: '2025-10-22T11:00:00.000Z',
                    images_url: [],
                    videos_url: [],
                },
            ]

            mockAxios.get.mockResolvedValueOnce({ data: userTweets })

            const result = await tweetServiceMock.fetchUserTweets('testuser')

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets?username=testuser')
            expect(result).toHaveLength(1)
            expect(result[0]!.user.username).toBe('testuser')
        })
    })

    describe('fetchUserById', () => {
        it('fetches user by ID', async () => {
            const user = {
                user_id: 'user123',
                name: 'Test User',
                username: 'testuser',
            }

            mockAxios.get.mockResolvedValueOnce({ data: [user] })

            const result = await tweetServiceMock.fetchUserById('user123')

            expect(mockAxios.get).toHaveBeenCalledWith('/users?user_id=user123')
            expect(result).toEqual(user)
        })

        it('returns null when user is not found', async () => {
            mockAxios.get.mockResolvedValueOnce({ data: [] })

            const result = await tweetServiceMock.fetchUserById('nonexistent')

            expect(result).toBeNull()
        })
    })

    describe('fetchLikedTweets', () => {
        it('returns empty array (not implemented)', async () => {
            const result = await tweetServiceMock.fetchLikedTweets()

            expect(result).toEqual([])
        })
    })

    describe('fetchMediaTweets', () => {
        it('fetches and filters tweets with media', async () => {
            const tweets = [
                {
                    post_id: 'tweet1',
                    content: 'With images',
                    user_id: 'user1',
                    username: 'user1',
                    avatar_url: '/avatar.jpg',
                    likes_count: 10,
                    replies_count: 0,
                    reposts_count: 0,
                    views: 100,
                    type: 'tweet',
                    date: '2025-10-23T13:00:00.000Z',
                    images_url: ['/img1.jpg'],
                    videos_url: [],
                },
                {
                    post_id: 'tweet2',
                    content: 'No media',
                    user_id: 'user2',
                    username: 'user2',
                    avatar_url: '/avatar.jpg',
                    likes_count: 5,
                    replies_count: 0,
                    reposts_count: 0,
                    views: 50,
                    type: 'tweet',
                    date: '2025-10-24T14:00:00.000Z',
                    images_url: [],
                    videos_url: [],
                },
            ]

            mockAxios.get
                .mockResolvedValueOnce({ data: tweets })
                .mockResolvedValueOnce({ data: [{ name: 'User 1' }] })

            const result = await tweetServiceMock.fetchMediaTweets()

            expect(result).toHaveLength(1)
            expect(result[0]!.content.images).toHaveLength(1)
        })
    })

    describe('fetchReplies', () => {
        it('fetches only reply type tweets', async () => {
            const replies = [
                {
                    post_id: 'reply1',
                    content: 'A reply',
                    user_id: 'user1',
                    username: 'replyuser',
                    avatar_url: '/avatar.jpg',
                    likes_count: 5,
                    replies_count: 0,
                    reposts_count: 0,
                    views: 25,
                    type: 'reply',
                    date: '2025-10-25T16:00:00.000Z',
                    images_url: [],
                    videos_url: [],
                },
            ]

            mockAxios.get
                .mockResolvedValueOnce({ data: replies })
                .mockResolvedValueOnce({ data: [{ name: 'Reply User' }] })

            const result = await tweetServiceMock.fetchReplies()

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets?type=reply')
            expect(result).toHaveLength(1)
            expect(result[0]!.type).toBe('reply')
        })
    })
})

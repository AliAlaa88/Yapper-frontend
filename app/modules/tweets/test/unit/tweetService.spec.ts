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

            const result = await tweetServiceMock.fetchTweets('/tweets')

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets')
            expect(mockAxios.get).toHaveBeenCalledWith('/api/users?user_id=user1')
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
                stats: {
                    likes: 10,
                    replies: 5,
                    retweets: 2,
                    views: 100,
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

            const result = await tweetServiceMock.fetchTweets('/tweets')

            expect(result).toHaveLength(1)
            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to fetch user data for tweet:',
                'tweet1',
            )

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

            mockAxios.get.mockResolvedValueOnce({ data: serverTweets }).mockResolvedValueOnce({
                data: [{ user_id: 'user2', name: 'Jane', username: 'jane' }],
            })

            const result = await tweetServiceMock.fetchTweets('/tweets')

            expect(result[0]!.content).toMatchObject({
                text: 'Check these images',
                images: ['/img1.jpg', '/img2.jpg'],
            })
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
                .mockResolvedValueOnce({ data: mainTweet })
                .mockResolvedValueOnce({
                    data: [{ user_id: 'user999', name: 'Main User', username: 'mainuser' }],
                })
                .mockResolvedValueOnce({ data: replies })
                .mockResolvedValueOnce({
                    data: [{ user_id: 'user1', name: 'Reply User', username: 'replyuser1' }],
                })

            const result = await tweetServiceMock.fetchTweetDetails('tweet999')

            expect(result).not.toBeNull()
            expect(result?.tweet).toMatchObject({
                id: 'tweet999',
                content: {
                    text: 'Main tweet',
                },
            })
            expect(result?.replies).toHaveLength(1)
            expect(result?.replies[0]!.type).toBe('reply')
        })

        it('returns null when main tweet is not found', async () => {
            mockAxios.get.mockResolvedValueOnce({ data: [] })

            const result = await tweetServiceMock.fetchTweetDetails('nonexistent')

            expect(result).toBeNull()
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

            expect(mockAxios.get).toHaveBeenCalledWith('/api/users?user_id=user123')
            expect(result).toEqual(user)
        })

        it('returns null when user is not found', async () => {
            mockAxios.get.mockResolvedValueOnce({ data: [] })

            const result = await tweetServiceMock.fetchUserById('nonexistent')

            expect(result).toBeNull()
        })
    })

    describe('fetchRepliesForTweet', () => {
        it('fetches replies for a specific tweet', async () => {
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

            mockAxios.get.mockResolvedValueOnce({ data: replies }).mockResolvedValueOnce({
                data: [{ user_id: 'user1', name: 'Reply User', username: 'replyuser' }],
            })

            const result = await tweetServiceMock.fetchRepliesForTweet('tweet123')

            expect(mockAxios.get).toHaveBeenCalledWith('/api/tweets/tweet123/replies')
            expect(result).toHaveLength(1)
            expect(result[0]!.type).toBe('reply')
        })
    })
})

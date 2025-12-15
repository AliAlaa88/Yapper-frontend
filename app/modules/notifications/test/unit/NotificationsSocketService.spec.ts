import { describe, it, vi, beforeEach, expect } from 'vitest'
import { createNotificationsSocketService } from '~/modules/notifications/services/NotificationsSocketService'
import { SOCKET_EVENTS } from '~/modules/notifications/types/notificationsSocketEvents'

const mockRoute = { path: '/' }
vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
}))

vi.mock('~/modules/Common/queries/cacheInvalidation', () => ({
    cacheInvalidation: {
        onRemoveNotification: vi.fn(),
        onRemoveMention: vi.fn(),
    },
}))

describe('NotificationsSocketService', () => {
    let socketService: any
    let queryClient: any
    let service: ReturnType<typeof createNotificationsSocketService>

    const mockUser = {
        id: 'user1',
        name: 'Test User',
        username: 'testuser',
        avatar_url: 'avatar.jpg',
    }

    const mockTweet = {
        tweet_id: 'tweet1',
        type: 'tweet' as const,
        content: 'Test tweet',
        images: [],
        videos: [],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    }

    beforeEach(() => {
        mockRoute.path = '/'
        vi.clearAllMocks()
        
        socketService = {
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn(),
            isConnected: vi.fn().mockReturnValue(true),
        }

        queryClient = {
            setQueryData: vi.fn((key, updater) =>
                updater({ pages: [{ notifications: [], total: 0 }] }),
            ),
        }

        service = createNotificationsSocketService({ socketService, queryClient })
    })

    it('should initialize listeners only once, handle NEWEST_COUNT, and remove listeners correctly', () => {
        service.initializeListeners()
        expect(socketService.on).toHaveBeenCalledTimes(8)
        expect(socketService.on).toHaveBeenCalledWith(SOCKET_EVENTS.NEWEST_COUNT, expect.any(Function))
        expect(socketService.on).toHaveBeenCalledWith(SOCKET_EVENTS.FOLLOW, expect.any(Function))
        expect(socketService.on).toHaveBeenCalledWith(SOCKET_EVENTS.LIKE, expect.any(Function))
        expect(socketService.on).toHaveBeenCalledWith(SOCKET_EVENTS.REPLY, expect.any(Function))
        expect(socketService.on).toHaveBeenCalledWith(SOCKET_EVENTS.REPOST, expect.any(Function))
        expect(socketService.on).toHaveBeenCalledWith(SOCKET_EVENTS.QUOTE, expect.any(Function))
        expect(socketService.on).toHaveBeenCalledWith(SOCKET_EVENTS.MENTION, expect.any(Function))
        expect(socketService.on).toHaveBeenCalledWith(SOCKET_EVENTS.MESSAGE, expect.any(Function))

        const newestCountCallback = socketService.on.mock.calls.find(
            (c) => c[0] === SOCKET_EVENTS.NEWEST_COUNT,
        )[1]
        newestCountCallback({ newest_count: 5 })
        expect(service.unreadCount.value).toBe(5)
        newestCountCallback({ newest_count: 10 })
        expect(service.unreadCount.value).toBe(10)

        socketService.on.mockClear()
        service.initializeListeners()
        expect(socketService.on).not.toHaveBeenCalled()

        service.removeListeners()
        expect(socketService.off).toHaveBeenCalledWith(SOCKET_EVENTS.FOLLOW)
        expect(socketService.off).toHaveBeenCalledWith(SOCKET_EVENTS.LIKE)
        expect(socketService.off).toHaveBeenCalledWith(SOCKET_EVENTS.REPLY)
        expect(socketService.off).toHaveBeenCalledWith(SOCKET_EVENTS.REPOST)
        expect(socketService.off).toHaveBeenCalledWith(SOCKET_EVENTS.QUOTE)
        expect(socketService.off).toHaveBeenCalledWith(SOCKET_EVENTS.MENTION)
        expect(socketService.off).toHaveBeenCalledWith(SOCKET_EVENTS.NEWEST_COUNT)
    })

    it('should handle add events for all notification types and update cache correctly', () => {
        service.initializeListeners()

        const followEvent = {
            type: 'follow',
            action: 'add',
            id: 'notif1',
            created_at: '2024-01-01T00:00:00Z',
            follower: mockUser,
        }
        const followCallback = socketService.on.mock.calls.find((c) => c[0] === 'follow')[1]
        followCallback(followEvent)
        expect(queryClient.setQueryData).toHaveBeenCalledWith(['notifications'], expect.any(Function))

        const likeEvent = {
            type: 'like',
            action: 'add',
            id: 'notif2',
            created_at: '2024-01-01T00:00:00Z',
            liker: mockUser,
            tweet: mockTweet,
            like_to: 'user2',
            liked_by: 'user1',
        }
        const likeCallback = socketService.on.mock.calls.find((c) => c[0] === 'like')[1]
        likeCallback(likeEvent)

        // reply add event (should also add to mentions cache)
        queryClient.setQueryData.mockClear()
        const replyEvent = {
            type: 'reply',
            action: 'add',
            id: 'notif3',
            created_at: '2024-01-01T00:00:00Z',
            replier: mockUser,
            reply_tweet: mockTweet,
            original_tweet: mockTweet,
            conversation_id: 'conv1',
            replied_by: 'user1',
            reply_to: 'user2',
        }
        const replyCallback = socketService.on.mock.calls.find((c) => c[0] === 'reply')[1]
        replyCallback(replyEvent)
        expect(queryClient.setQueryData).toHaveBeenCalledWith(['notifications'], expect.any(Function))
        expect(queryClient.setQueryData).toHaveBeenCalledWith(['mentions'], expect.any(Function))

        // repost add event
        const repostEvent = {
            type: 'repost',
            action: 'add',
            id: 'notif4',
            created_at: '2024-01-01T00:00:00Z',
            reposter: mockUser,
            tweet: mockTweet,
            repost_to: 'user2',
            reposted_by: 'user1',
        }
        const repostCallback = socketService.on.mock.calls.find((c) => c[0] === 'repost')[1]
        repostCallback(repostEvent)
        const quoteEvent = {
            type: 'quote',
            action: 'add',
            id: 'notif5',
            created_at: '2024-01-01T00:00:00Z',
            quoter: mockUser,
            quote_tweet: { ...mockTweet, parent_tweet: mockTweet },
        }
        const quoteCallback = socketService.on.mock.calls.find((c) => c[0] === 'quote')[1]
        quoteCallback(quoteEvent)

        queryClient.setQueryData.mockClear()
        const mentionEvent = {
            type: 'mention',
            action: 'add',
            id: 'notif6',
            created_at: '2024-01-01T00:00:00Z',
            mentioner: mockUser,
            tweet: mockTweet,
            tweet_type: 'tweet' as const,
        }
        const mentionCallback = socketService.on.mock.calls.find((c) => c[0] === 'mention')[1]
        mentionCallback(mentionEvent)
        expect(queryClient.setQueryData).toHaveBeenCalledWith(['notifications'], expect.any(Function))
        expect(queryClient.setQueryData).toHaveBeenCalledWith(['mentions'], expect.any(Function))

        const messageEvent = {
            type: 'message',
            action: 'add',
            id: 'notif7',
            created_at: '2024-01-01T00:00:00Z',
            sender: mockUser,
            message_id: 'msg1',
            chat_id: 'chat1',
        }
        const messageCallback = socketService.on.mock.calls.find((c) => c[0] === 'message')[1]
        messageCallback(messageEvent)

        expect(queryClient.setQueryData).toHaveBeenCalled()
    })

    it('should handle aggregate events and replace old notifications in cache', () => {
        service.initializeListeners()

        const followAggregateEvent = {
            type: 'follow',
            action: 'aggregate',
            id: 'notif_new',
            created_at: '2024-01-01T00:00:00Z',
            followers: [mockUser, { ...mockUser, id: 'user2' }],
            old_notification: {
                type: 'follow',
                id: 'notif_old',
                created_at: '2024-01-01T00:00:00Z',
                follower_id: ['user1'],
            },
        }
        const followCallback = socketService.on.mock.calls.find((c) => c[0] === 'follow')[1]
        followCallback(followAggregateEvent)
        expect(queryClient.setQueryData).toHaveBeenCalledWith(['notifications'], expect.any(Function))
        const likeAggregateEvent = {
            type: 'like',
            action: 'aggregate',
            id: 'notif_new2',
            created_at: '2024-01-01T00:00:00Z',
            likers: [mockUser],
            tweets: [mockTweet],
            old_notification: {
                type: 'like',
                id: 'notif_old2',
                created_at: '2024-01-01T00:00:00Z',
                tweet_id: ['tweet1'],
                liked_by: ['user1'],
            },
        }
        const likeCallback = socketService.on.mock.calls.find((c) => c[0] === 'like')[1]
        likeCallback(likeAggregateEvent)
        const repostAggregateEvent = {
            type: 'repost',
            action: 'aggregate',
            id: 'notif_new3',
            created_at: '2024-01-01T00:00:00Z',
            reposters: [mockUser],
            tweets: [mockTweet],
            old_notification: {
                type: 'repost',
                id: 'notif_old3',
                created_at: '2024-01-01T00:00:00Z',
                tweet_id: ['tweet1'],
                reposted_by: ['user1'],
            },
        }
        const repostCallback = socketService.on.mock.calls.find((c) => c[0] === 'repost')[1]
        repostCallback(repostAggregateEvent)

        expect(queryClient.setQueryData).toHaveBeenCalled()
    })

    it('should increment unread count when not on notifications page and mark as seen when on page', () => {
        mockRoute.path = '/home'
        service.unreadCount.value = 0
        service.initializeListeners()

        const messageEvent = {
            type: 'message',
            action: 'add',
            id: '1',
            sender: mockUser,
            message_id: 'msg1',
            chat_id: 'chat1',
            created_at: '2024-01-01T00:00:00Z',
        }
        const messageCallback = socketService.on.mock.calls.find((c) => c[0] === 'message')[1]
        messageCallback(messageEvent)
        expect(service.unreadCount.value).toBe(1)

        messageCallback(messageEvent)
        expect(service.unreadCount.value).toBe(2)

        vi.clearAllMocks()
        mockRoute.path = '/notifications'
        socketService.emit.mockClear()
        const newService = createNotificationsSocketService({ socketService, queryClient })
        newService.initializeListeners()
        newService.unreadCount.value = 5
        
        const newMessageCallback = socketService.on.mock.calls.find((c) => c[0] === 'message')[1]
        newMessageCallback(messageEvent)
        expect(socketService.emit).toHaveBeenCalledWith(SOCKET_EVENTS.MARK_SEEN, {})
        expect(newService.unreadCount.value).toBe(0)
    })

    it('should handle edge cases: socket disconnected and null cache data', () => {
        socketService.isConnected.mockReturnValue(false)
        service.unreadCount.value = 5
        service.markNotificationsAsSeen()
        expect(socketService.emit).not.toHaveBeenCalled()
        expect(service.unreadCount.value).toBe(5)

        socketService.isConnected.mockReturnValue(true)

        service.initializeListeners()
        queryClient.setQueryData.mockImplementation((key, updater) => {
            const result = updater(null)
            expect(result).toBeNull()
        })

        const messageEvent = {
            type: 'message',
            action: 'add',
            id: '1',
            sender: mockUser,
            message_id: 'msg1',
            chat_id: 'chat1',
            created_at: '2024-01-01T00:00:00Z',
        }
        const messageCallback = socketService.on.mock.calls.find((c) => c[0] === 'message')[1]
        messageCallback(messageEvent)

        queryClient.setQueryData.mockImplementation((key, updater) => {
            const result = updater({ someOtherData: true })
            expect(result).toEqual({ someOtherData: true })
        })
        messageCallback(messageEvent)

        queryClient.setQueryData.mockImplementation((key, updater) => {
            const mockData = {
                pages: [
                    { notifications: [{ id: 'old_notif', type: 'like' }], total: 1 },
                    { notifications: [], total: 0 },
                ],
            }
            const result = updater(mockData)
            expect(result.pages[0].notifications[0].id).toBe('new_notif')
        })

        const likeAggregateEvent = {
            type: 'like',
            action: 'aggregate',
            id: 'new_notif',
            created_at: '2024-01-01T00:00:00Z',
            likers: [mockUser],
            tweets: [mockTweet],
            old_notification: {
                type: 'like',
                id: 'old_notif',
                created_at: '2024-01-01T00:00:00Z',
                tweet_id: ['tweet1'],
                liked_by: ['user1'],
            },
        }
        const likeCallback = socketService.on.mock.calls.find((c) => c[0] === 'like')[1]
        likeCallback(likeAggregateEvent)

        expect(queryClient.setQueryData).toHaveBeenCalled()
    })
})

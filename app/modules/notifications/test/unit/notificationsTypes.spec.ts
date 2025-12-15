import { describe, it, expect } from 'vitest'
import type {
    FollowNotification,
    LikeNotification,
    ReplyNotification,
    RepostNotification,
    QuoteNotification,
    MentionNotification,
    MessageNotification,
    ApiNotification,
    NotificationsApiResponse,
    NotificationsApiData,
    ApiMentions,
    MentionsApiData,
    MentionsApiResponse,
} from '~/modules/notifications/types/notifications'

describe('Notification Types', () => {
    it('should create FollowNotification type correctly', () => {
        const notification: FollowNotification = {
            id: '1',
            type: 'follow',
            created_at: '2025-12-15T10:00:00Z',
            followers: [
                {
                    id: 'user1',
                    name: 'User One',
                    username: 'user1',
                    avatar_url: 'https://example.com/avatar1.jpg',
                },
            ],
        }
        expect(notification.type).toBe('follow')
        expect(notification.followers).toHaveLength(1)
    })

    it('should create LikeNotification type correctly', () => {
        const notification: LikeNotification = {
            id: '2',
            type: 'like',
            created_at: '2025-12-15T11:00:00Z',
            likers: [
                {
                    id: 'user2',
                    name: 'User Two',
                    username: 'user2',
                    avatar_url: 'https://example.com/avatar2.jpg',
                },
            ],
            tweets: [
                {
                    tweet_id: 'tweet1',
                    type: 'tweet',
                    content: 'Hello world',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T10:00:00Z',
                    updated_at: '2025-12-15T10:00:00Z',
                },
            ],
        }
        expect(notification.type).toBe('like')
        expect(notification.likers).toHaveLength(1)
        expect(notification.tweets).toHaveLength(1)
    })

    it('should create ReplyNotification type correctly', () => {
        const notification: ReplyNotification = {
            id: '3',
            type: 'reply',
            created_at: '2025-12-15T12:00:00Z',
            replier: {
                id: 'user3',
                name: 'User Three',
                username: 'user3',
                avatar_url: 'https://example.com/avatar3.jpg',
            },
            reply_tweet: {
                tweet_id: 'reply1',
                type: 'reply',
                content: 'Great post',
                images: [],
                videos: [],
                created_at: '2025-12-15T11:00:00Z',
                updated_at: '2025-12-15T11:00:00Z',
            },
            original_tweet: {
                tweet_id: 'tweet2',
                type: 'tweet',
                content: 'Hello everyone',
                images: [],
                videos: [],
                created_at: '2025-12-15T10:00:00Z',
                updated_at: '2025-12-15T10:00:00Z',
            },
            conversation_id: 'conv1',
        }
        expect(notification.type).toBe('reply')
        expect(notification.replier.id).toBe('user3')
    })

    it('should create RepostNotification type correctly', () => {
        const notification: RepostNotification = {
            id: '4',
            type: 'repost',
            created_at: '2025-12-15T13:00:00Z',
            reposters: [
                {
                    id: 'user4',
                    name: 'User Four',
                    username: 'user4',
                    avatar_url: 'https://example.com/avatar4.jpg',
                },
            ],
            tweets: [
                {
                    tweet_id: 'tweet3',
                    type: 'tweet',
                    content: 'Shared content',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T12:00:00Z',
                    updated_at: '2025-12-15T12:00:00Z',
                },
            ],
        }
        expect(notification.type).toBe('repost')
        expect(notification.reposters).toHaveLength(1)
    })

    it('should create QuoteNotification type correctly', () => {
        const notification: QuoteNotification = {
            id: '5',
            type: 'quote',
            created_at: '2025-12-15T14:00:00Z',
            quoter: {
                id: 'user5',
                name: 'User Five',
                username: 'user5',
                avatar_url: 'https://example.com/avatar5.jpg',
            },
            quote_tweet: {
                tweet_id: 'quote1',
                type: 'quote',
                content: 'My thoughts on this',
                images: [],
                videos: [],
                created_at: '2025-12-15T13:00:00Z',
                updated_at: '2025-12-15T13:00:00Z',
            },
        }
        expect(notification.type).toBe('quote')
        expect(notification.quoter.username).toBe('user5')
    })

    it('should create MentionNotification type correctly', () => {
        const notification: MentionNotification = {
            id: '6',
            type: 'mention',
            created_at: '2025-12-15T15:00:00Z',
            mentioner: {
                id: 'user6',
                name: 'User Six',
                username: 'user6',
                avatar_url: 'https://example.com/avatar6.jpg',
            },
            tweet: {
                tweet_id: 'tweet4',
                type: 'tweet',
                content: '@me check this out',
                images: [],
                videos: [],
                created_at: '2025-12-15T14:00:00Z',
                updated_at: '2025-12-15T14:00:00Z',
            },
            tweet_type: 'tweet',
        }
        expect(notification.type).toBe('mention')
        expect(notification.tweet_type).toBe('tweet')
    })

    it('should create MessageNotification type correctly', () => {
        const notification: MessageNotification = {
            id: '7',
            type: 'message',
            created_at: '2025-12-15T16:00:00Z',
            sender: {
                id: 'user7',
                name: 'User Seven',
                username: 'user7',
                avatar_url: 'https://example.com/avatar7.jpg',
            },
            message_id: 'msg1',
            chat_id: 'chat1',
        }
        expect(notification.type).toBe('message')
        expect(notification.chat_id).toBe('chat1')
    })

    it('should create ApiNotification union type correctly', () => {
        const notifications: ApiNotification[] = [
            {
                id: '1',
                type: 'follow',
                created_at: '2025-12-15T10:00:00Z',
                followers: [],
            },
            {
                id: '2',
                type: 'like',
                created_at: '2025-12-15T11:00:00Z',
                likers: [],
                tweets: [],
            },
            {
                id: '3',
                type: 'message',
                created_at: '2025-12-15T16:00:00Z',
                sender: {
                    id: 'user7',
                    name: 'User Seven',
                    username: 'user7',
                    avatar_url: null,
                },
                message_id: 'msg1',
                chat_id: 'chat1',
            },
        ]
        expect(notifications).toHaveLength(3)
        expect(notifications[0]!.type).toBe('follow')
        expect(notifications[2]!.type).toBe('message')
    })

    it('should create NotificationsApiResponse type correctly', () => {
        const response: NotificationsApiResponse = {
            data: {
                notifications: [],
                page: 1,
                page_size: 20,
                total: 0,
                total_pages: 0,
                has_next: false,
                has_previous: false,
            },
            count: 0,
            message: 'Success',
        }
        expect(response.data.page).toBe(1)
        expect(response.data.notifications).toHaveLength(0)
    })

    it('should create NotificationsApiData type correctly', () => {
        const data: NotificationsApiData = {
            notifications: [
                {
                    id: '1',
                    type: 'follow',
                    created_at: '2025-12-15T10:00:00Z',
                    followers: [],
                },
            ],
            page: 1,
            page_size: 20,
            total: 1,
            total_pages: 1,
            has_next: false,
            has_previous: false,
        }
        expect(data.notifications).toHaveLength(1)
        expect(data.total).toBe(1)
    })

    it('should create ApiMentions type correctly', () => {
        const mentions: ApiMentions[] = [
            {
                id: '1',
                type: 'mention',
                created_at: '2025-12-15T15:00:00Z',
                mentioner: {
                    id: 'user6',
                    name: 'User Six',
                    username: 'user6',
                    avatar_url: null,
                },
                tweet: {
                    tweet_id: 'tweet4',
                    type: 'tweet',
                    content: '@me check this out',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T14:00:00Z',
                    updated_at: '2025-12-15T14:00:00Z',
                },
                tweet_type: 'tweet',
            },
            {
                id: '2',
                type: 'reply',
                created_at: '2025-12-15T12:00:00Z',
                replier: {
                    id: 'user3',
                    name: 'User Three',
                    username: 'user3',
                    avatar_url: null,
                },
                reply_tweet: {
                    tweet_id: 'reply1',
                    type: 'reply',
                    content: 'Great post',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T11:00:00Z',
                    updated_at: '2025-12-15T11:00:00Z',
                },
                original_tweet: {
                    tweet_id: 'tweet2',
                    type: 'tweet',
                    content: 'Hello everyone',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T10:00:00Z',
                    updated_at: '2025-12-15T10:00:00Z',
                },
            },
        ]
        expect(mentions).toHaveLength(2)
        expect(mentions[0]!.type).toBe('mention')
        expect(mentions[1]!.type).toBe('reply')
    })

    it('should create MentionsApiData type correctly', () => {
        const data: MentionsApiData = {
            notifications: [],
            page: 1,
            page_size: 20,
            total: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false,
        }
        expect(data.page).toBe(1)
        expect(data.notifications).toHaveLength(0)
    })

    it('should create MentionsApiResponse type correctly', () => {
        const response: MentionsApiResponse = {
            data: {
                notifications: [],
                page: 1,
                page_size: 20,
                total: 0,
                total_pages: 0,
                has_next: false,
                has_previous: false,
            },
            count: 0,
            message: 'Success',
        }
        expect(response.data).toBeDefined()
        expect(response.count).toBe(0)
    })
})

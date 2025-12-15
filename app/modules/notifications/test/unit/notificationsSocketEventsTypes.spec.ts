import { describe, it, expect } from 'vitest'
import {
    isFollowEvent,
    isLikeEvent,
    isReplyEvent,
    isRepostEvent,
    isQuoteEvent,
    isMentionEvent,
    isAddAction,
    isRemoveAction,
    isAggregateAction,
    SOCKET_EVENTS,
    type FollowEvent,
    type LikeEvent,
    type ReplyEvent,
    type RepostEvent,
    type QuoteEvent,
    type MentionEvent,
    type NotificationEvent,
    type AddEvent,
    type RemoveEvent,
    type AggregateEvent,
} from '~/modules/notifications/types/notificationsSocketEvents'

describe('Socket Events Type Guards', () => {
    it('should identify follow events correctly', () => {
        const event: FollowEvent = {
            type: 'follow',
            id: '1',
            created_at: '2025-12-15T10:00:00Z',
            action: 'add',
            follower: {
                id: 'user1',
                name: 'User One',
                username: 'user1',
                avatar_url: null,
            },
        }
        expect(isFollowEvent(event)).toBe(true)
        expect(isLikeEvent(event)).toBe(false)
        expect(isReplyEvent(event)).toBe(false)
    })

    it('should identify like events correctly', () => {
        const event: LikeEvent = {
            type: 'like',
            id: '2',
            created_at: '2025-12-15T11:00:00Z',
            action: 'add',
            liker: {
                id: 'user2',
                name: 'User Two',
                username: 'user2',
                avatar_url: null,
            },
            tweet: {
                tweet_id: 'tweet1',
                type: 'tweet',
                content: 'Hello',
                images: [],
                videos: [],
                created_at: '2025-12-15T10:00:00Z',
                updated_at: '2025-12-15T10:00:00Z',
            },
            like_to: 'tweet1',
            liked_by: 'user2',
        }
        expect(isLikeEvent(event)).toBe(true)
        expect(isFollowEvent(event)).toBe(false)
    })

    it('should identify reply events correctly', () => {
        const event: ReplyEvent = {
            type: 'reply',
            id: '3',
            created_at: '2025-12-15T12:00:00Z',
            action: 'add',
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
            replied_by: 'user3',
            reply_to: 'tweet2',
            conversation_id: 'conv1',
        }
        expect(isReplyEvent(event)).toBe(true)
        expect(isFollowEvent(event)).toBe(false)
    })

    it('should identify repost events correctly', () => {
        const event: RepostEvent = {
            type: 'repost',
            id: '4',
            created_at: '2025-12-15T13:00:00Z',
            action: 'add',
            reposter: {
                id: 'user4',
                name: 'User Four',
                username: 'user4',
                avatar_url: null,
            },
            repost_to: 'tweet1',
            reposted_by: 'user4',
            tweet: {
                tweet_id: 'tweet1',
                type: 'tweet',
                content: 'Shared content',
                images: [],
                videos: [],
                created_at: '2025-12-15T12:00:00Z',
                updated_at: '2025-12-15T12:00:00Z',
            },
        }
        expect(isRepostEvent(event)).toBe(true)
        expect(isFollowEvent(event)).toBe(false)
    })

    it('should identify quote events correctly', () => {
        const event: QuoteEvent = {
            type: 'quote',
            id: '5',
            created_at: '2025-12-15T14:00:00Z',
            action: 'add',
            quoter: {
                id: 'user5',
                name: 'User Five',
                username: 'user5',
                avatar_url: null,
            },
            quote_tweet: {
                tweet_id: 'quote1',
                type: 'quote',
                content: 'My thoughts',
                images: [],
                videos: [],
                created_at: '2025-12-15T13:00:00Z',
                updated_at: '2025-12-15T13:00:00Z',
            },
        }
        expect(isQuoteEvent(event)).toBe(true)
        expect(isFollowEvent(event)).toBe(false)
    })

    it('should identify mention events correctly', () => {
        const event: MentionEvent = {
            type: 'mention',
            id: '6',
            created_at: '2025-12-15T15:00:00Z',
            action: 'add',
            mentioner: {
                id: 'user6',
                name: 'User Six',
                username: 'user6',
                avatar_url: null,
            },
            tweet_type: 'tweet',
            tweet: {
                tweet_id: 'tweet4',
                type: 'tweet',
                content: '@me check this',
                images: [],
                videos: [],
                created_at: '2025-12-15T14:00:00Z',
                updated_at: '2025-12-15T14:00:00Z',
            },
        }
        expect(isMentionEvent(event)).toBe(true)
        expect(isFollowEvent(event)).toBe(false)
    })

    it('should identify add actions correctly', () => {
        const event: AddEvent = {
            type: 'follow',
            id: '1',
            created_at: '2025-12-15T10:00:00Z',
            action: 'add',
            follower: {
                id: 'user1',
                name: 'User One',
                username: 'user1',
                avatar_url: null,
            },
        }
        expect(isAddAction(event)).toBe(true)
        expect(isRemoveAction(event)).toBe(false)
        expect(isAggregateAction(event)).toBe(false)
    })

    it('should identify remove actions correctly', () => {
        const event: RemoveEvent = {
            type: 'follow',
            id: '7',
            created_at: '2025-12-15T10:00:00Z',
            action: 'remove',
            follower_id: 'user1',
            follower_name: 'User One',
            follower_avatar_url: null,
            followed_id: 'me',
        }
        expect(isRemoveAction(event)).toBe(true)
        expect(isAddAction(event)).toBe(false)
        expect(isAggregateAction(event)).toBe(false)
    })

    it('should identify aggregate actions correctly', () => {
        const event: AggregateEvent = {
            type: 'follow',
            id: '8',
            created_at: '2025-12-15T10:00:00Z',
            action: 'aggregate',
            followers: [
                {
                    id: 'user1',
                    name: 'User One',
                    username: 'user1',
                    avatar_url: null,
                },
            ],
            old_notification: {
                type: 'follow',
                id: '7',
                created_at: '2025-12-15T09:00:00Z',
                follower_id: ['user1'],
            },
        }
        expect(isAggregateAction(event)).toBe(true)
        expect(isAddAction(event)).toBe(false)
        expect(isRemoveAction(event)).toBe(false)
    })

    it('should have correct SOCKET_EVENTS constants', () => {
        expect(SOCKET_EVENTS.FOLLOW).toBe('follow')
        expect(SOCKET_EVENTS.LIKE).toBe('like')
        expect(SOCKET_EVENTS.REPLY).toBe('reply')
        expect(SOCKET_EVENTS.REPOST).toBe('repost')
        expect(SOCKET_EVENTS.QUOTE).toBe('quote')
        expect(SOCKET_EVENTS.MENTION).toBe('mention')
        expect(SOCKET_EVENTS.NEWEST_COUNT).toBe('newest_count')
        expect(SOCKET_EVENTS.MESSAGE).toBe('message')
        expect(SOCKET_EVENTS.MARK_SEEN).toBe('mark_seen')
    })

    it('should work with notification event union type', () => {
        const followEvent: NotificationEvent = {
            type: 'follow',
            id: '1',
            created_at: '2025-12-15T10:00:00Z',
            action: 'add',
            follower: {
                id: 'user1',
                name: 'User One',
                username: 'user1',
                avatar_url: null,
            },
        }

        expect(isFollowEvent(followEvent)).toBe(true)
        expect(isAddAction(followEvent)).toBe(true)
    })

    it('should handle multiple action types with same type', () => {
        const followAddEvent: NotificationEvent = {
            type: 'follow',
            id: '1',
            created_at: '2025-12-15T10:00:00Z',
            action: 'add',
            follower: {
                id: 'user1',
                name: 'User One',
                username: 'user1',
                avatar_url: null,
            },
        }

        const followRemoveEvent: NotificationEvent = {
            type: 'follow',
            id: '2',
            created_at: '2025-12-15T11:00:00Z',
            action: 'remove',
            follower_id: 'user1',
            follower_name: 'User One',
            follower_avatar_url: null,
            followed_id: 'me',
        }

        expect(isFollowEvent(followAddEvent)).toBe(true)
        expect(isAddAction(followAddEvent)).toBe(true)
        expect(isFollowEvent(followRemoveEvent)).toBe(true)
        expect(isRemoveAction(followRemoveEvent)).toBe(true)
    })

    it('should handle like aggregate events', () => {
        const event: AggregateEvent = {
            type: 'like',
            id: '9',
            created_at: '2025-12-15T16:00:00Z',
            action: 'aggregate',
            likers: [
                {
                    id: 'user1',
                    name: 'User One',
                    username: 'user1',
                    avatar_url: null,
                },
            ],
            tweets: [
                {
                    tweet_id: 'tweet1',
                    type: 'tweet',
                    content: 'Hello',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T10:00:00Z',
                    updated_at: '2025-12-15T10:00:00Z',
                },
            ],
            old_notification: {
                type: 'like',
                id: '8',
                created_at: '2025-12-15T15:00:00Z',
                tweet_id: ['tweet1'],
                liked_by: ['user1'],
            },
        }

        expect(isLikeEvent(event)).toBe(true)
        expect(isAggregateAction(event)).toBe(true)
    })

    it('should handle repost aggregate events', () => {
        const event: AggregateEvent = {
            type: 'repost',
            id: '10',
            created_at: '2025-12-15T17:00:00Z',
            action: 'aggregate',
            reposters: [
                {
                    id: 'user1',
                    name: 'User One',
                    username: 'user1',
                    avatar_url: null,
                },
            ],
            tweets: [
                {
                    tweet_id: 'tweet1',
                    type: 'tweet',
                    content: 'Hello',
                    images: [],
                    videos: [],
                    created_at: '2025-12-15T10:00:00Z',
                    updated_at: '2025-12-15T10:00:00Z',
                },
            ],
            old_notification: {
                type: 'repost',
                id: '9',
                created_at: '2025-12-15T16:00:00Z',
                tweet_id: ['tweet1'],
                reposted_by: ['user1'],
            },
        }

        expect(isRepostEvent(event)).toBe(true)
        expect(isAggregateAction(event)).toBe(true)
    })
})

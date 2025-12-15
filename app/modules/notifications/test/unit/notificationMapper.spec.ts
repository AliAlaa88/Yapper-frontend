import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    mapNotificationUserToTweetUser,
    mapBaseTweetToTweet,
    mapReplyNotificationToTweet,
    mapQuoteNotificationToTweet,
    mapMentionNotificationToTweet,
    mapNotificationToTweet,
    shouldUseTweetComponent,
    shouldUseCardComponent,
} from '~/modules/notifications/utils/notificationMapper'
import { useUserStore } from '~/modules/auth/stores/userStore'

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: vi.fn(),
}))

describe('notificationsMappers', () => {
    const mockUser = { id: 'u1', name: 'John', username: 'john', avatar_url: 'url', verified: true }
    beforeEach(() => {
        ;(useUserStore as any).mockReturnValue({ user: mockUser })
    })

    it('should map Notification User to Tweet User with defaults', () => {
        const u = { id: '1', name: 'A', username: 'a' }
        const mapped = mapNotificationUserToTweetUser(u)
        expect(mapped.id).toBe('1')
        expect(mapped.avatar_url).toBe('')
        expect(mapped.verified).toBe(false)
        expect(mapped.bio).toBe('')
    })

    it('should map BaseTweet to Tweet with default values', () => {
        const base = {
            tweet_id: 't1',
            type: 'reply',
            content: 'hello',
            created_at: '',
            updated_at: '',
        }
        const tweet = mapBaseTweetToTweet(base, mockUser)
        expect(tweet.tweet_id).toBe('t1')
        expect(tweet.images).toEqual([])
        expect(tweet.likes_count).toBe(0)
        expect(tweet.user).toEqual(mockUser)
    })

    it('should map reply notification to tweet including parent_tweet', () => {
        const replyNotification = {
            type: 'reply',
            reply_tweet: {
                tweet_id: 'r1',
                type: 'reply',
                content: 'hi',
                created_at: '',
                updated_at: '',
            },
            replier: { id: '2', name: 'R', username: 'r' },
            original_tweet: {
                tweet_id: 'o1',
                type: 'tweet',
                content: 'original',
                created_at: '',
                updated_at: '',
            },
            conversation_id: 'c1',
        }
        const tweet = mapReplyNotificationToTweet(replyNotification)
        expect(tweet.tweet_id).toBe('r1')
        expect(tweet.parent_tweet?.tweet_id).toBe('o1')
    })

    it('should map quote notification to tweet including parent_tweet', () => {
        const quoteNotification = {
            type: 'quote',
            quote_tweet: {
                tweet_id: 'q1',
                type: 'quote',
                content: 'quote',
                created_at: '',
                updated_at: '',
                parent_tweet: {
                    tweet_id: 'p1',
                    type: 'tweet',
                    content: 'parent',
                    created_at: '',
                    updated_at: '',
                },
            },
            quoter: { id: '3', name: 'Q', username: 'q' },
        }
        const tweet = mapQuoteNotificationToTweet(quoteNotification)
        expect(tweet.tweet_id).toBe('q1')
        expect(tweet.parent_tweet?.tweet_id).toBe('p1')
    })

    it('should map mention notification to tweet including parent_tweet for quote', () => {
        const mentionNotification = {
            type: 'mention',
            tweet: {
                tweet_id: 'm1',
                type: 'quote',
                content: 'mention',
                created_at: '',
                updated_at: '',
                parent_tweet: {
                    tweet_id: 'p2',
                    type: 'tweet',
                    content: 'parent',
                    created_at: '',
                    updated_at: '',
                },
            },
            mentioner: { id: '4', name: 'M', username: 'm' },
            tweet_type: 'quote',
        }
        const tweet = mapMentionNotificationToTweet(mentionNotification)
        expect(tweet.tweet_id).toBe('m1')
        expect(tweet.parent_tweet?.tweet_id).toBe('p2')
    })

    it('should mapNotificationToTweet correctly based on type', () => {
        const reply = {
            type: 'reply',
            reply_tweet: { tweet_id: 't' },
            replier: { id: 'u' },
            conversation_id: 'c1',
        } as any
        const quote = { type: 'quote', quote_tweet: { tweet_id: 't' }, quoter: { id: 'u' } } as any
        const mention = {
            type: 'mention',
            tweet: { tweet_id: 't' },
            mentioner: { id: 'u' },
            tweet_type: 'tweet',
        } as any
        expect(mapNotificationToTweet(reply)).not.toBeNull()
        expect(mapNotificationToTweet(quote)).not.toBeNull()
        expect(mapNotificationToTweet(mention)).not.toBeNull()
        expect(mapNotificationToTweet({ type: 'like' } as any)).toBeNull()
    })

    it('should return correct booleans for component selection', () => {
        expect(shouldUseTweetComponent({ type: 'reply' } as any)).toBe(true)
        expect(shouldUseTweetComponent({ type: 'like' } as any)).toBe(false)
        expect(shouldUseCardComponent({ type: 'like' } as any)).toBe(true)
        expect(shouldUseCardComponent({ type: 'reply' } as any)).toBe(false)
    })
})

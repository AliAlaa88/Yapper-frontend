export type NotificationType = 'follow' | 'like' | 'reply' | 'repost' | 'quote' | 'mention' | 'message'
export type NotificationAction = 'add' | 'remove' | 'aggregate'

export interface User {
    id: string
    email: string
    name: string
    username: string
    avatar_url: string | null
    verified?: boolean
    bio?: string | null
    cover_url?: string | null
    followers?: number
    following?: number
}

export interface BaseTweet {
    tweet_id: string
    user_id?: string
    type: 'tweet' | 'reply' | 'quote' | 'repost'
    content: string
    images: string[]
    videos: string[]
    created_at: string
    updated_at: string
    deleted_at?: string | null
}

export interface TweetComponent extends BaseTweet {
    user_id: string
    num_likes: number
    num_reposts: number
    num_views: number
    num_quotes: number
    num_replies: number
    num_bookmarks: number
}

export interface CountTweet extends BaseTweet {
    likes_count: number
    reposts_count: number
    views_count: number
    quotes_count: number
    replies_count: number
    bookmarks_count: number
    is_bookmarked: boolean
}

export interface QuoteTweet extends TweetComponent {
    parent_tweet?: {
        tweet_id: string
        type: string
        content: string
        images: string[]
        videos: string[]
        user: User
        is_bookmarked: boolean
        created_at: string
        updated_at: string
    }
}

// WebSocket Event Types

export interface BaseEvent {
    type: NotificationType
    created_at: string
}

export interface MessageAddEvent extends BaseEvent {
    type: 'message'
    action: 'add'
    sender: User
    message_id: string
    chat_id: string
}
export type MessageEvent = MessageAddEvent

export interface FollowAddEvent extends BaseEvent {
    type: 'follow'
    follower_id: string
    followed_id: string
    action: 'add'
    follower_avatar_url: string | null
    follower_name: string
}

export interface FollowRemoveEvent extends BaseEvent {
    type: 'follow'
    follower_id: string
    follower_name: string
    follower_avatar_url: string | null
    followed_id: string
    action: 'remove'
}

export interface FollowAggregateEvent extends BaseEvent {
    type: 'follow'
    created_at: string
    followers: User[]
    action: 'aggregate'
    old_notification: {
        type: 'follow'
        created_at: string
        follower_id: string[]
    }
}

export type FollowEvent = FollowAddEvent | FollowRemoveEvent | FollowAggregateEvent

// Like Events
export interface LikeAddEvent extends BaseEvent {
    type: 'like'
    liker: User
    tweet: TweetComponent
    like_to: string
    liked_by: string
    action: 'add'
}

export interface LikeAggregateEvent extends BaseEvent {
    type: 'like'
    created_at: string
    likers: User[]
    tweets: TweetComponent[]
    action: 'aggregate'
    old_notification: {
        type: 'like'
        created_at: string
        tweet_id: string[]
        liked_by: string[]
    }
}

export interface LikeRemoveEvent extends BaseEvent {
    type: 'like'
    tweet_id: string
    like_to: string
    liked_by: string
    action: 'remove'
}

export type LikeEvent = LikeAddEvent | LikeAggregateEvent | LikeRemoveEvent

// Reply Events
export interface ReplyAddEvent extends BaseEvent {
    type: 'reply'
    replier: User
    reply_tweet: TweetComponent
    original_tweet_id: string
    replied_by: string
    reply_to: string
    conversation_id: string
    action: 'add'
}

export interface ReplyRemoveEvent extends BaseEvent {
    type: 'reply'
    reply_tweet_id: string
    reply_to: string
    replied_by: string
    action: 'remove'
}

export type ReplyEvent = ReplyAddEvent | ReplyRemoveEvent

// Repost Events
export interface RepostAddEvent extends BaseEvent {
    type: 'repost'
    reposter: User
    repost_to: string
    reposted_by: string
    tweet: TweetComponent
    action: 'add'
}

export interface RepostAggregateEvent extends BaseEvent {
    type: 'repost'
    created_at: string
    reposters: User[]
    tweets: TweetComponent[]
    action: 'aggregate'
    old_notification: {
        type: 'repost'
        created_at: string
        tweet_id: string[]
        reposted_by: string[]
    }
}

export interface RepostRemoveEvent extends BaseEvent {
    type: 'repost'
    repost_to: string
    reposted_by: string
    tweet_id: string
    action: 'remove'
}

export type RepostEvent = RepostAddEvent | RepostRemoveEvent | RepostAggregateEvent

// Quote Events
export interface QuoteAddEvent extends BaseEvent {
    type: 'quote'
    quoted_by: User
    quote: QuoteTweet
    action: 'add'
}

export interface QuoteRemoveEvent extends BaseEvent {
    type: 'quote'
    quote_tweet_id: string
    quote_to: string
    quoted_by: string
    action: 'remove'
}

export type QuoteEvent = QuoteAddEvent | QuoteRemoveEvent

// Mention Events
export interface MentionAddEvent extends BaseEvent {
    type: 'mention'
    mentioned_by: User
    tweet_type: 'tweet' | 'quote' | 'reply'
    tweet: CountTweet | QuoteTweet
    action: 'add'
}

export interface MentionRemoveEvent extends BaseEvent {
    type: 'mention'
    tweet_id: string
    mentioned_by: string
    action: 'remove'
}

export type MentionEvent = MentionAddEvent | MentionRemoveEvent

export type NotificationEvent =
    | FollowEvent
    | LikeEvent
    | ReplyEvent
    | RepostEvent
    | QuoteEvent
    | MentionEvent
    | MessageEvent

export type AddEvent =
    | FollowAddEvent
    | LikeAddEvent
    | ReplyAddEvent
    | RepostAddEvent
    | QuoteAddEvent
    | MentionAddEvent

export type RemoveEvent =
    | FollowRemoveEvent
    | LikeRemoveEvent
    | ReplyRemoveEvent
    | RepostRemoveEvent
    | QuoteRemoveEvent
    | MentionRemoveEvent

export type AggregateEvent = LikeAggregateEvent | FollowAggregateEvent | RepostAggregateEvent

export type NewestCount = {
    newest_count: string
}

export const SOCKET_EVENTS = {
    FOLLOW: 'follow',
    LIKE: 'like',
    REPLY: 'reply',
    REPOST: 'repost',
    QUOTE: 'quote',
    MENTION: 'mention',
    NEWEST_COUNT: 'newest_count',
    MESSAGE: 'message',

    // client -> server
    MARK_SEEN: 'mark_seen',
} as const

export function isFollowEvent(event: NotificationEvent): event is FollowEvent {
    return 'type' in event && event.type === 'follow'
}

export function isLikeEvent(event: NotificationEvent): event is LikeEvent {
    return 'type' in event && event.type === 'like'
}

export function isReplyEvent(event: NotificationEvent): event is ReplyEvent {
    return 'type' in event && event.type === 'reply'
}

export function isRepostEvent(event: NotificationEvent): event is RepostEvent {
    return 'type' in event && event.type === 'repost'
}

export function isQuoteEvent(event: NotificationEvent): event is QuoteEvent {
    return 'type' in event && event.type === 'quote'
}

export function isMentionEvent(event: NotificationEvent): event is MentionEvent {
    return 'type' in event && event.type === 'mention'
}

export function isAddAction(event: NotificationEvent): event is AddEvent {
    return event.action === 'add'
}

export function isRemoveAction(event: NotificationEvent): event is RemoveEvent {
    return event.action === 'remove'
}

export function isAggregateAction(event: NotificationEvent): event is AggregateEvent {
    return event.action === 'aggregate'
}

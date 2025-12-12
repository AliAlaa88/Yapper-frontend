import type { User, BaseTweet, QuoteTweet } from './notificationsSocketEvents'

export interface FollowNotification {
    type: 'follow'
    created_at: string
    followers: User[]
}

export interface LikeNotification {
    type: 'like'
    created_at: string
    likers: User[]
    tweets: BaseTweet[]
}

export interface ReplyNotification {
    type: 'reply'
    created_at: string
    replier: User
    reply_tweet: BaseTweet
    original_tweet: BaseTweet
    conversation_id?: string
}

export interface RepostNotification {
    type: 'repost'
    created_at: string
    reposters: User[]
    tweets: BaseTweet[]
}

export interface QuoteNotification {
    type: 'quote'
    created_at: string
    quoter: User
    quote_tweet: QuoteTweet
}

export interface MentionNotification {
    type: 'mention'
    created_at: string
    mentioner: User
    tweet: BaseTweet
    tweet_type: 'tweet' | 'quote' | 'reply'
}

export interface MessageNotification {
    type: 'message'
    created_at: string
    sender: User
    message_id: string
    chat_id: string
}

export type ApiNotification =
    | FollowNotification
    | LikeNotification
    | ReplyNotification
    | RepostNotification
    | QuoteNotification
    | MentionNotification
    | MessageNotification

export interface NotificationsApiResponse {
    data: NotificationsApiData
    count: number
    message: string
}

export interface NotificationsApiData {
    notifications: ApiNotification[]
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
}

export type ApiMentions = MentionNotification | ReplyNotification

export interface MentionsApiData {
    notifications: ApiMentions[]
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
}

export interface MentionsApiResponse {
    data: MentionsApiData
    count: number
    message: string
}

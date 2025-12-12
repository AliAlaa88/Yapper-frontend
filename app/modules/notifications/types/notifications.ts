import type { User, BaseTweet, QuoteTweet } from './notificationsSocketEvents'

export interface FollowNotification {  // done
    id: string
    type: 'follow'
    created_at: string
    followers: User[]
}

export interface LikeNotification {   // done
    id: string
    type: 'like'
    created_at: string
    likers: User[]
    tweets: BaseTweet[]
}

export interface ReplyNotification {   //done
    id: string
    type: 'reply'
    created_at: string
    replier: User
    reply_tweet: BaseTweet
    original_tweet: BaseTweet
    conversation_id?: string
}

export interface RepostNotification {  //done
    id: string
    type: 'repost'
    created_at: string
    reposters: User[]
    tweets: BaseTweet[]
}

export interface QuoteNotification {   // done
    id: string
    type: 'quote'
    created_at: string
    quoter: User
    quote_tweet: QuoteTweet
}

export interface MentionNotification {  // done
    id: string
    type: 'mention'
    created_at: string
    mentioner: User
    tweet: BaseTweet
    tweet_type: 'tweet' | 'quote' | 'reply'
}

export interface MessageNotification {   // done
    id: string
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

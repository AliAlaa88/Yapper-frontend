import type { Content } from './content'
import type { User } from './user'
import type { Stats } from './stats'
export type TweetType = 'tweet' | 'retweet' | 'quote' | 'reply'

interface Tweet {
    tweet_id: string
    type: TweetType
    parent_tweet_id?: string
    content: string
    imgs?: string[]
    videos?: string[]
    gifs?: string[]
    likes_count: number
    reposts_count: number
    views_count: number
    qoutes_count: number
    replies_count: number
    is_liked: boolean
    is_reposted: boolean
    created_at: string
    updated_at?: string
    user: User
}

export type { Tweet }

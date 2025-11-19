import type { User } from '../../Common/types/user'
export type TweetType = 'tweet' | 'repost' | 'quote' | 'reply'

interface Tweet {
    tweet_id: string
    type: TweetType
    parent_tweet_id?: string
    content: string
    images?: string[]
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
type TweetsPage = {
    data: Tweet[]
    nextCursor?: string
    hasMore?: boolean
}

export type { Tweet, TweetsPage }
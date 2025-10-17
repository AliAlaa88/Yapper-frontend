import type { Content } from './content'
import type { User } from './user'
import type { Stats } from './stats'
export type TweetType = 'tweet' | 'retweet' | 'quote' | 'reply'

interface Tweet {
    id: string
    createdAt: string
    updatedAt?: string
    user: User
    type: TweetType
    content: Content
    stats: Stats
}

export type { Tweet }

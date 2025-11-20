import type { Tweet } from './tweet'

interface TweetDetails {
    tweet: Tweet
    replies: Tweet[]
}

export type { TweetDetails }

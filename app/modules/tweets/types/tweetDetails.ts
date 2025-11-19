import type { Tweet } from './tweet'

// TweetDetails is just a Tweet - replies are fetched separately
type TweetDetails = {
    tweet: Tweet,
    replies: Tweet[]
}

export type { TweetDetails }

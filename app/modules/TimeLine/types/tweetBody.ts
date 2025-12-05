export interface TweetBody {
    content: string
    videos: string[]
    images: string[]
    parent_tweet_id?: string
    type?: 'tweet' | 'reply' | 'quote'
}

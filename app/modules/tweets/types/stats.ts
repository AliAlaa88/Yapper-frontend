interface Stats {
    likes: number
    replies: number
    retweets: number
    views?: number
    is_liked: boolean
    is_reposted: boolean
    is_bookmarked: boolean
    tweet_id: string
}

export type { Stats }

export type TweetType = 'post' | 'reply' | 'quote'

export interface TweetData {
    user_id: string
    username: string
    avatar_url: string
    post_id: string
    content: string
    images_url: string[]
    date: string
}

export interface Tweet extends TweetData {
    likes_count: number
    replies_count: number
    reposts_count: number
    views: number
    reposted_by_me: boolean
    type: TweetType
    replying_to?: string[]
    referenced_post?: TweetData
}

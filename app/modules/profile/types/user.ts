export interface User {
    id: string
    name: string
    username: string
    bio: string
    avatar_url: string
    cover_url: string
    followers_count: number
    following_count: number
    country: string
    created_at: string
}

export interface ApiResponse<T> {
    data?: T
    count?: number
    message: string
    error?: string
    statusCode: number
}

export interface Follower {
    user_id: string
    name: string
    username: string
    bio: string
    avatar_url: string
    is_following: boolean
    is_follower: boolean
    is_muted: boolean
    is_blocked: boolean
}

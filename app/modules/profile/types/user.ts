export interface User {
    user_id: string
    name: string
    username: string
    bio: string | null
    avatar_url: string | null
    cover_url: string | null
    followers_count: number
    following_count: number
    country: string | null
    created_at: string
}

export interface UserAction extends User {
    is_follower: boolean
    is_following: boolean
    is_muted: boolean
    is_blocked: boolean
    top_mutual_followers: string[]
    mutual_followers_count: number
}

export interface MeApiResponse {
    data: User
    count: number
    message: string
}

export interface UserApiResponse {
    data: UserAction
    count: number
    message: string
}

export interface ActionApiResponse {
    count: number
    message: string
}

export interface ApiErrorResponse {
    message: string
    error: string
    statusCode: number
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

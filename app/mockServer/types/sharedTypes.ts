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

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

export interface UserAction {
    user_id: string
    name: string
    username: string
    bio: string | null
    avatar_url: string | null
    cover_url: string | null
    is_following: boolean
    is_follower: boolean
    is_muted: boolean
    is_blocked: boolean
    followers_count: number
    following_count: number
    country?: string | null
    created_at?: string
    birth_date?: string
}

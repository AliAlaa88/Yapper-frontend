import type { User } from '~/modules/Common/types/user'

export interface Me {
    user_id: string
    name: string
    username: string
    bio: string | null
    avatar_url: string | null
    cover_url: string | null
    country: string | null
    created_at: string
    birth_date: string
    followers_count: number
    following_count: number
    num_posts?: number
    num_replies?: number
    num_media?: number
    num_likes?: number
}

export interface OtherUser {
    user_id: string
    name: string
    username: string
    bio: string | null
    avatar_url: string | null
    is_follower: boolean
    is_following: boolean
    is_muted: boolean
    cover_url?: string | null
    is_blocked?: boolean
    followers_count?: number
    following_count?: number
    country?: string | null
    created_at?: string
    birth_date?: string
    top_mutual_followers: User[]
    mutual_followers_count: string
    num_posts?: number
    num_replies?: number
    num_media?: number
    num_likes?: number
}

export interface FollowUser {
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
export interface FollowUsersPage {
    data: FollowUser[]
    nextCursor?: string
    hasMore?: boolean
}

interface User {
    id: string
    name: string
    username: string
    avatar_url: string
    verified: boolean
    is_following?: boolean
    link?: string
    bio?: string
    followers_count?: number
    following_count?: number
}

export type { User }
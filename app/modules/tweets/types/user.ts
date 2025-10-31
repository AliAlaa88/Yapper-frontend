interface User {
    id: string
    name: string
    username: string
    avatar: string
    link?: string
    bio?: string
    followers_count?: number
    following_count?: number
}

export type { User }
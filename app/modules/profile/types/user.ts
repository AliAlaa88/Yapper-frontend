export interface UserProfile {
    id: string
    username: string
    displayName: string
    bio?: string
    avatarUrl?: string
    coverUrl?: string
    followersCount: number
    followingCount: number
    verified: boolean
}

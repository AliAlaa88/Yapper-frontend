import type { UserAction } from '../types/user'

// TODO: fetch my data from auth store
const me: UserAction = {
    id: '1d149899-e706-4c8f-97d7-ba2e9fc22d7c',
    name: 'Mohamed Hassan',
    username: 'mhassan123',
    bio: 'Software developer from Cairo',
    avatar_url: 'https://randomuser.me/api/portraits/men/15.jpg',
    cover_url: 'https://randomuser.me/api/portraits/men/16.jpg',
    followers_count: 2,
    following_count: 1,
    country: 'Egypt',
    created_at: '2025-09-15',
    is_follower: false,
    is_following: false,
    is_muted: false,
    is_blocked: false,
}

export const useMe = (username: string): { isMe: boolean } => {
    return { isMe: username === me.username }
}

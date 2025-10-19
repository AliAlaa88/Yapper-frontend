import type { UserProfile } from '../types/user'
const mockUsers: UserProfile[] = [
    {
        id: '0c059899-f706-4c8f-97d7-ba2e9fc22d6d',
        name: 'Ali',
        username: 'ali',
        bio: 'hi there!',
        avatar_url: 'https://cdn.app.com/profiles/u877.jpg',
        cover_url: 'https://cdn.app.com/profiles/u877.jpg',
        followers_count: 5,
        following_count: 15,
        country: 'Egypt',
        created_at: '2025-10-30',
    },
]

export const userInfoServiceMock = {
    async getUserInfoByUsername(username: string): Promise<UserProfile> {
        console.log('Mock getUserInfoByUsername called with:', username)
        return Promise.resolve(mockUsers.find((user) => user.username === username) as UserProfile)
    },
}

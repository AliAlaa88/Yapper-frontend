import type { UserProfile } from '../types/user'
const mockUsers: UserProfile[] = [
    {
        id: '1',
        username: 'mock_user',
        displayName: 'Mock User',
        bio: 'This is a mock user.',
        followersCount: 1234,
        followingCount: 567,
        verified: true,
    },
    {
        id: '2',
        username: 'mock_user',
        displayName: 'Mock User',
        bio: 'This is a mock user.',
        followersCount: 1234,
        followingCount: 567,
        verified: true,
    },
    {
        id: '3',
        username: 'mock_user',
        displayName: 'Mock User',
        bio: 'This is a mock user.',
        followersCount: 1234,
        followingCount: 567,
        verified: true,
    },
]

export const userInfoServiceMock = {
    async getUserInfoByUsername(username: string): Promise<UserProfile> {
        console.log('Mock getUserInfoByUsername called with:', username)
        return Promise.resolve(mockUsers.find((user) => user.username === username) as UserProfile)
    },
}

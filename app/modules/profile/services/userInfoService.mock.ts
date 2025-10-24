import type { User } from '../types/user'

const users: User[] = [
    {
        id: '1',
        username: 'me',
        name: 'Hagar Abdelsalam',
        followers_count: 2,
        following_count: 1,
        is_follower: false,
        is_following: false,
        is_muted: false,
        is_blocked: false,
    },
    {
        id: '2',
        username: 'hagar',
        name: 'hagar3bdelsalam',
        followers_count: 1,
        following_count: 1,
        is_follower: true,
        is_following: false,
        is_muted: false,
        is_blocked: false,
    },
    {
        id: '3',
        username: 'sarah',
        name: 'sarah Mohamed',
        followers_count: 10,
        following_count: 20,
        is_follower: true,
        is_following: true,
        is_muted: true,
        is_blocked: false,
    },
]

export const userInfoServiceMock = {
    // async getMyProfile():Promise<UserProfile> {
    //     return Promise.resolve(mockUsers.at(0) as UserProfile)
    // },

    async getUserInfoByUsername(username: string): Promise<User> {
        console.log('Mock getUserInfoByUsername called with:', username)
        const user = users.find((user) => user.username === username)
        return Promise.resolve({...user} as User)
    },

    async getUserByID(userId: string): Promise<User> {
        const user = users.find((user) => user.id === userId)
        console.log(user)
        return Promise.resolve({...user} as User)
    },

    async followUser(userId: string) {
        const user = users.find((user) => user.id === userId)
        if (!user) throw new Error('user not found')
        user.is_following = true
        user.followers_count++
        // should increase the number of my following
        return user
    },

    async unfollowUser(userId: string) {
        const user = users.find((user) => user.id === userId)
        if (!user) throw new Error('user not found')
        user.is_following = false
        if (user.followers_count > 0) user.followers_count--
        return user
    },

    async blockUser(userId: string) {
        const user = users.find((user) => user.id === userId)
        if (!user) throw new Error('user not found')
        user.is_blocked = true
        console.log('from service', user.is_blocked)
        if (user.is_following) {
            user.is_following = false
            if (user.followers_count > 0) user.followers_count--
        }
        return user
    },

    async unblockUser(userId: string) {
        const user = users.find((user) => user.id === userId)
        if (!user) throw new Error('user not found')
        user.is_blocked = false
        return user
    },

    async muteUser(userId: string) {
        const user = users.find((user) => user.id === userId)
        if (!user) throw new Error('user not found')
        user.is_muted = true
        return user
    },

    async unmuteUser(userId: string) {
        const user = users.find((user) => user.id === userId)
        if (!user) throw new Error('user not found')
        user.is_muted = false
        return user
    },

    async removeFollower(userId: string) {
        const user = users.find((user) => user.id === userId)
        if (!user) throw new Error('user not found')
        if (user.is_follower) {
            user.is_follower = false
            user.following_count--
        }
        return user
    },
}

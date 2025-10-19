import type { UserProfile } from '../types/user'
const mockUsers: UserProfile[] = [
    {
        id: '0c059899-f706-4c8f-97d7-ba2e9fc22d6d',
        name: 'Ali',
        username: 'ali',
        bio: 'hi there!',
        avatar_url:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMEOvbEUtnNDEJOwt8taSM0LOv_C6kMh31mC-PHu9uAtnDz2ndfg7v1Fl0rGKnVamjXms&usqp=CAU',
        cover_url:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMEOvbEUtnNDEJOwt8taSM0LOv_C6kMh31mC-PHu9uAtnDz2ndfg7v1Fl0rGKnVamjXms&usqp=CAU',
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

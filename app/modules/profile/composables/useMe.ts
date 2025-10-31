// import { useUserInfoQuery } from '../queries/useUserInfoQuery'
import type { User } from '../types/user'

// TODO: fetch my data from auth store
const me: User = {
    user_id: '74f0598d-91f1-434d-85de-c611c5a57b9d',
    name: 'Hagar Abdelsalam',
    username: 'hagar_abdelsalam',
    bio: null,
    avatar_url: null,
    cover_url: null,
    followers_count: 0,
    following_count: 1,
    country: null,
    created_at: '2025-10-30T20:31:39.712Z',
}

// export functi useMe = (username: string): { isMe: boolean } => {
//     return { isMe: username === me.username }
// }

export function useMe(username: string) {
    // const { myQuery } = useUserInfoQuery(username)
    // const me = myQuery.data
    // console.log('use me', me)
    return {isMe : username === me.username}
}

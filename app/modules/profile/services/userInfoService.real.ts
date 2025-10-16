import type { UserProfile } from '../types/user'

export const userInfoServiceReal = {
    async getUserInfoByUsername(username: string): Promise<UserProfile> {
        throw new Error(`userInfoServiceReal.getUserInfoByUsername not implemented yet${username}"`)
    },
}

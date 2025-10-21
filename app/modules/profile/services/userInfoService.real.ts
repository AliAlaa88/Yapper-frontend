import type { User } from '../types/user'

export const userInfoServiceReal = {
    async getUserInfoByUsername(username: string): Promise<User> {
        throw new Error(`userInfoServiceReal.getUserInfoByUsername not implemented yet${username}"`)
    },
}

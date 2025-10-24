import type { UserAction } from '../types/user'

export const userInfoServiceReal = {
    async getUserInfoByUsername(username: string): Promise<UserAction> {
        throw new Error(`userInfoServiceReal.getUserInfoByUsername not implemented yet${username}"`)
    },
}

import type { UserAction } from '../types/user'

export const userInfoServiceReal = {
    async getUserInfoByUsername(username: string): Promise<UserAction> {
        throw new Error(`userInfoServiceReal.getUserInfoByUsername not implemented yet${username}"`)
    },

    async updateUserProfile(userId: string, updates: Partial<UserAction>): Promise<UserAction> {
        throw new Error(
            `userInfoServiceReal.updateUserProfile not implemented yet${userId}${JSON.stringify(updates)}`,
        )
    },
}

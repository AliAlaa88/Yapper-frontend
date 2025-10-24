import type { User } from '../types/user'
import { useNuxtApp } from '#app'

export const userInfoServiceMock = {
    async getUserInfoByUsername(username: string): Promise<User> {
        const { $axios } = useNuxtApp()
        const response = await $axios.get<User[]>('/users', {
            params: { username },
        })
        const user = response.data[0]
        if (!user) {
            throw new Error(`User not found: ${username}`)
        }
        return user
    },
}

import type { UserAction } from '../types/user'
import { useNuxtApp } from 'nuxt/app'

export const userInfoServiceMock = {
    async getUserInfoByUsername(username: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()
        const response = await $axios.get<UserAction[]>('/users', {
            params: { username },
        })
        const user = response.data[0]
        if (!user) {
            throw new Error(`User not found: ${username}`)
        }
        return user
    },

    async getUserByID(userId: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()
        const response = await $axios.get<UserAction[]>('/users', {
            params: { user_id: userId },
        })
        const user = response.data[0]
        if (!user) {
            throw new Error(`User not found: ${userId}`)
        }
        return user
    },

    async followUser(userId: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()

        const response = await $axios.get<UserAction>(`/users/${userId}`)
        const user = response.data

        if (!user) throw new Error('User not found')

        const updatedData = {
            ...user,
            is_following: true,
            followers_count: user.followers_count + 1,
        }

        const updatedUser = await $axios.request<UserAction>({
            method: 'PUT',
            url: `/users/${userId}`,
            data: updatedData,
        })

        return updatedUser.data
    },

    async unfollowUser(userId: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()

        const response = await $axios.get<UserAction>(`/users/${userId}`)
        const user = response.data

        if (!user) throw new Error('User not found')

        const updatedData = {
            ...user,
            is_following: false,
            followers_count: user.followers_count > 0 ? user.followers_count - 1 : 0,
        }

        const updatedUser = await $axios.request<UserAction>({
            method: 'PUT',
            url: `/users/${userId}`,
            data: updatedData,
        })

        return updatedUser.data
    },

    async blockUser(userId: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()

        const response = await $axios.get<UserAction>(`/users/${userId}`)
        const user = response.data

        if (!user) throw new Error('User not found')

        const updatedData: UserAction = {
            ...user,
            is_blocked: true,
        }

        if (user.is_following) {
            updatedData.is_following = false
            updatedData.followers_count = user.followers_count > 0 ? user.followers_count - 1 : 0
        }

        const updatedUser = await $axios.request<UserAction>({
            method: 'PUT',
            url: `/users/${userId}`,
            data: updatedData,
        })

        return updatedUser.data
    },

    async unblockUser(userId: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()

        const response = await $axios.get<UserAction>(`/users/${userId}`)
        const user = response.data

        if (!user) throw new Error('User not found')

        const updatedData = {
            ...user,
            is_blocked: false,
        }

        const updatedUser = await $axios.request<UserAction>({
            method: 'PUT',
            url: `/users/${userId}`,
            data: updatedData,
        })

        return updatedUser.data
    },

    async muteUser(userId: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()

        const response = await $axios.get<UserAction>(`/users/${userId}`)
        const user = response.data

        if (!user) throw new Error('User not found')

        const updatedData = {
            ...user,
            is_muted: true,
        }

        const updatedUser = await $axios.request<UserAction>({
            method: 'PUT',
            url: `/users/${userId}`,
            data: updatedData,
        })

        return updatedUser.data
    },

    async unmuteUser(userId: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()

        const response = await $axios.get<UserAction>(`/users/${userId}`)
        const user = response.data

        if (!user) throw new Error('User not found')

        const updatedData = {
            ...user,
            is_muted: false,
        }

        const updatedUser = await $axios.request<UserAction>({
            method: 'PUT',
            url: `/users/${userId}`,
            data: updatedData,
        })

        return updatedUser.data
    },

    async removeFollower(userId: string): Promise<UserAction> {
        const { $axios } = useNuxtApp()

        const response = await $axios.get<UserAction>(`/users/${userId}`)
        const user = response.data

        if (!user) throw new Error('User not found')

        const updatedData: UserAction = {
            ...user,
        }

        if (user.is_follower) {
            updatedData.is_follower = false
            updatedData.following_count = user.following_count > 0 ? user.following_count - 1 : 0
        }

        const updatedUser = await $axios.request<UserAction>({
            method: 'PUT',
            url: `/users/${userId}`,
            data: updatedData,
        })

        return updatedUser.data
    },

    async updateUserProfile(userId: string, updates: Partial<UserAction>): Promise<UserAction> {
        const { $axios } = useNuxtApp()

        const response = await $axios.get<UserAction>(`/users/${userId}`)
        const user = response.data

        if (!user) throw new Error('User not found')

        const updatedData = {
            ...user,
            ...updates,
        }

        const updatedUser = await $axios.request<UserAction>({
            method: 'PATCH',
            url: `/users/${userId}`,
            data: updatedData,
        })

        return updatedUser.data
    },
}

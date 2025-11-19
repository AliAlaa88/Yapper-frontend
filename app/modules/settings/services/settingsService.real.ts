import axios from 'axios'
import { useNuxtApp } from 'nuxt/app'
import type { Lists } from '../types/settings'
import type { OtherUser } from '~/modules/profile/types/user'
export const settingsService = {
    async getMuted(): Promise<OtherUser[]> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<Lists>('/users/me/muted')
            if (!response.data || !response.data.data) {
                throw new Error('Muted users not found')
            }
            const myData = response.data.data
            console.log('Muted users', myData)
            return myData
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('Muted users not found')
                }
            }
            throw new Error('Something went wrong')
        }
    },
    async getBlocked(): Promise<OtherUser[]> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<Lists>('/users/me/blocked')
            if (!response.data || !response.data.data) {
                throw new Error('Blocked users not found')
            }
            const myData = response.data.data
            console.log('Blocked users', myData)
            return myData
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('Blocked users not found')
                }
            }
            throw new Error('Something went wrong')
        }
    },
}

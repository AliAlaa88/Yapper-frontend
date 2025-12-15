import axios from 'axios'
import { useNuxtApp } from 'nuxt/app'
import type {
    MentionsApiResponse,
    NotificationsApiData,
    NotificationsApiResponse,
    MentionsApiData,
} from '../types/notifications'

export const createNotificationsService = () => ({
    async getNotifications(page: number = 1): Promise<NotificationsApiData> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<NotificationsApiResponse>('/notifications', {
                params: { page },
            })
            console.log('notifications service', response.data)
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Failed to fetch notifications')
        }
    },

    async getMentions(page: number = 1): Promise<MentionsApiData> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<MentionsApiResponse>('/notifications/mentions', {
                params: { page },
            })
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Failed to fetch mentions')
        }
    },
})

export type notificationsService = ReturnType<typeof createNotificationsService>

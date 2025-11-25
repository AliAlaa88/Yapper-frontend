import axios from 'axios'
import { useNuxtApp } from 'nuxt/app'
import type { ConversationApiResponse, Conversation } from '../types'
const urls = {
    getConversations: '/chat',
    createConversation: '/chat',
    markAsRead(chatId: string): string { return `/chat/chats/${chatId}/read` },
    
}

export const chatServices = {
    async getConversations(): Promise<Conversation[]> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<ConversationApiResponse>(urls.getConversations)
            if (!response.data || !response.data.data) {
                throw new Error('Conversations not found')
            }
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async markAsRead(chatId: string,lastMessageId: string) {
        const { $axios } = useNuxtApp()
        try {
            await $axios.post(urls.markAsRead(chatId), { last_read_message_id: lastMessageId })
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async createConversation(userId: string) {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.post<Conversation>(urls.createConversation, { recipient_id: userId })
            if (!response.data) {
                throw new Error('Conversation not found')
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    }
    
    


}
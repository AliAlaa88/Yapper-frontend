import axios from 'axios'
import { useNuxtApp } from 'nuxt/app'
import type { ConversationApiResponse, Conversation, MessagesResponse } from '../types'

const urls = {
    getConversations: '/chat',
    createConversation: '/chat',
    markAsRead: (chatId: string) => `/chat/chats/${chatId}/read`,
    getMessages: (chatId: string) => `/messages/chats/${chatId}/messages`,
}

export const createChatService = () => ({
    getConversations: async (
        cursor: string | null = null,
        limit: number = 20,
    ): Promise<{ data: Conversation[]; nextCursor: string | null }> => {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<ConversationApiResponse>(urls.getConversations, {
                params: {
                    cursor,
                    limit,
                },
            })
            if (!response.data || !response.data.data) {
                throw new Error('Conversations not found')
            }
            return {
                data: response.data.data.data,
                nextCursor: response.data.data.pagination.next_cursor,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    markAsRead: async (chatId: string, lastMessageId: string) => {
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

    createConversation: async (userId: string) => {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.post<Conversation>(urls.createConversation, {
                recipient_id: userId,
            })
            if (!response.data) {
                throw new Error('Conversation not found')
            }
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    getMessages: async (
        chatId: string,
        options?: { limit?: number; before?: string },
    ): Promise<MessagesResponse> => {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<MessagesResponse>(urls.getMessages(chatId), {
                params: {
                    limit: options?.limit || 50,
                    before: options?.before,
                },
            })
            if (!response.data) {
                throw new Error('Messages not found')
            }
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
                if (error.response?.status === 403) {
                    throw new Error('Unauthorized access to chat')
                }
                if (error.response?.status === 404) {
                    throw new Error('Chat not found')
                }
            }
            throw new Error('Something went wrong')
        }
    },
})

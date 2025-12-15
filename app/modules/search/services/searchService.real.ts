import axios from 'axios'
import type { SearchSuggestion } from '../types'
import { useNuxtApp } from 'nuxt/app'

export const searchServiceReal = {
    async getSearchSuggestions(query: string): Promise<SearchSuggestion> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get(
                '/search/suggestions?query=' + encodeURIComponent(query),
            )
            if (!response.data) {
                throw new Error('Data not found')
            }
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                }
            }
            throw new Error('Something went wrong')
        }
    },

    async getUsers(query: string) {
        const { $axios } = useNuxtApp()
        try {
            console.log('[searchService] mention suggestions request', { query })

            const response = await $axios.get('/search/mention-suggestions', {
                params: { query },
            })

            const users = response.data?.data

            if (!users || !Array.isArray(users)) {
                throw new Error('Data not found')
            }

            console.log('[searchService] mention suggestions response', { count: users.length })

            return users
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                }
            }
            throw new Error('Something went wrong')
        }
    },
}

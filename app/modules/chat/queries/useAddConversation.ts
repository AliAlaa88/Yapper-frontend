import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import { useI18n } from 'vue-i18n'

export function useAddConversation() {
    const { $axios } = useNuxtApp()

    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await $axios.post('/api/conversations', { userId })
        },
    })
}

import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'

export function useAddConversation() {
    const { $chatService } = useNuxtApp()

    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await ($chatService as any).createConversation(userId)
            return response
        },
    })
}

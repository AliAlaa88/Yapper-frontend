import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import { cacheInvalidation } from '~/modules/Common/queries'

export function useAddConversation() {
    const { $chatService, $queryClient } = useNuxtApp()

    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await ($chatService as any).createConversation(userId)
            return response
        },
        onSuccess: () => {
            cacheInvalidation.onConversationCreate($queryClient)
        },
    })
}

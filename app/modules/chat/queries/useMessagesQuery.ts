import { useInfiniteQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRef } from 'vue'
import { useNuxtApp } from '#app'
import type { MessagesPage } from '../types'

export const useMessagesQuery = (chatId: MaybeRef<string | undefined>) => {
    const { $chatService } = useNuxtApp()

    return useInfiniteQuery({
        queryKey: ['messages', chatId],
        queryFn: async ({ pageParam }): Promise<MessagesPage> => {
            const id = toValue(chatId)
            if (!id) throw new Error('Chat ID is required')

            return await $chatService.getMessages(id, {
                limit: 50,
                cursor: pageParam,
            })
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.nextCursor
            }
            return undefined
        },
        initialPageParam: undefined as string | undefined,
        enabled: () => !!toValue(chatId),
    })
}

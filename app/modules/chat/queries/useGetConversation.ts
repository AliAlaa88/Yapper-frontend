import { useInfiniteQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Conversation } from '../types'

interface ConversationsPage {
    data: Conversation[]
    nextCursor: string | null
}

export function useGetConversation(limit: number = 20) {
    const { $chatService } = useNuxtApp()

    return useInfiniteQuery({
        queryKey: ['conversations'],
        queryFn: async ({ pageParam }): Promise<ConversationsPage> => {
            return await ($chatService as any).getConversations(pageParam, limit)
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null as string | null,
    })
}

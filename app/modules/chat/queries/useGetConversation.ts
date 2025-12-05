import { useInfiniteQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Conversation } from '../types'

interface ConversationsPage {
    data: Conversation[]
    nextCursor: string | null
    hasMore: boolean
}

export function useGetConversation(limit: number = 20) {
    const { $chatService } = useNuxtApp()

    return useInfiniteQuery({
        queryKey: ['conversations'],
        queryFn: async ({ pageParam }): Promise<ConversationsPage> => {
            const result = await ($chatService as any).getConversations(pageParam, limit)

            const sortedData = [...result.data].sort((a, b) => {
                const aTime = a.last_message?.created_at
                    ? new Date(a.last_message.created_at).getTime()
                    : 0
                const bTime = b.last_message?.created_at
                    ? new Date(b.last_message.created_at).getTime()
                    : 0
                return bTime - aTime
            })

            return {
                ...result,
                data: sortedData,
            }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.nextCursor
            }
            return undefined
        },
        initialPageParam: null as string | null,
    })
}

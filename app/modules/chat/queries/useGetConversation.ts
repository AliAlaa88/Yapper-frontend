import { useInfiniteQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'

export function useGetConversation(cursor: string | null = null, limit: number = 20) {
    const { $chatService } = useNuxtApp()

    return useInfiniteQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            return await ($chatService as any).getConversations(cursor, limit)
        },
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
        initialPageParam: null,
    })
}

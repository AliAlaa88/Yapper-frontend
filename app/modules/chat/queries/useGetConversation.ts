import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Ref } from 'vue'
import { computed, unref, ref } from 'vue'
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

export function useGetConversationById(chatId: string | Ref<string> | (() => string)) {
    const { $chatService } = useNuxtApp()
    const chatIdRef =
        typeof chatId === 'function'
            ? computed(chatId)
            : typeof chatId === 'string'
                ? ref(chatId)
                : chatId
    const chatIdValue = computed(() => unref(chatIdRef))

    return useQuery({
        queryKey: computed(() => ['conversation', chatIdValue.value]),
        queryFn: async () => {
            return await ($chatService as any).getConversationById(chatIdValue.value)
        },
        enabled: computed(() => !!chatIdValue.value),
    })
}

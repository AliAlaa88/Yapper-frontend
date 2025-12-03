import { useInfiniteQuery } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import type { Message, MessageSender } from '../types'

interface MessagesQueryData {
    messages: Message[]
    sender: MessageSender
    nextCursor?: string
}

export const useMessagesQuery = (chatId: MaybeRef<string | undefined>) => {
    const { $chatService } = useNuxtApp()

    return useInfiniteQuery({
        queryKey: ['messages', chatId],
        queryFn: async ({ pageParam }): Promise<MessagesQueryData> => {
            const id = toValue(chatId)
            if (!id) throw new Error('Chat ID is required')

            const response = await $chatService.getMessages(id, {
                limit: 50,
                before: pageParam,
            })

            const messages = response.data.messages
            const oldestMessage = messages[0]
            const nextCursor = messages.length === 50 ? oldestMessage?.id : undefined

            return {
                messages: response.data.messages,
                sender: response.data.sender,
                nextCursor,
            }
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: undefined as string | undefined,
        enabled: () => !!toValue(chatId),
    })
}

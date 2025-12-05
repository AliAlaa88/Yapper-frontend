<template>
    <div class="flex flex-col h-full border-r border-primary">
        <div
            class="p-3 flex items-center justify-between sticky top-0 bg-primary/80 backdrop-blur-md z-10 border-b border-primary"
        >
            <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold text-primary">{{ $t('chat.messages') }}</h1>

                <span
                    v-if="totalUnreadCount > 0"
                    class="bg-accent text-primary text-xs font-bold px-2 py-0.5 rounded-full"
                >
                    {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
                </span>
            </div>
            <button
                id="new-chat-button"
                class="p-2 hover:bg-hover rounded-full cursor-pointer transition-colors"
            >
                <MessageSquarePlus class="w-5 h-5 text-primary" />
            </button>
        </div>
        <div ref="scrollContainerRef" class="overflow-y-auto flex-1">
            <ConversationItem
                v-for="chat in conversations"
                :key="chat.id"
                :conversation="chat"
                :is-selected="selectedChatId === chat.id"
                @click="handleSelectConversation(chat)"
            />
            <div v-if="hasNextPage && !isFetching" ref="sentinelRef" class="h-1" />

            <div v-if="isFetching" class="flex justify-center p-4">
                <LoadingSpinner />
            </div>

            <div
                v-if="!isFetching && conversations.length === 0"
                class="flex flex-col items-center justify-center p-8 text-center"
            >
                <MessageSquarePlus class="w-12 h-12 text-secondary mb-4" />
                <p class="text-secondary">{{ $t('chat.noMessagesYet') }}</p>
                <p class="text-sm text-muted">{{ $t('chat.noMessagesYetDescription') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MessageSquarePlus } from 'lucide-vue-next'
import type { Conversation } from '~/modules/chat/types'
import ConversationItem from './subComponents/ConversationItem/ConversationItem.vue'
import { useGetConversation } from '~/modules/chat/queries/useGetConversation'
import { useIntersectionObserver } from '@vueuse/core'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'

const props = defineProps<{
    selectedChatId?: string | null
}>()

const emit = defineEmits<{
    (e: 'select-conversation', conversation: Conversation): void
}>()

const router = useRouter()
const { $chatSocketService } = useNuxtApp()

const handleSelectConversation = (conversation: Conversation) => {
    router.push(`/messages/${conversation.id}`)
    emit('select-conversation', conversation)
}

const { data, isFetching, fetchNextPage, hasNextPage } = useGetConversation()
const sentinelRef = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)

const conversations = computed(() => {
    return data.value?.pages.flatMap((page) => page.data) || []
})

const totalUnreadCount = computed(() => $chatSocketService.totalUnreadCount.value)

useIntersectionObserver(
    sentinelRef,
    ([entry]) => {
        if (entry?.isIntersecting && hasNextPage.value && !isFetching.value) {
            fetchNextPage()
        }
    },
    {
        root: scrollContainerRef,
        rootMargin: '100px',
    },
)
</script>

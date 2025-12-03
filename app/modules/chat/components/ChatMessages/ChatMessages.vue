<template>
    <div class="flex flex-col h-full bg-primary">
        <!-- Header -->
        <div
            class="p-4 flex items-center justify-between sticky top-0 bg-primary/80 backdrop-blur-md z-10 border-b border-primary"
        >
            <div class="flex items-center gap-3">
                <img
                    v-if="senderInfo?.avatar_url || participant?.avatar"
                    :src="senderInfo?.avatar_url || participant?.avatar"
                    :alt="senderInfo?.username || participant?.username"
                    class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h2 class="font-bold text-primary">
                        {{ senderInfo?.name || participant?.name || 'Chat' }}
                    </h2>
                    <p class="text-sm text-secondary">
                        @{{ senderInfo?.username || participant?.username || '' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Messages List -->
        <div ref="messagesContainerRef" class="flex-1 overflow-y-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center h-full">
                <div
                    class="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full"
                />
            </div>

            <!-- Error State -->
            <div v-else-if="isError" class="flex items-center justify-center h-full">
                <p class="text-red-500">Failed to load messages</p>
            </div>

            <!-- Empty State -->
            <div
                v-else-if="messagesWithSender.length === 0"
                class="flex items-center justify-center h-full"
            >
                <p class="text-secondary">No messages yet. Start the conversation!</p>
            </div>

            <!-- Messages -->
            <template v-else>
                <!-- Load More Button -->
                <div v-if="hasNextPage" class="flex justify-center py-4">
                    <button
                        class="text-accent hover:underline text-sm"
                        :disabled="isFetchingNextPage"
                        @click="() => fetchNextPage()"
                    >
                        {{ isFetchingNextPage ? 'Loading...' : 'Load older messages' }}
                    </button>
                </div>

                <Message
                    v-for="message in messagesWithSender"
                    :key="message.id"
                    :message="message"
                    :current-user-id="currentUserId"
                />
            </template>

            <!-- Typing Indicator -->
            <TypingIndicator
                v-if="conversationId"
                :chat-id="conversationId"
                :user-name="senderInfo?.name || participant?.name"
            />
        </div>

        <!-- Input Bar -->
        <InputBar v-if="conversationId" :conversation-id="conversationId" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import Message from './SubComponents/Message/Message.vue'
import InputBar from './SubComponents/InputBar/InputBar.vue'
import TypingIndicator from '../TypingIndicator/TypingIndicator.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { useMessagesQuery } from '../../queries/useMessagesQuery'
import { storeToRefs } from 'pinia'
import type { participant } from '~/modules/chat/types'

const props = defineProps<{
    conversationId?: string
    participant?: participant
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const currentUserId = computed(() => user.value?.id || '')

const messagesContainerRef = ref<HTMLElement | null>(null)

const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMessagesQuery(computed(() => props.conversationId))

// Get sender info from the first page
const senderInfo = computed(() => {
    return data.value?.pages[0]?.sender
})

// Flatten paginated messages and add sender info
const messagesWithSender = computed(() => {
    if (!data.value?.pages) return []

    const sender = senderInfo.value
    const currentUser = user.value

    return data.value.pages
        .slice()
        .reverse()
        .flatMap((page) => page.messages)
        .map((message) => {
            const isOwnMessage = message.sender_id === currentUserId.value
            return {
                ...message,
                sender: isOwnMessage
                    ? {
                          id: currentUser?.id || '',
                          name: currentUser?.name || 'You',
                          username: currentUser?.username || 'you',
                          avatar: currentUser?.avatar_url || '',
                      }
                    : {
                          id: sender?.id || '',
                          name: sender?.name || '',
                          username: sender?.username || '',
                          avatar: sender?.avatar_url || '',
                      },
            }
        })
})

const scrollToBottom = () => {
    if (messagesContainerRef.value) {
        messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
    }
}

// Watch for new messages and scroll to bottom
watch(
    () => messagesWithSender.value.length,
    (newLength, oldLength) => {
        // Only scroll if new messages added at the end (not when loading older)
        if (newLength > oldLength && !isFetchingNextPage.value) {
            nextTick(() => {
                scrollToBottom()
            })
        }
    },
)

onMounted(() => {
    nextTick(() => {
        scrollToBottom()
    })
})
</script>

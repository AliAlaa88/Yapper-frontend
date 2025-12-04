<template>
    <div class="flex flex-col h-full bg-primary">
        <!-- Header -->
        <div
            class="p-4 flex items-center justify-between sticky top-0 bg-primary/80 backdrop-blur-md z-10 border-b border-primary"
        >
            <div class="flex items-center gap-3">
                <img
                    v-if="participant?.avatar_url"
                    :src="participant.avatar_url"
                    :alt="participant?.username"
                    class="w-10 h-10 rounded-full object-cover"
                />
                <img
                    v-else
                    :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(participant?.name || 'User')}`"
                    :alt="participant?.username"
                    class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h2 class="font-bold text-primary">
                        {{ participant?.name || 'Chat' }}
                    </h2>
                    <p class="text-sm text-secondary">@{{ participant?.username || '' }}</p>
                </div>
            </div>
        </div>

        <!-- Messages List -->
        <div ref="messagesContainerRef" class="flex-1 overflow-y-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>

            <!-- Error State -->
            <div v-else-if="isError" class="flex items-center justify-center h-full">
                <p class="text-red-500">Failed to load messages</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="messages.length === 0" class="flex items-center justify-center h-full">
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
                    v-for="message in messages"
                    :key="message.id"
                    :message="message"
                    :current-user-id="user?.id || ''"
                />
            </template>

            <!-- Typing Indicator -->
            <TypingIndicator
                v-if="conversationId"
                :chat-id="conversationId"
                :user-name="participant?.name"
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
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
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

const messagesContainerRef = ref<HTMLElement | null>(null)

const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMessagesQuery(computed(() => props.conversationId))

// Flatten paginated messages - each message already has its sender
const messages = computed(() => {
    if (!data.value?.pages) return []

    return data.value.pages
        .slice()
        .reverse()
        .flatMap((page) => page.messages)
})

const scrollToBottom = () => {
    if (messagesContainerRef.value) {
        messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
    }
}

watch(
    () => messages.value.length,
    (newLength, oldLength) => {
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

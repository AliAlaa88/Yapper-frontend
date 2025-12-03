<template>
    <div class="flex flex-col h-full bg-primary">
        <!-- Header -->
        <div
            class="p-4 flex items-center justify-between sticky top-0 bg-primary/80 backdrop-blur-md z-10 border-b border-primary"
        >
            <div class="flex items-center gap-3">
                <img
                    v-if="participant?.avatar"
                    :src="participant.avatar"
                    :alt="participant.username"
                    class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h2 class="font-bold text-primary">{{ participant?.name || 'Chat' }}</h2>
                    <p class="text-sm text-secondary">@{{ participant?.username || '' }}</p>
                </div>
            </div>
        </div>

        <!-- Messages List -->
        <div ref="messagesContainerRef" class="flex-1 overflow-y-auto">
            <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
                <p class="text-secondary">No messages yet. Start the conversation!</p>
            </div>
            <Message
                v-for="message in messages"
                :key="message.id"
                :message="message"
                :current-user-id="currentUserId"
            />
            
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
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import type { participant } from '~/modules/chat/types'

interface MessageWithSender {
    id: string
    content: string
    message_type: string
    sender_id: string
    created_at: string
    is_read: boolean
    sender: {
        id: string
        name: string
        username: string
        avatar: string
    }
    media?: Array<{
        url: string
        type: 'image' | 'video'
    }>
}

const props = defineProps<{
    conversationId?: string
    participant?: participant
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const currentUserId = computed(() => user.value?.id || 'current-user-id')

const messagesContainerRef = ref<HTMLElement | null>(null)

// TODO: Replace with real messages from query
const messages = ref<MessageWithSender[]>([])

const scrollToBottom = () => {
    if (messagesContainerRef.value) {
        messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
    }
}

// Watch for new messages and scroll to bottom
watch(
    () => messages.value.length,
    () => {
        nextTick(() => {
            scrollToBottom()
        })
    }
)

onMounted(() => {
    nextTick(() => {
        scrollToBottom()
    })
})
</script>

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
        </div>

        <!-- Input Bar -->
        <InputBar @send="handleSendMessage" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import Message from './SubComponents/Message/Message.vue'
import InputBar from './SubComponents/InputBar/InputBar.vue'
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

// Mock messages data
const messages = ref<MessageWithSender[]>([
    {
        id: '1',
        content: 'Hey! How are you doing?',
        message_type: 'text',
        sender_id: 'other-user-id',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        is_read: true,
        sender: {
            id: 'other-user-id',
            name: 'Elon Musk',
            username: 'elonmusk',
            avatar: 'https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg',
        },
    },
    {
        id: '2',
        content: "I'm doing great! Thanks for asking. How about you?",
        message_type: 'text',
        sender_id: user.value?.id || 'current-user-id',
        created_at: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
        is_read: true,
        sender: {
            id: user.value?.id || 'current-user-id',
            name: user.value?.name || 'You',
            username: user.value?.username || 'you',
            avatar: user.value?.avatar_url || 'https://ui-avatars.com/api/?name=You',
        },
    },
    {
        id: '3',
        content: "I'm good too! Just working on some projects. Want to see something cool?",
        message_type: 'text',
        sender_id: 'other-user-id',
        created_at: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
        is_read: true,
        sender: {
            id: 'other-user-id',
            name: 'Elon Musk',
            username: 'elonmusk',
            avatar: 'https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg',
        },
    },
    {
        id: '4',
        content: 'Sure! Show me!',
        message_type: 'text',
        sender_id: user.value?.id || 'current-user-id',
        created_at: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
        is_read: true,
        sender: {
            id: user.value?.id || 'current-user-id',
            name: user.value?.name || 'You',
            username: user.value?.username || 'you',
            avatar: user.value?.avatar_url || 'https://ui-avatars.com/api/?name=You',
        },
    },
    {
        id: '5',
        content: 'Check this out!',
        message_type: 'text',
        sender_id: 'other-user-id',
        created_at: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
        is_read: true,
        sender: {
            id: 'other-user-id',
            name: 'Elon Musk',
            username: 'elonmusk',
            avatar: 'https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg',
        },
        media: [
            {
                url: 'https://picsum.photos/400/300',
                type: 'image',
            },
        ],
    },
    {
        id: '6',
        content: 'Wow, that looks amazing!',
        message_type: 'text',
        sender_id: user.value?.id || 'current-user-id',
        created_at: new Date(Date.now() - 2100000).toISOString(), // 35 minutes ago
        is_read: true,
        sender: {
            id: user.value?.id || 'current-user-id',
            name: user.value?.name || 'You',
            username: user.value?.username || 'you',
            avatar: user.value?.avatar_url || 'https://ui-avatars.com/api/?name=You',
        },
    },
])

const handleSendMessage = (data: {
    content: string
    media: Array<{ url: string; type: 'image' | 'video' }>
}) => {
    const newMessage: MessageWithSender = {
        id: Date.now().toString(),
        content: data.content,
        message_type: data.media.length > 0 ? 'media' : 'text',
        sender_id: user.value?.id || 'current-user-id',
        created_at: new Date().toISOString(),
        is_read: false,
        sender: {
            id: user.value?.id || 'current-user-id',
            name: user.value?.name || 'You',
            username: user.value?.username || 'you',
            avatar: user.value?.avatar_url || 'https://ui-avatars.com/api/?name=You',
        },
        media: data.media.length > 0 ? data.media : undefined,
    }

    messages.value.push(newMessage)

    // Scroll to bottom after new message
    nextTick(() => {
        scrollToBottom()
    })
}

const scrollToBottom = () => {
    if (messagesContainerRef.value) {
        messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
    }
}

onMounted(() => {
    // Scroll to bottom on mount
    nextTick(() => {
        scrollToBottom()
    })
})
</script>

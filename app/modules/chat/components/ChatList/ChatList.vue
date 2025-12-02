<template>
    <div class="flex flex-col h-full border-r border-primary">
        <div
            class="p-3 flex items-center justify-between sticky top-0 bg-primary/80 backdrop-blur-md z-10 border-b border-primary"
        >
            <h1 class="text-xl font-bold text-primary">Messages</h1>
            <button class="p-2 hover:bg-hover rounded-full cursor-pointer transition-colors">
                <MessageSquarePlus class="w-5 h-5 text-primary" />
            </button>
        </div>

        <div class="overflow-y-auto flex-1">
            <ConversationItem
                v-for="chat in mockConversations"
                :key="chat.id"
                :conversation="chat"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessageSquarePlus } from 'lucide-vue-next'
import type { Conversation } from '~/modules/chat/types'
import ConversationItem from './subComponents/ConversationItem/ConversationItem.vue'

// Mock data for UI testing
const mockConversations = ref<Conversation[]>([
    {
        id: '1',
        participant: {
            id: 'u1',
            name: 'Elon Musk',
            username: 'elonmusk',
            avatar: 'https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg',
        },
        last_message: {
            id: 'm1',
            content: 'I am buying Coca-Cola to put the cocaine back in',
            message_type: 'text',
            sender_id: 'u1',
            created_at: new Date().toISOString(),
            is_read: false,
        },
        unread_count: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        participant: {
            id: 'u2',
            name: 'Vue.js',
            username: 'vuejs',
            avatar: 'https://pbs.twimg.com/profile_images/1468993891584073729/a_op8KnL_400x400.jpg',
        },
        last_message: {
            id: 'm2',
            content: 'Have you tried Nuxt 4 yet?',
            message_type: 'text',
            sender_id: 'u2',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            is_read: true,
        },
        unread_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
])
</script>

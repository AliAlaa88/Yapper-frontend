<template>
    <div class="flex flex-col h-full border-r border-primary">
        <div class="p-3 flex items-center justify-between sticky top-0 bg-primary/80 backdrop-blur-md z-10">
            <h1 class="text-xl font-bold text-primary">Messages</h1>
            <div class="p-2 hover:bg-hover rounded-full cursor-pointer transition-colors">
                 <!-- Settings icon placeholder -->
                 <svg viewBox="0 0 24 24" aria-hidden="true" class="w-5 h-5 fill-primary"><g><path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92l2.35-1.57c.17-.12.26-.33.21-.53l-.58-2.54 2.17-2.17 2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.93 1.4c-.45.67-1.28.99-2.08.81l-1.6-.38-1.1.1.25 1.62c.12.78-.26 1.56-.96 1.96l-1.39.79v1.89l1.39.79c.7.4 1.08 1.19.96 1.96l-.26 1.62 1.1.11 1.6-.37c.8-.18 1.63.14 2.08.81l.93 1.4h1.89l.93-1.4c.45-.67 1.28-.99 2.08-.81l1.6.37 1.1-.11-.26-1.62c-.12-.78.26-1.56.96-1.96l1.39-.79v-1.89l-1.39-.79c-.7-.4-1.08-1.19-.96-1.96l.26-1.62-1.1-.1-1.6.38c-.8.18-1.63-.14-2.08-.81l-.93-1.4h-1.89zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-2 4c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"></path></g></svg>
            </div>
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
            avatar: 'https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg'
        },
        last_message: {
            id: 'm1',
            content: 'I am buying Coca-Cola to put the cocaine back in',
            message_type: 'text',
            sender_id: 'u1',
            created_at: new Date().toISOString(),
            is_read: false
        },
        unread_count: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '2',
        participant: {
            id: 'u2',
            name: 'Vue.js',
            username: 'vuejs',
            avatar: 'https://pbs.twimg.com/profile_images/1468993891584073729/a_op8KnL_400x400.jpg'
        },
        last_message: {
            id: 'm2',
            content: 'Have you tried Nuxt 4 yet?',
            message_type: 'text',
            sender_id: 'u2',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            is_read: true
        },
        unread_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
    }
])
</script>

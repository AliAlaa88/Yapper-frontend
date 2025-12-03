<template>
    <div class="flex w-full h-screen border-x border-primary">
        <div class="w-full md:w-[380px] lg:w-[400px] shrink-0 h-screen">
            <ChatList @select-conversation="handleSelectConversation" />
        </div>

        <!-- Chat Messages or Placeholder -->
        <div class="hidden md:flex flex-1 border-r border-primary w-full h-screen">
            <ChatMessages
                v-if="selectedConversation"
                class="w-full h-full"
                :conversation-id="selectedConversation.id"
                :participant="selectedConversation.participant"
            />
            <div v-else class="flex-1 flex items-center justify-center">
                <div class="text-center p-8 max-w-md">
                    <h2 class="text-3xl font-bold text-primary mb-2">Select a message</h2>
                    <p class="text-secondary mb-6">
                        Choose from your existing conversations, start a new one, or just keep
                        swimming.
                    </p>
                    <button
                        class="bg-accent text-primary font-bold rounded-full py-3 px-8 transition-colors"
                    >
                        New message
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile: Show ChatMessages when conversation is selected -->
        <div v-if="selectedConversation" class="md:hidden flex-1 w-full h-screen">
            <ChatMessages
                class="w-full h-full"
                :conversation-id="selectedConversation.id"
                :participant="selectedConversation.participant"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChatList } from '../components/ChatList'
import ChatMessages from '../components/ChatMessages/ChatMessages.vue'
import type { Conversation } from '../types'

const props = defineProps<{
    recipientId?: string
}>()

const selectedConversation = ref<Conversation | null>(null)

const handleSelectConversation = (conversation: Conversation) => {
    selectedConversation.value = conversation
}

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && selectedConversation.value) {
        selectedConversation.value = null
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscapeKey)
})
</script>

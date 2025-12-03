<template>
    <main class="flex flex-row">
        <Sidebar />
        <ChatView :chat-id="chatId" />
    </main>
</template>

<script setup lang="ts">
import ChatView from '~/modules/chat/views/ChatView.vue'
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'

const route = useRoute()
const chatId = route.params.chat_id as string

definePageMeta({
    middleware: ['auth'],
})
</script>

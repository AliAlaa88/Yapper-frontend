<template>
    <main class="flex flex-row">
        <Sidebar />
        <ChatView />
    </main>
</template>

<script setup lang="ts">
import ChatView from '~/modules/chat/views/ChatView.vue'
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'

definePageMeta({
    middleware: ['auth'],
})
</script>

<template>
    <main class="flex flex-row container mx-auto max-w-[1280px]">
        <aside class="hidden md:block min-w-[275px] shrink-0">
            <Sidebar />
        </aside>
        <div class="flex-1 w-full">
            <div class="md:hidden block">
                <MobileSidebar />
            </div>
            <ChatView />
        </div>
    </main>
</template>

<script setup lang="ts">
import ChatView from '~/modules/chat/views/ChatView.vue'
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'
import MobileSidebar from '~/modules/TimeLine/components/sidebar/MobileSidebar.vue'

definePageMeta({
    middleware: ['auth'],
})
</script>

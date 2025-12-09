<template>
    <main class="flex flex-row container mx-auto max-w-[1280px]">
        <aside
            class="hidden md:block shrink-0 transition-all duration-300 ease-in-out"
            :style="{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }"
        >
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
import { useSidebarState } from '~/modules/TimeLine/composables/useSidebarState'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()
const { sidebarWidth } = useSidebarState()

useSeo({
    title: t('seo.messages.title'),
    description: t('seo.messages.description'),
    keywords: t('seo.messages.keywords'),
})

definePageMeta({
    middleware: ['auth'],
})
</script>

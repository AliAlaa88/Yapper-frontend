<template>
    <main class="min-h-screen flex flex-row container mx-auto max-w-[1325px] bg-primary">
        <aside class="hidden md:block w-[275px] min-w-[270px] flex-shrink-0">
            <Sidebar />
        </aside>

        <div class="hidden md:block flex-1 w-[450px] max-w-[450px] border-l border-r border-primary">
            <SidebarCategories />
        </div>

        <aside class="flex-1 border-r border-primary">
            <div v-if="route.path === '/settings'">
                <SidebarCategories />
            </div>
            <NuxtPage v-else />
        </aside>

    </main>
</template>

<script setup lang="ts">
import SidebarCategories from '~/modules/settings/components/SidebarCategories.vue'
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'

import { useRouter, useRoute } from 'nuxt/app'
const router = useRouter()
const route = useRoute()

const width = ref(import.meta.client ? window.innerWidth : 1024)
const isDesktop = computed(() => width.value >= 768)

if (import.meta.client) {
    // track width changes
    window.addEventListener('resize', () => {
        width.value = window.innerWidth
    })
}

watchEffect(() => {
    if (isDesktop.value && route.path === '/settings/') {
        router.replace('/settings/account')
    }
})
</script>

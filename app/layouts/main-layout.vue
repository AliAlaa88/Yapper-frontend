<template>
    <main class="flex flex-row container mx-auto max-w-[1280px] relative">
        <!-- Left Sidebar -->
        <aside
            class="hidden md:block w-[275px] min-w-[275px] shrink-0 fixed top-0 h-screen z-5"
            :style="leftStyle"
        >
            <Sidebar />
        </aside>

        <!-- Main Content -->
        <div
            class="border-l border-r border-primary md:ml-[275px] lg:mr-[250px] xl:lg:mr-[300px] w-full md:max-w-[600px]"
        >
            <slot />
        </div>

        <!-- Right Sidebar -->
        <aside
            class="hidden lg:block min-w-0 w-[250px] xl:w-[300px] shrink-0 fixed top-0 h-screen z-5"
            :style="rightStyle"
        >
            <Banner />
        </aside>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'
import Banner from '~/modules/TimeLine/components/banner/Banner.vue'

const { width } = useWindowSize()

const leftStyle = computed(() => {
    const viewportWidth = width.value
    const containerWidth = Math.min(viewportWidth, 1280)
    const containerLeft = (viewportWidth - containerWidth) / 2

    return {
        left: `${containerLeft}px`,
    }
})

const rightStyle = computed(() => {
    const viewportWidth = width.value
    const containerWidth = Math.min(viewportWidth, 1280)
    const containerLeft = (viewportWidth - containerWidth) / 2

    // Right sidebar starts after: containerLeft + leftSidebar (275px) + content (600px)
    const rightSidebarLeft = containerLeft + 275 + 600

    return {
        left: `${rightSidebarLeft}px`,
    }
})
</script>

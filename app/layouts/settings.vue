<template>
    <main class="flex flex-row container mx-auto max-w-[1325px]">
        <aside class="hidden md:block w-[275px] min-w-[270px] flex-shrink-0">
            <Sidebar />
        </aside>

        <div class="flex-1 w-[450px] max-w-[450px] border-l border-r border-primary">
            <SidebarCategories />
        </div>

        <aside class="hidden xl:block border-r border-primary flex-1">
            <slot />
        </aside>

    </main>
</template>

<script setup lang="ts">
import SidebarCategories from '~/modules/settings/components/SidebarCategories.vue'
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'
</script>

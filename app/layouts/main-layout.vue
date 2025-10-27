<template>
    <main class="flex flex-row container mx-auto max-w-[1280px]">
        <aside class="hidden md:block w-[275px] min-w-[275px] flex-shrink-0">
            <Sidebar />
        </aside>

        <div class="flex-1 w-[600px] max-w-[600px] border-l border-r border-primary">
            <slot />
        </div>

        <aside class="hidden lg:block min-w-0 max-w-[250px] xl:max-w-[300px] flex-shrink-0">
            <Banner />
        </aside>
    </main>
</template>

<script setup lang="ts">
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'
import Banner from '~/modules/TimeLine/components/banner/Banner.vue'
</script>

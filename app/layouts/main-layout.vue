<template>
    <main class="flex flex-row container mx-auto gap-4">
        <Sidebar />
        <slot />
    </main>
</template>

<script setup lang="ts">
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'
</script>

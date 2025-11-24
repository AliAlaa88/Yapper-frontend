<template>
    <div class="flex flex-col items-center justify-center px-10 py-[60px] text-center">
        <div class="mb-4 text-5xl opacity-50">{{ icon }}</div>
        <h3 class="m-0 mb-2 text-2xl font-extrabold text-primary">{{ title }}</h3>
        <p class="m-0 max-w-[400px] text-[15px] leading-6 text-muted">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string
    title: string
    description: string
}>()
</script>

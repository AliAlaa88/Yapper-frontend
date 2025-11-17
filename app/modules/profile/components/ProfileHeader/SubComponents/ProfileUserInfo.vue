<template>
    <div class="mt-1 mb-3">
        <h1 class="text-xl font-bold text-primary leading-6 break-words">{{ displayName }}</h1>
        <p class="text-[15px] text-muted leading-5">@{{ username }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    displayName: string
    username: string
}>()
</script>

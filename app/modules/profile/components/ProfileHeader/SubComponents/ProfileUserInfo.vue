<template>
    <div class="mb-3">
        <div class="flex items-center gap-1">
            <h1 class="m-0 text-xl font-bold text-primary">{{ displayName }}</h1>
        </div>
        <p class="m-0 text-[15px] text-muted">@{{ username }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    displayName: string
    username: string
}>()
</script>

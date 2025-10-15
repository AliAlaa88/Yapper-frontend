<template>
    <div class="h-[200px] overflow-hidden">
        <img v-if="coverUrl" :src="coverUrl" alt="Cover" class="h-full w-full object-cover" />
        <div v-else class="h-full w-full bg-gradient-to-br from-[#1d9bf0] to-[#0c7abf]" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    coverUrl?: string
}>()
</script>

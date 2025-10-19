<template>
    <p v-if="createdAt" class="mt-3 text-[15px] leading-6 text-white">{{ createdAt }}</p>
</template>

<script setup lang="ts">
defineProps<{
    createdAt?: string
}>()
</script>

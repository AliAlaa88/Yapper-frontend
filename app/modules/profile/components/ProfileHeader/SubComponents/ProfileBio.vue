<template>
    <p v-if="bio" class="mt-3 text-[15px] leading-6 text-white">{{ bio }}</p>
</template>

<script setup lang="ts">
defineProps<{
    bio?: string
}>()
</script>

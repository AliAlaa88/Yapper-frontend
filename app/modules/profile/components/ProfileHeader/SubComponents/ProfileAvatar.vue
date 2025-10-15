<template>
    <div class="relative">
        <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="displayName"
            class="h-[140px] w-[140px] rounded-full border-4 border-black bg-black object-cover"
        />
        <div
            v-else
            class="flex h-[140px] w-[140px] items-center justify-center rounded-full border-4 border-black bg-gradient-to-br from-[#1d9bf0] to-[#0c7abf] text-5xl font-bold text-white"
        >
            {{ displayName.charAt(0).toUpperCase() }}
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    avatarUrl?: string
    displayName: string
}>()
</script>

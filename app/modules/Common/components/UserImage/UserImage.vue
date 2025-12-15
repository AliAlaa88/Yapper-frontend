<template>
    <img
        v-if="CheckImageUrl(imageUrl)"
        :src="imageUrl"
        :alt="name ?? ''"
        :class="compact ? `w-${size} h-${size}` : `w-${size} h-${size}`"
        class="object-cover rounded-full"
        :onerror="(event: any) => handleImageError(name ?? '', event)"
    >
    <img
        v-else
        :src="`https://ui-avatars.com/api/?name=${name}&background=random&size=${size}`"
        :alt="name ?? ''"
        :class="compact ? `w-${size} h-${size}` : `w-${size} h-${size}`"
        class="object-cover rounded-full"
    >
</template>

<script setup lang="ts">
import { handleImageError } from '~/utils/helpers'
const props = withDefaults(
    defineProps<{
        imageUrl?: string
        name?: string
        compact?: boolean
        size?: number
    }>(),
    {
        compact: true,
        size: 14,
    },
)

function CheckImageUrl(url?: string) {
    if (!url || url.length === 0) {
        return false
    }
    return true
}
</script>

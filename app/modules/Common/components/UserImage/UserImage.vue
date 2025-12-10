<template>
    <img
        v-if="CheckImageUrl(imageUrl)"
        :src="imageUrl"
        :alt="name ?? ''"
        :class="compact ? 'w-10 h-10' : 'w-16 h-16'"
        class="object-cover rounded-full"
        :onerror="(event: any) => handleImageError(name ?? '', event)"
    />
    <img
        v-else
        :src="`https://ui-avatars.com/api/?name=${name}`"
        :alt="name ?? ''"
        :class="compact ? 'w-10 h-10' : 'w-14 h-14'"
        class="object-cover rounded-full"
    />
</template>

<script setup lang="ts">
import { handleImageError } from '~/utils/helpers'
const props = defineProps<{
    imageUrl?: string
    name?: string
    compact?: boolean
}>()

function CheckImageUrl(url?: string) {
    if (!url || url.length === 0) {
        return false
    }
    return true
}
</script>

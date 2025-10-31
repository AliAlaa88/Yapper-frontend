<template>
    <div class="text-[var(--color-x-black)] text-[15px] leading-5">
        <!-- Tweet text -->
        <p class="mb-3 whitespace-pre-wrap break-words">{{ content.text }}</p>

        <!-- Images grid -->
        <div
            v-if="content.images && content.images.length > 0"
            class="mb-3 rounded-2xl overflow-hidden border border-[var(--color-x-border)]"
            :class="{
                'grid gap-0.5': content.images.length > 1,
                'grid-cols-2': content.images.length === 2 || content.images.length === 4,
                'grid-cols-1': content.images.length === 1 || content.images.length === 3,
            }"
        >
            <img
                v-for="(image, index) in content.images"
                :key="image"
                :id="`tweet-image-${index}`"
                :src="image"
                alt="Tweet image"
                class="w-full object-cover"
                :class="{
                    'aspect-video': content.images.length === 1,
                    'aspect-square': content.images.length > 1,
                }"
            />
        </div>

        <!-- Videos -->
        <!-- <div
            v-if="content.videos && content.videos.length > 0"
            class="mb-3 rounded-2xl overflow-hidden border border-[var(--color-x-border)]"
        >
            <video
                v-for="video in content.videos"
                :key="video"
                :src="video"
                controls
                class="w-full aspect-video"
            />
        </div> -->
    </div>
</template>

<script setup lang="ts">
import type { Content } from '~/modules/tweets/types'

const props = defineProps<{
    content: Content
}>()
</script>

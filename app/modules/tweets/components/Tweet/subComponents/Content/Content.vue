<template>
    <div class="text-primary text-sm leading-5">
        <!-- Tweet text -->
        <p class="mb-3 whitespace-pre-wrap wrap-break-word">{{ content.text }}</p>

        <!-- Media (Images and Videos) -->
         <div @click.stop>
        <TweetMedia
            v-if="(content.images && content.images.length > 0) || (content.videos && content.videos.length > 0)"
            :images="content.images"
            :videos="content.videos"
        />
         </div>
</div>
</template>

<script setup lang="ts">
import type { Content } from '~/modules/tweets/types'
import TweetMedia from '../TweetMedia/TweetMedia.vue'

const props = defineProps<{
    content: Content
}>()
</script>

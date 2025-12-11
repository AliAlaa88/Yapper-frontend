<template>
    <div class="text-primary text-sm leading-5">
        <!-- Tweet text (links parsed) -->
        <p class="mb-3 whitespace-pre-wrap wrap-break-word" v-html="parseLinks(content.text)"></p>

        <!-- Media (Images and Videos) -->
        <div @click.stop>
            <TweetMedia
                v-if="
                    (content.images && content.images.length > 0) ||
                    (content.videos && content.videos.length > 0)
                "
                :images="content.images"
                :videos="content.videos"
            />
        </div>

        <!-- Quoted Tweet -->
        <QuotedTweet
            v-if="content.parentTweet || content.quotedTweet"
            :tweet="content.parentTweet || content.quotedTweet"
        />
    </div>
</template>

<script setup lang="ts">
import type { Content } from '~/modules/tweets/types'
import TweetMedia from '../TweetMedia/TweetMedia.vue'
import QuotedTweet from '../QuotedTweet/QuotedTweet.vue'

const props = defineProps<{
    content: Content
}>()

function escapeHtml(str = ''): string {
    return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function parseLinks(text = ''): string {
    if (!text) return ''
    const urlRegex = /(https?:\/\/[^\s]+)/g
    // Replace URLs with safe anchor tags
    return escapeHtml(text).replaceAll(urlRegex, (url: string) => {
        const safeUrl = escapeHtml(url)
        return `<a href="${safeUrl}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`
    })
}
</script>

<template>
    <div ref="root" class="text-primary text-sm leading-5">
        <!-- Tweet text (links parsed) -->
        <p class="mb-3 whitespace-pre-wrap wrap-break-word" v-html="parseLinks(content.text)" />

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

import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
    content: Content
}>()

const root = ref<HTMLElement | null>(null)
const router = useRouter()

function escapeHtml(str = ''): string {
    return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function parseLinks(text = ''): string {
    if (!text) return ''
    const escaped = escapeHtml(text)

    const urlRegex = /(https?:\/\/[^\s]+)/g
    const withUrls = escaped.replace(urlRegex, (url: string) => {
        const safeUrl = escapeHtml(url)
        return `<a href="${safeUrl}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`
    })

    // Use Unicode property escape for letters which already includes Arabic.
    // Keep flags `g` and `u` (global + unicode). `s` isn't required here.
    const hashtagRegex = /#([\p{L}0-9_-]+)/gu
    const withHashtags = withUrls.replace(hashtagRegex, (_match: string, tag: string) => {
        const display = `#${escapeHtml(tag)}`
        const href = `/search?q=${encodeURIComponent('#' + tag)}`
        return `<a href="${href}" data-hashtag="${escapeHtml(tag)}" class="text-blue-500 underline">${display}</a>`
    })

    return withHashtags
}

function onRootClick(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return

    const anchor = target.closest('a[data-hashtag]') as HTMLElement | null
    if (!anchor) return

    const tag = anchor.getAttribute('data-hashtag')
    if (!tag) return

    e.preventDefault()
    e.stopPropagation()
    router.push({ path: '/search', query: { q: `#${tag}` } })
}

onMounted(() => {
    if (root.value) root.value.addEventListener('click', onRootClick)
})

onBeforeUnmount(() => {
    if (root.value) root.value.removeEventListener('click', onRootClick)
})
</script>

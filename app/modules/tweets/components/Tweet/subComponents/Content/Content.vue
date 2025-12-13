<template>
    <div ref="root" class="text-primary text-sm leading-5">
        <!-- Tweet text (links parsed) -->
        <p
            class="mb-3 whitespace-pre-wrap wrap-break-word"
            style="unicode-bidi: plaintext"
            v-html="parseLinks(content.text, false, false, content.mentions)"
        />

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
import { parseLinks } from '~/lib/utils'

const props = defineProps<{
    content: Content
}>()

const root = ref<HTMLElement | null>(null)
const router = useRouter()

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

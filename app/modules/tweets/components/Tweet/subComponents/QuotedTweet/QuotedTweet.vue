<template>
    <div
        class="mt-3 border border-primary rounded-2xl overflow-hidden hover:bg-hover transition-colors cursor-pointer"
        @click.stop="navigateToQuotedTweet"
    >
        <div class="p-3">
            <!-- User info row -->
            <div class="flex items-center gap-2 mb-2">
                <img
                    :src="userAvatar"
                    :alt="tweet.user.name"
                    class="w-5 h-5 rounded-full"
                    @error="(event) => handleImageError(tweet.user.name, event)"
                >
                <span class="font-semibold text-primary text-sm truncate">{{ tweet.user.name }}</span>
                <span class="text-secondary text-sm truncate">@{{ tweet.user.username }}</span>
                <span class="text-secondary text-sm">·</span>
                <span class="text-secondary text-sm">{{ formattedDate }}</span>
            </div>

            <!-- Content preview -->
            <p class="text-primary text-sm leading-5 line-clamp-3 whitespace-pre-wrap wrap-break-word">
                {{ tweet.content }}
            </p>

            <!-- Media preview (single thumbnail) -->
            <div v-if="hasMedia" class="mt-2">
                <div
                    v-if="tweet.images && tweet.images.length > 0"
                    class="rounded-xl overflow-hidden max-h-[200px]"
                >
                    <img
                        :src="tweet.images[0]"
                        alt="Quoted tweet media"
                        class="w-full h-full object-cover"
                    >
                </div>
                <div
                    v-else-if="tweet.videos && tweet.videos.length > 0"
                    class="rounded-xl overflow-hidden"
                >
                    <VideoPlayer
                        ref="videoPlayerRef"
                        :src="tweet.videos[0]"
                        :controls="true"
                        :playback-rates="[0.5, 0.75, 1, 1.25, 1.5, 2]"
                        :fluid="true"
                        class="video-js vjs-big-play-centered"
                        @click.stop
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Tweet } from '../../../../types/tweet'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { navigateTo } from '#app'
import { getTweetUrl } from '../../../../utils/navigation'
import { formatDate } from '../../../../utils/lib'
import { handleImageError } from '~/utils/helpers'
import { VideoPlayer } from '@videojs-player/vue'
import { useTweetTransitionStore } from '~/modules/tweets/stores/tweetTransition'

import 'video.js/dist/video-js.css'

const props = defineProps<{
    tweet: Tweet
}>()

const videoPlayerRef = ref<InstanceType<typeof VideoPlayer> | null>(null)

const userAvatar = computed(() =>
    props.tweet.user.avatar_url ?? `https://ui-avatars.com/api/?name=${props.tweet.user.name}`,
)

const hasMedia = computed(() =>
    (props.tweet.images && props.tweet.images.length > 0) ||
    (props.tweet.videos && props.tweet.videos.length > 0),
)

const formattedDate = computed(() => formatDate(props.tweet.created_at))
const tweetTransitionStore = useTweetTransitionStore()
const navigateToQuotedTweet = () => {
    const url = getTweetUrl(props.tweet)
    if (url !== '#') {
        tweetTransitionStore.setTransitionTweet(props.tweet)
        navigateTo(url)
    }
}

// Pause video when tab loses focus
const handleVisibilityChange = () => {
    if (document.hidden && videoPlayerRef.value) {
        const player = videoPlayerRef.value as any
        if (player.player && typeof player.player.pause === 'function') {
            player.player.pause()
        }
    }
}

onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

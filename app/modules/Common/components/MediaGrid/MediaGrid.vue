<template>
    <InfiniteList
        v-model:load-more-trigger="loadMoreTrigger"
        :items="items"
        :is-pending="isPending"
        :is-fetching="isFetching"
        :is-fetching-next-page="isFetchingNextPage"
        :error="error"
        :loading-text="$t('tweets.loading.tweets')"
        :error-text="$t('tweets.errors.loadFailed')"
        :retry-text="$t('tweets.errors.tryAgain')"
        :empty-title="$t('tweets.empty.noTweets')"
        :empty-description="$t('tweets.empty.noTweetsDescription')"
        items-container-class="grid grid-cols-3 gap-0.5 w-full"
        @retry="refetch"
    >
        <template #default="{ items: tweets }">
            <NuxtLink
                v-for="tweet in tweets"
                :key="tweet.tweet_id"
                :to="`/${tweet.user.username}/status/${tweet.tweet_id}`"
                class="aspect-square overflow-hidden relative"
            >
                <NuxtImg
                    v-if="tweet.images && tweet.images.length > 0"
                    :src="tweet.images[0]"
                    alt="Tweet Media"
                    class="h-full w-full object-cover"
                />
                <div
                    v-else-if="tweet.videos && tweet.videos.length > 0"
                    class="relative h-full w-full"
                >
                    <video
                        :src="tweet.videos[0]"
                        class="h-full w-full object-cover"
                        muted
                        @loadedmetadata="(e) => handleVideoMetadata(e, tweet.tweet_id)"
                    />
                    <div
                        v-if="videoDurations[tweet.tweet_id]"
                        class="absolute bottom-1 left-1 bg-black/75 px-1.5 py-0.5 rounded text-xs font-semibold"
                        style="color: white;"
                    >
                        {{ videoDurations[tweet.tweet_id] }}
                    </div>
                </div>
            </NuxtLink>
        </template>
    </InfiniteList>
</template>

<script setup lang="ts">
import { toRef, computed, ref } from 'vue'
import { useNuxtApp } from '#app'
import { useGenericInfiniteQuery } from '~/modules/Common/composables/useGenericInfiniteQuery'
import { InfiniteList } from '~/modules/Common/components/InfiniteList'
import type { Tweet, TweetsPage } from '~/modules/tweets/types/tweet'

const props = defineProps<{
    fetchingSource?: string | null
}>()

const fetchingSourceRef = toRef(props, 'fetchingSource')

// Store video durations by tweet_id
const videoDurations = ref<Record<string, string>>({})

// Format duration in seconds to MM:SS or HH:MM:SS
const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Handle video metadata load to extract duration
const handleVideoMetadata = (event: Event, tweetId: string) => {
    const video = event.target as HTMLVideoElement
    if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        videoDurations.value[tweetId] = formatDuration(video.duration)
    }
}

const { $listService } = useNuxtApp()

// Use the generic infinite query composable
const {
    items,
    isFetching,
    error,
    refetch,
    isFetchingNextPage,
    isPending,
    loadMoreTrigger,
} = useGenericInfiniteQuery<TweetsPage, Tweet>({
    queryKey: computed(() => ['tweets', fetchingSourceRef.value ?? '']),
    queryFn: ({ pageParam }) =>
        ($listService as any).fetchList(fetchingSourceRef.value ?? '', pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPageData: (page) => page.data,
})
</script>

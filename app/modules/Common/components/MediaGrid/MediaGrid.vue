<template>
    <div class="max-w-[600px] mx-auto bg-primary min-h-screen">
        <!-- Loading state -->
        <div v-if="isPending" class="p-6 text-center">
            <div class="inline-flex items-center space-x-2 text-secondary">
                <div
                    class="animate-spin rounded-full h-5 w-5 border-2 border-blue border-t-transparent"
                />
                <span class="text-sm font-medium text-primary">{{
                    $t('tweets.loading.tweets')
                }}</span>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="p-6 text-center">
            <div class="bg-primary rounded-xl p-4 border border-primary">
                <div class="text-red text-sm font-medium mb-3">
                    {{ $t('tweets.errors.loadFailed') }}
                </div>
                <button
                    id="tweets-list-retry-button"
                    class="inline-flex items-center px-4 py-2 bg-blue text-white text-sm font-bold rounded-full hover:bg-blue transition-colors duration-200"
                    @click="loadTweets"
                >
                    <RotateCw class="w-4 h-4 mr-2" />
                    {{ $t('tweets.errors.tryAgain') }}
                </button>
            </div>
        </div>

        <div v-else-if="!isPending" class="flex flex-col items-center">
            <div class="grid grid-cols-3 gap-0.5 w-full">
                <NuxtLink
                    v-for="tweet in tweets"
                    :key="tweet.tweet_id"
                    :to="`/${tweet.user.username}/status/${tweet.tweet_id}`"
                    class="aspect-square overflow-hidden"
                >
                    <NuxtImg
                        v-if="tweet.images && tweet.images.length > 0"
                        :src="tweet.images[0]"
                        alt="Tweet Media"
                        class="h-full w-full object-cover"
                    />
                </NuxtLink>
            </div>

            <div v-if="isFetchingNextPage" class="flex justify-center py-4 w-full">
                <div
                    class="animate-spin rounded-full h-5 w-5 border-2 border-blue border-t-transparent"
                />
            </div>

            <!-- Intersection observer target -->
            <div ref="loadMoreTrigger" class="h-1 w-full" />
        </div>

        <!-- Empty state -->
        <div v-if="!isFetching && tweets.length === 0" class="p-8 text-center">
            <div class="max-w-sm mx-auto">
                <div
                    class="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center"
                >
                    <Logo class="w-8 h-8 text-secondary" />
                </div>
                <h3 class="text-lg font-bold text-primary mb-2">
                    {{ $t('tweets.empty.noTweets') }}
                </h3>
                <p class="text-sm text-secondary leading-relaxed">
                    {{ $t('tweets.empty.noTweetsDescription') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Tweet from '~/modules/tweets/components/Tweet/Tweet.vue';
import type { Tweet as TweetType } from '~/modules/tweets/types/tweet'
import { useTweetsQuery } from '~/modules/tweets/queries/useTweetQueries'

const props = defineProps<{
    fetchingSource?: string | null
}>();

const fetchingSourceRef = toRef(props, 'fetchingSource')

// Use the query with the reactive fetchingSource (provide default empty string)
const {
    data,
    isFetching,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
} = useTweetsQuery(computed(() => fetchingSourceRef.value ?? ''))

const loadTweets = () => {
    refetch()
}

const loadMoreTrigger = ref<HTMLElement | null>(null)

watch(
    () => loadMoreTrigger.value,
    (el) => {
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
                    fetchNextPage()
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            },
        )

        observer.observe(el)

        onUnmounted(() => observer.disconnect())
    },
    { immediate: true },
)

const tweets = computed(() => {
    const pages = data.value?.pages
    if (!pages) return []

    return pages.flatMap((p) => p.data)
})
</script>

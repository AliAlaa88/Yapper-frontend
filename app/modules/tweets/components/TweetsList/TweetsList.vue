<template>
    <div class="max-w-[600px] mx-auto bg-primary min-h-screen">
        <!-- Loading state -->
        <div v-if="isPending" class="p-6 text-center">
            <div class="inline-flex items-center space-x-2 text-secondary">
                <LoadingSpinner size="md" color="blue" />
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

        <!-- Tweets list -->
        <div v-else-if="!isPending" class="divide-y divide-primary flex flex-col items-center">
            <div class="w-full">
                <Tweet v-for="tweet in tweets" :key="getTweetKey(tweet)" :tweet="tweet" :compact="props.compact" />
            </div>

            <div v-if="isFetchingNextPage" class="flex justify-center py-4 w-full">
                <LoadingSpinner size="md" color="blue" />
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
import { toRef, computed, ref, watch, onMounted, onUnmounted, provide } from 'vue'
import { useTweetsQuery } from '../../queries/useTweetQueries'
import Tweet from '../Tweet/Tweet.vue'
import { RotateCw } from 'lucide-vue-next'
import Logo from '~/modules/Common/components/Logo/Logo.vue'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import type { Tweet as TweetType } from '../../types/tweet.ts'

const activeMenuTweetId = ref<string | null>(null)
provide('activeMenuTweetId', activeMenuTweetId)

const handleClickOutside = (event: MouseEvent) => {
    if (activeMenuTweetId.value) {
        const target = event.target as HTMLElement
        const isMenuClick = target.closest('[data-menu-container]') || 
                           target.closest('[id^="tweet-menu-button-"]')
        if (!isMenuClick) {
            activeMenuTweetId.value = null
        }
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const props = defineProps<{
    fetchingSource?: string | null
    quotes?: boolean
    compact?: boolean
}>()

// Convert prop to ref for reactivity
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
// Function to retry loading tweets
const loadTweets = () => {
    refetch()
}

const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

watch(
    () => loadMoreTrigger.value,
    (el) => {
        // Clean up previous observer
        if (observer) {
            observer.disconnect()
            observer = null
        }

        if (!el) return

        observer = new IntersectionObserver(
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
    },
    { immediate: true },
)

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})

const tweets = computed(() => {
    const pages = data.value?.pages

    if (!pages) return []
    let newPages = pages.flatMap((p) => p.data.map((tweet) => ({ ...tweet })))
    if (props?.quotes) {
        newPages = newPages.map((tweet) => {
            const parentTweet = pages.find((p) => p.parent)?.parent
            return {
                ...tweet,
                parent_tweet: parentTweet || tweet.parent_tweet,
            }
        })
    }
    return newPages
})

const getTweetKey = (tweet: TweetType): string => {
    const user = tweet.user
    return `${tweet.tweet_id}-${user.username}-${user.name}-${user.avatar_url || ''}-${tweet.likes_count}-${tweet.is_liked}-${tweet.is_reposted}-${tweet.is_bookmarked}`
}

watch(tweets, (newTweets) => {}, { deep: true })
</script>

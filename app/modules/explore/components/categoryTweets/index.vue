<template>
    <div class="w-full">
        <!-- Header -->
        <div class="sticky top-0 z-10 bg-primary/80 backdrop-blur-md border-b border-primary">
            <div class="flex items-center gap-4 px-4 py-3">
                <button
                    id="btn-back-category-tweets"
                    class="p-2 -ml-2 rounded-full hover:bg-hover transition-colors cursor-pointer"
                    @click="router.back()"
                >
                    <ArrowLeft :size="20" class="text-primary" />
                </button>
                <div class="flex-1">
                    <h1 class="text-xl font-bold text-primary">
                        {{ categoryName || t('explore.category') }}
                    </h1>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div
            v-if="isLoading && currentPage === 1"
            class="flex justify-center py-8 min-h-[calc(100vh-60px)]"
        >
            <LoadingSpinner size="xl" />
        </div>

        <!-- Error state -->
        <div
            v-else-if="isError"
            class="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary gap-2"
        >
            <p class="text-muted">{{ t('explore.errorLoading') }}</p>
            <button
                id="btn-retry-category-tweets"
                @click="refetch"
                class="text-accent hover:underline cursor-pointer"
            >
                {{ t('explore.tryAgain') }}
            </button>
        </div>

        <!-- Empty state -->
        <div
            v-else-if="!tweets.length && !isLoading"
            class="flex items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary"
        >
            <p class="text-muted text-lg">{{ t('explore.noTweetsFound') }}</p>
        </div>

        <!-- Tweets list -->
        <div v-else class="w-full">
            <Tweet
                v-for="tweet in tweets"
                :key="tweet.tweet_id"
                :id="tweet.tweet_id"
                :tweet="tweet"
            />

            <!-- Loading more indicator -->
            <div v-if="isFetchingMore" class="flex justify-center py-4 border-t border-primary">
                <LoadingSpinner size="md" />
            </div>

            <!-- Intersection observer target for auto-load -->
            <div ref="loadMoreTrigger" class="h-1 w-full" />

            <!-- End of results message -->
            <div
                v-if="!hasMore && tweets.length > 0"
                class="border-t border-primary py-8 text-center"
            >
                <p class="text-muted text-sm">{{ t('explore.endOfResults') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGetExploreCategoriesQuery } from '../../queries/useGetExploreQuery'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import Tweet from '~/modules/tweets/components/Tweet/Tweet.vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const { t } = useI18n()

const props = defineProps<{
    categoryId: string
}>()

const emit = defineEmits<{
    categoryLoaded: [category: any]
}>()

// Pagination state
const currentPage = ref(1)
const limit = 20
const allTweets = ref<any[]>([])
const hasMore = ref(false)
const categoryInfo = ref<any>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const categoryName = computed(() => categoryInfo.value?.name || '')

// Query with proper reactive values
const categoryQuery = useGetExploreCategoriesQuery(
    computed(() => props.categoryId),
    currentPage,
    limit,
    true,
)

const isLoading = computed(() => categoryQuery.isLoading.value)
const isError = computed(() => categoryQuery.isError.value)
const isFetchingMore = computed(() => categoryQuery.isFetching.value && currentPage.value > 1)
const tweets = computed(() => allTweets.value)

// Watch for query data changes
watch(
    () => categoryQuery.data.value,
    (newData) => {
        if (newData?.data) {
            categoryInfo.value = newData.data.category

            // Emit category info to parent
            if (categoryInfo.value) {
                emit('categoryLoaded', categoryInfo.value)
            }

            if (currentPage.value === 1) {
                // First page - replace all tweets
                allTweets.value = newData.data.tweets || []
            } else {
                // Subsequent pages - append tweets
                const newTweets = newData.data.tweets || []
                allTweets.value = [...allTweets.value, ...newTweets]
            }

            // Update hasMore based on pagination info
            hasMore.value = newData.data.pagination?.hasMore || false
        }
    },
    { immediate: true },
)

// Refetch function
const refetch = () => {
    currentPage.value = 1
    allTweets.value = []
    categoryQuery.refetch()
}

// Reset when categoryId changes
watch(
    () => props.categoryId,
    () => {
        currentPage.value = 1
        allTweets.value = []
        hasMore.value = false
    },
)

// Intersection Observer for auto-pagination
let observer: IntersectionObserver | null = null

onMounted(() => {
    if (process.client && loadMoreTrigger.value) {
        observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry?.isIntersecting && hasMore.value && !isFetchingMore.value) {
                    currentPage.value++
                }
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.1,
            },
        )

        observer.observe(loadMoreTrigger.value)
    }
})

// Update observer when loadMoreTrigger changes
watch(
    () => loadMoreTrigger.value,
    (el) => {
        if (observer) {
            observer.disconnect()
        }

        if (el && process.client) {
            observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0]
                    if (entry?.isIntersecting && hasMore.value && !isFetchingMore.value) {
                        currentPage.value++
                    }
                },
                {
                    root: null,
                    rootMargin: '200px',
                    threshold: 0.1,
                },
            )

            observer.observe(el)
        }
    },
)

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})
</script>

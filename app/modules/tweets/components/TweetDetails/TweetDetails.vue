<template>
    <div class="bg-primary min-h-screen">
        <!-- Main Tweet -->
        <div v-if="tweetDetails && !isLoading && !error" class="p-4 border-b border-primary">
            <div class="flex items-start justify-between gap-2 mb-4">
                <div class="flex-1">
                    <Publisher
                        :publisher="mainTweetUser"
                        :created-at="tweetDetails.created_at"
                        :is-detail="true"
                    />
                </div>

                <!-- Actions Menu Button -->
                <div class="relative">
                    <button
                        id="tweet-detail-menu-button"
                        class="p-1.5 rounded-full hover:bg-hover transition-colors text-secondary hover:text-primary"
                        :aria-label="$t('tweets.moreActions')"
                        @click.stop="toggleActionsMenu"
                    >
                        <MoreHorizontal :size="16" />
                    </button>

                    <ProfileActionsMenu
                        :userid="tweetDetails.user.id"
                        :is-tweet="true"
                        @user-action="handleUserAction"
                    />
                </div>
            </div>

            <Content
                :content="mainTweetContent"
            />
            <div class="text-secondary text-sm mb-4 border-b border-primary pb-4">
                <time id="tweet-detail-timestamp" class="hover:underline cursor-pointer">
                    {{ formatDetailDate(tweetDetails.created_at, locale) }}
                </time>
            </div>
            <Stats
                :stats="mainTweetStats"
                @quote="handleQuote"
            />
        </div>

        <!-- Replies Section -->
        <div v-if="tweetDetails && !isLoading && !error">
            <!-- Post Reply Form -->
            <ReplyForm 
                :parent-tweet-id="tweetDetails.tweet_id"
                :replying-to-username="tweetDetails.user.username"
            />

            <!-- Loading Replies State -->
            <div v-if="isFetchingReplies" class="p-8 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"/>
                <p class="text-secondary">{{ $t('tweets.loading.replies') }}</p>
            </div>

            <!-- No Replies State -->
            <div v-else-if="replies.length === 0" class="text-center py-12 text-secondary">
                <MessageCircle class="w-16 h-16 text-light mx-auto mb-4" :stroke-width="1" />
                <p class="text-lg">{{ $t('tweets.empty.noReplies') }}</p>
                <p class="text-sm mt-1">{{ $t('tweets.empty.noRepliesDescription') }}</p>
            </div>

            <!-- Replies List -->
            <div v-else>
                <Reply
                    v-for="reply in replies"
                    :key="reply.tweet_id"
                    :reply="reply"
                />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"/>
            <p class="text-secondary">{{ $t('tweets.loading.tweetDetails') }}</p>
        </div>

        <!-- Tweet Not Found State (when data is null but no error) -->
        <div v-if="!isLoading && !error && !tweetDetails" class="p-8 text-center">
            <MessageCircle class="w-16 h-16 text-secondary mx-auto mb-4" :stroke-width="1" />
            <p class="text-primary text-lg font-semibold mb-2">{{ $t('tweets.errors.tweetNotFound') }}</p>
            <p class="text-secondary text-sm">{{ $t('tweets.errors.tweetNotFoundDescription') }}</p>
            <button
                class="mt-4 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors duration-200"
                @click="$router.back()"
            >
                {{ $t('tweets.errors.goBack') }}
            </button>
        </div>

        <!-- Error State -->
        <div v-if="error" class="p-8 text-center">
            <AlertTriangle class="w-16 h-16 text-red mx-auto mb-4" :stroke-width="1" />
            <p class="text-red text-lg">{{ error?.message || $t('tweets.errors.loadFailed') }}</p>
            <button
                id="tweet-detail-retry-button"
                class="mt-4 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors duration-200"
                @click="fetchTweetDetails()"
            >
                {{ $t('tweets.errors.tryAgain') }}
            </button>
        </div>

        <!-- Quote Modal -->
        <QuoteModal
            v-if="tweetDetails"
            :is-open="showQuoteModal"
            :quoted-tweet="tweetDetails"
            @close="showQuoteModal = false"
            @success="handleQuoteSuccess"
        />
    </div>
</template>

<script setup>
import { onUnmounted, watch, computed, ref, provide } from 'vue'
import Publisher from '../Tweet/subComponents/Publisher/Publisher.vue'
import Content from '../Tweet/subComponents/Content/Content.vue'
import Stats from '../Tweet/subComponents/Stats/Stats.vue'
import Reply from './Reply/Reply.vue'
import ReplyForm from './Reply/ReplyForm.vue'
import QuoteModal from '../QuoteModal/QuoteModal.vue'
import { useTweetDetails } from '../../composables/useTweetDetails'
import { formatDetailDate } from '../../utils/lib'
import { useRoute, useRouter } from '#app'
import { MessageCircle, AlertTriangle, MoreHorizontal } from 'lucide-vue-next'
import { useTweetTransitionStore } from '../../stores/tweetTransition'
import ProfileActionsMenu from '../../../profile/components/ProfileHeader/SubComponents/ProfileActionsMenu.vue'
import { useQueryClient } from '@tanstack/vue-query'

// Get tweet ID and username from route params
const route = useRoute()
const router = useRouter()
const tweetId = computed(() => route.params.tweetId)
const { locale } = useI18n()

const showActionsMenu = ref(false)
const showQuoteModal = ref(false)
provide('show-list', showActionsMenu)

const toggleActionsMenu = () => {
    showActionsMenu.value = !showActionsMenu.value
}

const handleQuote = () => {
    showQuoteModal.value = true
}

const handleQuoteSuccess = () => {
    // Quote posted successfully
}

const queryClient = useQueryClient()

const handleUserAction = (action) => {
    // When user is muted or blocked, navigate back
    if (action === 'mute' || action === 'block') {
        // Remove tweets from this user from all queries
        if (tweetDetails.value) {
            removeTweetsFromUser(tweetDetails.value.user.id)
        }
        // Navigate back to previous page
        router.back()
    }
}

const removeTweetsFromUser = (userId) => {
    // Update all tweet queries in the cache
    queryClient.setQueriesData(
        { queryKey: ['tweets'] },
        (oldData) => {
            if (!oldData) return oldData

            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    data: page.data.filter((tweet) => tweet.user.id !== userId),
                })),
            }
        },
    )
}

// Get the transition store
const tweetTransitionStore = useTweetTransitionStore()

// Use composable with the tweet ID from route and initial data from store
const { tweetDetails, isLoading, error, replies, isFetchingReplies, fetchTweetDetails } =
    useTweetDetails(tweetId.value, tweetTransitionStore.transitionTweet || undefined)

// Transform main tweet data
const mainTweetUser = computed(() => {
    if (!tweetDetails.value) return null
    return {
        ...tweetDetails.value.user,
        avatar:
            tweetDetails.value.user.avatar_url ||
            `https://ui-avatars.com/api/?name=${tweetDetails.value.user.name}`,
    }
})

const mainTweetContent = computed(() => {
    if (!tweetDetails.value) return null
    return {
        text: tweetDetails.value.content,
        images: tweetDetails.value.images || [],
        videos: tweetDetails.value.videos || [],
        parentTweet: tweetDetails.value.type === 'quote' ? tweetDetails.value.parent_tweet : undefined,
    }
})

const mainTweetStats = computed(() => {
    if (!tweetDetails.value) return null
    return {
        tweet_id: tweetDetails.value.tweet_id,
        likes: tweetDetails.value.likes_count,
        replies: tweetDetails.value.replies_count,
        retweets: tweetDetails.value.reposts_count,
        views: tweetDetails.value.views_count,
        is_liked: tweetDetails.value.is_liked,
        is_reposted: tweetDetails.value.is_reposted,
        is_bookmarked: tweetDetails.value.is_bookmarked,
        username: tweetDetails.value.user.username,
        user_id: tweetDetails.value.user.id,
    }
})

onUnmounted(() => {
    tweetTransitionStore.clearTransitionTweet()
})

watch(tweetId, (newTweetId) => {
    if (newTweetId) {
        fetchTweetDetails()
    }
})

watch(isLoading, (newIsLoading) => {
    if (!newIsLoading) {
        tweetTransitionStore.setTransitionTweet(tweetDetails.value)
    }
})
</script>

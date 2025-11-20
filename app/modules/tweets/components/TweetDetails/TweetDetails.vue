<template>
  <div class="bg-primary min-h-screen">
    <!-- Main Tweet -->
    <div v-if="tweetDetails && !isLoading && !error" class="p-4 border-b border-primary">
      <Publisher
        :publisher="mainTweetUser"
        :created-at="tweetDetails.created_at"
        :is-detail="true"
      />
      <Content
        :content="mainTweetContent"
      />
      <div class="text-secondary text-sm mb-4 border-b border-primary pb-4">
        <time id="tweet-detail-timestamp" class="hover:underline cursor-pointer">
          {{ formatDetailDate(tweetDetails.created_at) }}
        </time>
      </div>
      <Stats
        :stats="mainTweetStats"
      />
    </div>

    <!-- Replies Section -->
    <div v-if="tweetDetails && !isLoading && !error">
      <!-- No Replies State -->
      <div v-if="replies.length === 0" class="text-center py-12 text-secondary">
        <MessageCircle class="w-16 h-16 text-light mx-auto mb-4" :stroke-width="1" />
        <p class="text-lg">No replies yet</p>
        <p class="text-sm mt-1">Be the first to reply to this tweet!</p>
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
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
      <p class="text-secondary">Loading tweet details...</p>
    </div>

    <!-- Tweet Not Found State (when data is null but no error) -->
    <div v-if="!isLoading && !error && !tweetDetails" class="p-8 text-center">
      <MessageCircle class="w-16 h-16 text-secondary mx-auto mb-4" :stroke-width="1" />
      <p class="text-primary text-lg font-semibold mb-2">Tweet not found</p>
      <p class="text-secondary text-sm">This tweet may have been deleted or the link is incorrect.</p>
      <button
        @click="$router.back()"
        class="mt-4 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors duration-200"
      >
        Go Back
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-8 text-center">
      <AlertTriangle class="w-16 h-16 text-red mx-auto mb-4" :stroke-width="1" />
      <p class="text-red text-lg">{{ error?.message || 'Failed to load tweet' }}</p>
      <button
        id="tweet-detail-retry-button"
        @click="fetchTweetDetails()"
        class="mt-4 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, computed } from 'vue'
import Publisher from '../Tweet/subComponents/Publisher/Publisher.vue'
import Content from '../Tweet/subComponents/Content/Content.vue'
import Stats from '../Tweet/subComponents/Stats/Stats.vue'
import Reply from './Reply/Reply.vue'
import { useTweetDetails } from '../../composables/useTweetDetails'
import { formatDetailDate } from '../../utils/lib'
import { useRoute } from '#app'
import { MessageCircle, AlertTriangle } from 'lucide-vue-next'
import { useTweetTransitionStore } from '../../stores/tweetTransition'
import { useTweetDetailsQuery } from '../../queries/useTweetQueries'

// Get tweet ID and username from route params
const route = useRoute()
const username = computed(() => route.params.username)
const tweetId = computed(() => route.params.tweetId)

// Get the transition store
const tweetTransitionStore = useTweetTransitionStore()

// Use composable with the tweet ID from route and initial data from store
const {
  tweetDetails,
  isLoading,
  error,
  replies,
  fetchTweetDetails
} = useTweetDetails(tweetId.value, tweetTransitionStore.transitionTweet || undefined)

// Transform main tweet data
const mainTweetUser = computed(() => {
  if (!tweetDetails.value) return null
  //console.log(tweetDetails.value);
  return {
    ...tweetDetails.value.user,
    avatar: tweetDetails.value.user.avatar_url || `https://ui-avatars.com/api/?name=${tweetDetails.value.user.name}`
  }
})

const mainTweetContent = computed(() => {
  if (!tweetDetails.value) return null
  return {
    text: tweetDetails.value.content,
    images: tweetDetails.value.images || [],
    videos: tweetDetails.value.videos || []
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
    is_reposted: tweetDetails.value.is_reposted
  }
})

// Lifecycle hooks
// Query auto-fetches on mount when enabled
// With initialData, it shows immediately and refetches for replies
// Without initialData, it fetches normally

// Cleanup transition tweet when leaving the page
onUnmounted(() => {
  tweetTransitionStore.clearTransitionTweet()
})

// Watchers - watch for route changes
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

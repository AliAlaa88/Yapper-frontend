<template>
  <div class="bg-x-white">
    <!-- Main Tweet -->
    <div v-if="tweetDetails && !isLoading && !error" class="p-4 border-b border-x-border">
      <Publisher 
        :publisher="mainTweetUser"
        :created-at="tweetDetails.created_at"
        :is-detail="true"
      />
      <Content 
        :content="mainTweetContent"
      />
      <div class="text-x-gray-dark text-[15px] mb-4 border-b border-x-border pb-4">
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
      <div v-if="transformedReplies.length === 0" class="text-center py-12 text-x-gray-dark">
        <MessageCircle class="w-16 h-16 text-x-gray-light mx-auto mb-4" :stroke-width="1" />
        <p class="text-lg">No replies yet</p>
        <p class="text-sm mt-1">Be the first to reply to this tweet!</p>
      </div>
      
      <!-- Replies List -->
      <div v-else>
        <div 
          v-for="reply in transformedReplies" 
          :key="reply.id"
          :id="`tweet-reply-${reply.id}`"
          class="border-b border-x-border px-4 py-3 hover:bg-x-background transition-colors"
        >
          <div class="flex gap-3">
            <!-- Avatar column -->
            <div class="shrink-0">
              <img :id="`reply-avatar-${reply.id}`" :src="reply.user.avatar_url" :alt="reply.user.name" class="w-10 h-10 rounded-full" />
            </div>
            <!-- Content column -->
            <div class="flex-1 min-w-0">
              <Publisher 
                :publisher="reply.user"
                :created-at="reply.createdAt"
              />
              <Content 
                :content="reply.content"
              />
              <Stats 
                :stats="reply.stats"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue mx-auto mb-4"></div>
      <p class="text-x-gray-dark">Loading tweet details...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-8 text-center">
      <AlertTriangle class="w-16 h-16 text-red-300 mx-auto mb-4" :stroke-width="1" />
      <p class="text-red-500 text-lg">{{ error }}</p>
      <button 
        id="tweet-detail-retry-button"
        @click="fetchTweetDetails()" 
        class="mt-4 px-4 py-2 bg-x-blue text-white rounded-lg hover:bg-x-blue/90 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import Publisher from '../Tweet/subComponents/Publisher/Publisher.vue'
import Content from '../Tweet/subComponents/Content/Content.vue'
import Stats from '../Tweet/subComponents/Stats/Stats.vue'
import { useTweetDetails } from '../../composables/useTweetDetails'
import { formatDetailDate } from '../../utils/lib'
import { useRoute } from '#app'
import { MessageCircle, AlertTriangle } from 'lucide-vue-next'

// Get tweet ID and username from route params
const route = useRoute()
const username = computed(() => route.params.username)
const tweetId = computed(() => route.params.tweetId)

// Emits
const emit = defineEmits(['close'])

// Use composable with the tweet ID from route
const {
  tweetDetails,
  isLoading,
  error,
  replies,
  fetchTweetDetails,
  resetState
} = useTweetDetails(tweetId.value)

// Transform main tweet data
const mainTweetUser = computed(() => {
  if (!tweetDetails.value) return null
  // console.log(tweetDetails.value);
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
    is_liked: tweetDetails.value.is_liked
  }
})

// Transform replies data
const transformedReplies = computed(() => {
  if (!replies.value) return []
  return replies.value.map(reply => ({
    id: reply.tweet_id,
    user: {
      ...reply.user,
      avatar: reply.user.avatar_url
    },
    content: {
      text: reply.content,
      images: reply.imgs || [],
      videos: reply.videos || []
    },
    stats: {
      likes: reply.likes_count,
      replies: reply.replies_count,
      retweets: reply.reposts_count,
      views: reply.views_count,
      is_liked: reply.is_liked
    },
    createdAt: reply.created_at
  }))
})

// Lifecycle hooks
onMounted(() => {
  if (tweetId.value) {
    fetchTweetDetails()
  }
})

// Watchers - watch for route changes
watch(tweetId, (newTweetId) => {
  if (newTweetId) {
    resetState()
    fetchTweetDetails()
  }
})
</script>

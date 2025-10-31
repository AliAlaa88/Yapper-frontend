<template>
  <div class="bg-[var(--color-x-white)]">
    <!-- Main Tweet -->
    <div v-if="tweetDetails && !isLoading && !error" class="p-4 border-b border-[var(--color-x-border)]">
      <Publisher 
        :publisher="tweetDetails.tweet.user"
        :created-at="tweetDetails.tweet.createdAt"
        :is-detail="true"
      />
      <Content 
        :content="tweetDetails.tweet.content"
      />
      <div class="text-[var(--color-x-gray-dark)] text-[15px] mb-4 border-b border-[var(--color-x-border)] pb-4">
        <time class="hover:underline cursor-pointer">
          {{ formatDetailDate(tweetDetails.tweet.createdAt) }}
        </time>
      </div>
      <Stats 
        :stats="tweetDetails.tweet.stats"
      />
    </div>

    <!-- Replies Section -->
    <div v-if="tweetDetails && !isLoading && !error">
      <!-- No Replies State -->
      <div v-if="replies.length === 0" class="text-center py-12 text-[var(--color-x-gray-dark)]">
        <svg class="w-16 h-16 text-[var(--color-x-gray-light)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <p class="text-lg">No replies yet</p>
        <p class="text-sm mt-1">Be the first to reply to this tweet!</p>
      </div>
      
      <!-- Replies List -->
      <div v-else>
        <div 
          v-for="reply in replies" 
          :key="reply.id"
          class="border-b border-[var(--color-x-border)] px-4 py-3 hover:bg-[var(--color-x-background)] transition-colors"
        >
          <div class="flex gap-3">
            <!-- Avatar column -->
            <div class="flex-shrink-0">
              <img :src="reply.user.avatar" :alt="reply.user.name" class="w-10 h-10 rounded-full" />
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
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-x-blue)] mx-auto mb-4"></div>
      <p class="text-[var(--color-x-gray-dark)]">Loading tweet details...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-8 text-center">
      <svg class="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <p class="text-red-500 text-lg">{{ error }}</p>
      <button 
        @click="fetchTweetDetails()" 
        class="mt-4 px-4 py-2 bg-[var(--color-x-blue)] text-white rounded-lg hover:bg-[var(--color-x-blue)]/90 transition-colors duration-200"
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

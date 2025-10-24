<template>
    <div class="max-w-[600px] mx-auto border-x border-x bg-[var(--color-x-white)] min-h-screen">
        <!-- Header -->
        <div
            class="sticky top-0 z-10 bg-[var(--color-x-white)]/80 backdrop-blur-md border-b border-x px-4 py-3"
        >
            <h1 class="text-xl font-bold text-x-primary font-[var(--font-weight-bold)]">Home</h1>
        </div>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="p-6 text-center">
            <div class="inline-flex items-center space-x-2 text-x-secondary">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-[var(--color-x-blue)] border-t-transparent"></div>
                <span class="text-sm font-[var(--font-weight-medium)]">Loading tweets...</span>
            </div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="p-6 text-center">
            <div class="bg-[var(--color-x-background)] rounded-xl p-4 border border-x">
                <div class="text-[var(--color-x-red)] text-sm font-[var(--font-weight-medium)] mb-3">
                    {{ error }}
                </div>
                <button 
                    @click="loadTweets" 
                    class="inline-flex items-center px-4 py-2 bg-[var(--color-x-blue)] text-white text-sm font-[var(--font-weight-bold)] rounded-full hover:bg-[var(--color-x-blue-hover)] transition-colors duration-200"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try again
                </button>
            </div>
        </div>
        
        <!-- Tweets list -->
        <div v-else-if="tweets && tweets.length > 0" class="divide-y divide-[var(--color-x-border)]">
            <Tweet v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />
        </div>
        
        <!-- Empty state -->
        <div v-else class="p-8 text-center">
            <div class="max-w-sm mx-auto">
                <div class="w-16 h-16 mx-auto mb-4 bg-[var(--color-x-background)] rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-x-secondary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-[var(--font-weight-bold)] text-x-primary mb-2">No tweets yet</h3>
                <p class="text-sm text-x-secondary leading-relaxed">
                    When tweets are posted, they'll show up here. Check back later!
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Tweet as TweetType } from '~/modules/tweets/types'
import { useTweetsQuery } from '~/modules/tweets/queries/useTweetQueries'
import Tweet from '../Tweet/Tweet.vue'

const props = defineProps<{
    fetchingSource?: string | null
}>()

// Use the query instead of manual state management
const { data: tweets, isLoading, error, refetch } = useTweetsQuery()

// Function to retry loading tweets
const loadTweets = () => {
    refetch()
}
</script>

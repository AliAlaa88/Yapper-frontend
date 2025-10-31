<template>
    <div class="max-w-[600px] mx-auto border-x border-x bg-[var(--color-x-white)] min-h-screen">
        <!-- Header
        <div v-if="fetchingSource !== `user`"
            class="sticky top-0 z-10 bg-[var(--color-x-white)]/80 backdrop-blur-md border-b border-x px-4 py-3"
        >
            <h1 class="text-xl font-bold text-x-primary font-[var(--font-weight-bold)]">{{ title }}</h1>
        </div> -->
        
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
                    <RotateCw class="w-4 h-4 mr-2" />
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
                    <Twitter class="w-8 h-8 text-x-secondary" />
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
import { toRef } from 'vue'
import { useTweetsQuery } from '../../queries/useTweetQueries'
import Tweet from '../Tweet/Tweet.vue'
import { RotateCw, Twitter } from 'lucide-vue-next'

const props = defineProps<{
    fetchingSource?: string | null
}>()

// Convert prop to ref for reactivity
const fetchingSourceRef = toRef(props, 'fetchingSource')

// Use the query with the reactive fetchingSource (provide default empty string)
const { data: tweets, isLoading, error, refetch } = useTweetsQuery(computed(() => fetchingSourceRef.value ?? ''))

// Function to retry loading tweets
const loadTweets = () => {
    refetch()
}
</script>

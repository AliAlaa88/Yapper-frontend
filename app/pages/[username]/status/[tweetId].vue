<template>
    <div class="max-w-[600px] mx-auto border-x border-x bg-[var(--color-x-white)] min-h-screen">
        <!-- Header with back button -->
        <div class="sticky top-0 z-10 bg-[var(--color-x-white)]/80 backdrop-blur-md border-b border-x px-4 py-3">
            <div class="flex items-center gap-4">
                <button 
                    @click="$router.back()" 
                    class="p-2 rounded-full hover:bg-[var(--color-x-background)] transition-colors"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-x-primary font-[var(--font-weight-bold)]">Tweet</h1>
            </div>
        </div>

        <!-- Tweet Details Component -->
        <TweetDetails />
    </div>
</template>

<script setup lang="ts">
import TweetDetails from '~/modules/tweets/components/TweetDetails/TweetDetails.vue'

// Set page metadata
const route = useRoute()
const username = route.params.username as string
const tweetId = route.params.tweetId as string

// Set dynamic head for SEO
useHead({
    title: `Tweet by @${username}`,
    meta: [
        { name: 'description', content: `View tweet by @${username}` }
    ]
})
</script>
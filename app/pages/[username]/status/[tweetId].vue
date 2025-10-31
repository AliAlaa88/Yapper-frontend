<template>
    <div class="max-w-[600px] mx-auto border-x  bg-(--color-x-white) min-h-screen">
        <!-- Header with back button -->
        <div class="sticky top-0 z-10 bg-(--color-x-white)/80 backdrop-blur-md border-b border-x-dark px-4 py-3">
            <div class="flex items-center gap-4">
                <button 
                    @click="$router.back" 
                    class="p-2 rounded-full hover:bg-x-background transition-colors"
                >
                    <ArrowLeft :size="20" class="cursor-pointer text-x-text-dark"/>
                </button>
                <h1 class="text-xl text-x-text-dark font-bold">Post</h1>
            </div>
        </div>

        <!-- Tweet Details Component -->
        <TweetDetails />
    </div>
</template>

<script setup lang="ts">
import TweetDetails from '~/modules/tweets/components/TweetDetails/TweetDetails.vue'
import { ArrowLeft } from 'lucide-vue-next'

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
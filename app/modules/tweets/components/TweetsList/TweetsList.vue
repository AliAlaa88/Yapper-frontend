<template>
    <div class="max-w-[600px] mx-auto border-x border-[var(--color-x-border)]">
        <div
            class="sticky top-0 z-10 bg-[var(--color-x-white)]/80 backdrop-blur-md border-b border-[var(--color-x-border)] px-4 py-3"
        >
            <h1 class="text-xl font-bold text-[var(--color-x-black)]">Home</h1>
        </div>
        <Tweet v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />
    </div>
</template>

<script setup lang="ts">
import type { Tweet as TweetType } from '~/modules/tweets/types'
import { dummyTweets } from '~/modules/tweets/services/dummydata'
import Tweet from '../Tweet/Tweet.vue'

const props = defineProps<{
    fetchingSource?: string | null
}>()

const tweets = dummyTweets as TweetType[]
</script>

<template>
    <div class="min-h-screen bg-[var(--color-x-background)]">
        <div class="max-w-[600px] mx-auto border-x border-[var(--color-x-border)]">
            <!-- Header with back button -->
            <div
                class="sticky top-0 z-10 bg-[var(--color-x-white)]/80 backdrop-blur-md border-b border-[var(--color-x-border)] px-4 py-3"
            >
                <div class="flex items-center gap-4">
                    <button
                        @click="$router.back"
                        class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--color-x-gray-light)] transition-colors"
                    >
                        <ArrowLeft :size="20" class="cursor-pointer"/>
                    </button>
                    <h1 class="text-xl font-bold text-[var(--color-x-black)]">Tweet</h1>
                </div>
            </div>

            <!-- Tweet Details Content -->
            <div class="bg-[var(--color-x-white)]">
                <TweetDetails v-if="tweetId" :tweet-id="tweetId" @close="handleClose" />
            </div>
        </div>
    </div>
</template>

<script setup>
import TweetDetails from '~/modules/tweets/components/TweetDetails/TweetDetails.vue'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// Get tweet ID from route params
const tweetId = computed(() => route.params.id)

const handleClose = () => {
    router.back()
}

// Redirect to home if no tweet ID
if (!tweetId.value) {
    await navigateTo('/')
}
</script>

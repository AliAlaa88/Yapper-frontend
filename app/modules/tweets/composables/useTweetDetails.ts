import { ref, computed } from 'vue'
import { getTweetDetails } from '../services/dummydata'
import type { Tweet, TweetDetails } from '../types'

export function useTweetDetails() {
    const tweetDetails = ref<TweetDetails | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const replies = computed(() => {
        return tweetDetails.value?.replies || []
    })

    const fetchTweetDetails = async (tweetId: string) => {
        try {
            isLoading.value = true
            error.value = null

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 300))

            const details = getTweetDetails(tweetId)

            if (!details) {
                throw new Error('Tweet not found')
            }

            tweetDetails.value = details as TweetDetails
        } catch (err: any) {
            error.value = err.message || 'Failed to load tweet details'
            console.error('Error fetching tweet details:', err)
        } finally {
            isLoading.value = false
        }
    }

    const resetState = () => {
        tweetDetails.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        tweetDetails,
        isLoading,
        error,
        replies,
        fetchTweetDetails,
        resetState,
    }
}

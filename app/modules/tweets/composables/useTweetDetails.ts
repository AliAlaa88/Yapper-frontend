import { computed } from 'vue'
import { useTweetDetailsQuery } from '../queries/useTweetQueries'
import type { TweetDetails, Tweet } from '../types'

export function useTweetDetails(tweetId: string, initialTweet?: Tweet) {
    const { data: tweetDetailsData, isLoading, error, refetch } = useTweetDetailsQuery(tweetId, initialTweet)

    const replies = computed(() => {
        return tweetDetailsData.value?.replies || []
    })

    // The main tweet from the details response
    const tweetDetails = computed(() => {
        return tweetDetailsData.value?.tweet || null
    })

    return {
        tweetDetails,
        isLoading,
        error,
        replies,
        fetchTweetDetails: refetch    
    }
}

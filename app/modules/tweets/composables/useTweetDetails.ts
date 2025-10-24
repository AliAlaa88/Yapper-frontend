import { computed } from 'vue'
import { useTweetDetailsQuery } from '../queries/useTweetQueries'
import type { TweetDetails } from '../types'

export function useTweetDetails(tweetId: string) {
    const { data: tweetDetails, isLoading, error, refetch } = useTweetDetailsQuery(tweetId)

    const replies = computed(() => {
        return tweetDetails.value?.replies || []
    })

    const resetState = () => {
        // With queries, we don't need to manually reset state
        // The query will handle this automatically
    }

    return {
        tweetDetails,
        isLoading,
        error,
        replies,
        fetchTweetDetails: refetch,
        resetState,
    }
}

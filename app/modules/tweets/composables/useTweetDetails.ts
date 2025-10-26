import { computed } from 'vue'
import { useTweetDetailsQuery } from '../queries/useTweetQueries'
import type { TweetDetails } from '../types'

export function useTweetDetails(tweetId: string) {
    const { data: tweetDetails, isLoading, error, refetch } = useTweetDetailsQuery(tweetId)

    const replies = computed(() => {
        return tweetDetails.value?.replies || []
    })



    return {
        tweetDetails,
        isLoading,
        error,
        replies,
        fetchTweetDetails: refetch    
    }
}

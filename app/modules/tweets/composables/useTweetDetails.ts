import { computed, toRaw } from 'vue'
import { useTweetDetailsQuery } from '../queries/useTweetQueries'
import type { Tweet } from '../types'

export function useTweetDetails(tweetId: string, initialTweet?: Tweet) {
    const {
        data: tweetDetailsData,
        isLoading,
        error,
        isFetching,
        refetch,
    } = useTweetDetailsQuery(tweetId, initialTweet)

    const replies = computed(() => {
        const rawData = toRaw(tweetDetailsData.value)

        // The replies API returns an object with { data: [], count, next_cursor, has_more }
        // We need to extract the data array
        if (rawData?.replies && typeof rawData.replies === 'object' && 'data' in rawData.replies) {
            return rawData.replies.data || []
        }

        return []
    })

    // The main tweet from the details response
    const tweetDetails = computed(() => {
        return tweetDetailsData.value?.tweet || null
    })

    // Separate loading state for replies
    const isFetchingReplies = computed(() => {
        const repliesArray = replies.value
        return isFetching.value && (!Array.isArray(repliesArray) || repliesArray.length === 0)
    })

    const res = {
        tweetDetails,
        isLoading,
        error,
        replies,
        fetchTweetDetails: refetch,
        isFetchingReplies,
    }
    return res
}

import type { Tweet, TweetDetails,TweetsPage } from '../types'

export const tweetServiceReal = {
async fetchTweets(path: string, nextCursor: string): Promise<TweetsPage> {
    const { $axios } = useNuxtApp()

    const response = await $axios.get(
        `${path}` + (nextCursor ? `?cursor=${nextCursor}` : '')
    )

    const page = response.data.data

    return {
        data: page.tweets.filter((t: any) => t.tweet_id),
        nextCursor: page.next_cursor,
        hasMore: page.has_more,
    }
},

    async fetchTweetById(tweetId: string): Promise<Tweet | null> {
        throw new Error(`tweetServiceReal.fetchTweetById not implemented yet: ${tweetId}`)
    },

    async fetchTweetDetails(tweetId: string): Promise<TweetDetails | null> {
        const {$axios} = useNuxtApp()
        try {
            console.log('🌐 Service: Fetching tweet details from API:', `/tweets/${tweetId}`)
            const response = await $axios.get(`/tweets/${tweetId}`)
            console.log('📡 Service: Response status:', response.status)
            console.log('📦 Service: Response data:', response.data)
            
            // Handle 304 Not Modified - data should be in cache or response
            if (response.status === 304) {
                console.log('304 Not Modified for tweet:', tweetId)
                // For 304, the data should still be available
                return response.data?.data || null
            }
            
            // Normal 200 response
            if (response.data && response.data.data) {
                console.log('✅ Service: Returning data.data:', response.data.data)
                return response.data.data
            }
            
            console.warn('⚠️ Service: Tweet details response missing data:', response)
            return null
        } catch (error: any) {
            // Don't log 304 as error
            if (error.response?.status === 304) {
                console.log('304 Not Modified for tweet:', tweetId)
                return error.response.data?.data || null
            }
            console.error('💥 Service: Error fetching tweet details:', error.message, error.response?.status)
            return null
        }
    },

    async fetchUserTweets(userId: string): Promise<Tweet[]> {
        throw new Error(`tweetServiceReal.fetchUserTweets not implemented yet: ${userId}`)
    },

    async fetchUserById(userId: string) {
        throw new Error(`tweetServiceReal.fetchUserById not implemented yet: ${userId}`)
    },
    async likeTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.post(`/tweets/${tweetId}/like`)
    },
    async unlikeTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.delete(`/tweets/${tweetId}/like`)
    },
}
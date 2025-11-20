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

    async fetchTweetDetails(tweetId: string): Promise<Tweet | null> {
        const {$axios} = useNuxtApp()
        try {
            const response = await $axios.get(`/tweets/${tweetId}`)

            if (response.data && response.data.data) {
                return response.data.data
            }
            
            return null
        } catch (error: any) {
            return null
        }
    },
    async fetchtweetreplies(tweetId: string): Promise<Tweet[]> {
       const { $axios } = useNuxtApp()
         try {
              const response = await $axios.get(`/tweets/${tweetId}/replies`)
                if (response.data && response.data.data) {
                    return response.data.data
                }
                return []
         } catch (error: any) {
             return []
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
    async repostTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.post(`/tweets/${tweetId}/repost`)
    },
    async unrepostTweet(tweetId: string): Promise<void> {
        const { $axios } = useNuxtApp()
        await $axios.delete(`/tweets/${tweetId}/repost`)
    }
}
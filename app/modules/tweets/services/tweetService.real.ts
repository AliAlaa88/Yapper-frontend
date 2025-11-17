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
            const response = await $axios.get(`/tweets/${tweetId}`)
            // console.log("Fetched Tweet Details:", response.data.data);
            return response.data.data
        } catch (error) {
            console.error('Error fetching tweet details:', error)
            return null
        }
    },

    async fetchUserTweets(userId: string): Promise<Tweet[]> {
        throw new Error(`tweetServiceReal.fetchUserTweets not implemented yet: ${userId}`)
    },

    async fetchUserById(userId: string) {
        throw new Error(`tweetServiceReal.fetchUserById not implemented yet: ${userId}`)
    }
}
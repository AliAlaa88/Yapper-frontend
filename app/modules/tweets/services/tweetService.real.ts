import type { Tweet, TweetDetails } from '../types'


export const tweetServiceReal = {
    async fetchTweets(path : string): Promise<Tweet[]> {
        const {$axios} = useNuxtApp()
        const response = await $axios.get(`${path}`)
        // Assuming the API returns tweets in the correct format already
        const tweets: Tweet[] = response.data.data.data.filter((tweet: any) => tweet.tweet_id)
        // console.log("Fetched Tweets:", tweets);                                                                                                                                                                             
        return tweets;
    },

    async fetchTweetById(tweetId: string): Promise<Tweet | null> {
        throw new Error(`tweetServiceReal.fetchTweetById not implemented yet: ${tweetId}`)
    },

    async fetchTweetDetails(tweetId: string): Promise<TweetDetails | null> {
        const {$axios} = useNuxtApp()
        try {
            const response = await $axios.get(`/tweets/${tweetId}`)
            console.log("Fetched Tweet Details:", response.data.data);
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
import type { Tweet, TweetDetails } from '../types'

export const tweetServiceReal = {
    async fetchTweets(): Promise<Tweet[]> {
        throw new Error('tweetServiceReal.fetchTweets not implemented yet')
    },

    async fetchTweetById(tweetId: string): Promise<Tweet | null> {
        throw new Error(`tweetServiceReal.fetchTweetById not implemented yet: ${tweetId}`)
    },

    async fetchTweetDetails(tweetId: string): Promise<TweetDetails | null> {
        throw new Error(`tweetServiceReal.fetchTweetDetails not implemented yet: ${tweetId}`)
    },

    async fetchUserTweets(userId: string): Promise<Tweet[]> {
        throw new Error(`tweetServiceReal.fetchUserTweets not implemented yet: ${userId}`)
    },

    async fetchUserById(userId: string) {
        throw new Error(`tweetServiceReal.fetchUserById not implemented yet: ${userId}`)
    }
}
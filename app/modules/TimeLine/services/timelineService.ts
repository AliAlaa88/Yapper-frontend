import type { TweetBody } from '../types/tweetBody'
import { useNuxtApp } from 'nuxt/app'
const urls = {
    createTweet: '/tweets',
}

export const timelineService = {
    async createTweet(tweet: TweetBody): Promise<TweetBody> {
        const { $axios } = useNuxtApp()
        const response = await ($axios as any).post(urls.createTweet, tweet)
        return response.data
    },
    async createReply(tweet: TweetBody, parent_tweet_id: string): Promise<TweetBody> {
        const { $axios } = useNuxtApp()
        console.log('parent_tweet_id in service:', parent_tweet_id)
        const response = await ($axios as any).post(`tweets/${parent_tweet_id}/reply`, tweet)
        return response.data
    },
    async createQuote(tweet: TweetBody, parent_tweet_id: string): Promise<TweetBody> {
        const { $axios } = useNuxtApp()
        const response = await ($axios as any).post(`tweets/${parent_tweet_id}/quote`, tweet)
        return response.data
    },
}

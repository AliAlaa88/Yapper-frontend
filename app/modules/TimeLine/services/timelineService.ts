import { useNuxtApp } from 'nuxt/app'
const urls = {
    createTweet: '/tweets',
}
import type { TweetBody } from '../types/tweetBody'

export const timelineService = {
    async createTweet(tweet: TweetBody): Promise<TweetBody> {
        const { $axios } = useNuxtApp()
        const response = await ($axios as any).post(urls.createTweet, tweet)
        return response.data
    },
}

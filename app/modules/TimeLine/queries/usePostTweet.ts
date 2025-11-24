import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { TweetBody } from '../types/tweetBody'

export function usePostTweet() {
    const { $timelineService } = useNuxtApp()
    return useMutation({
        mutationFn: (tweet: TweetBody) => ($timelineService as any).createTweet(tweet),
        onSuccess: (data) => {
            console.log('post tweet data =======>', data)
        },
        onError: (error) => {
            console.log('post tweet error =======>', error)
        },
    })
}

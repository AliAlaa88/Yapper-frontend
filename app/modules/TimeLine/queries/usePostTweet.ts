import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { TweetBody } from '../types/tweetBody'
import type { TweetsPage } from '~/modules/tweets/types/tweet'
import { useUserStore } from '~/modules/auth/stores/userStore'

export function usePostTweet() {
    const { $timelineService, $queryClient } = useNuxtApp()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: (tweet: TweetBody) => {
            if (tweet.type === 'quote' && tweet.parent_tweet_id) {
                return ($timelineService as any).createQuote(tweet, tweet.parent_tweet_id) as Promise<any>
            }
            if (tweet.type === 'reply' && tweet.parent_tweet_id) {
                return ($timelineService as any).createReply(tweet, tweet.parent_tweet_id) as Promise<any>
            }
            return ($timelineService as any).createTweet(tweet) as Promise<any>
        },
        onSuccess: (data, variables) => {
            const tweet = {
                ...data.data,
                user: userStore.getUser(),
            }

            // If this is a reply, update the parent tweet's replies count
            if (variables.type === 'reply' && variables.parent_tweet_id) {
                $queryClient.invalidateQueries({
                    queryKey: ['tweetDetails', variables.parent_tweet_id],
                })
                return
            }

            // For quotes and regular tweets, update timeline caches
            $queryClient.setQueryData<{ pages: TweetsPage[]; pageParams: string[] }>(
                ['tweets', '/timeline/for-you'],
                (oldData) => {
                    if (!oldData) return oldData

                    const newPages = [...oldData.pages]
                    if (newPages[0]) {
                        newPages[0] = {
                            ...newPages[0],
                            data: [tweet, ...newPages[0].data],
                        }
                    }

                    return {
                        ...oldData,
                        pages: newPages,
                    }
                },
            )
            $queryClient.setQueryData<{ pages: TweetsPage[]; pageParams: string[] }>(
                ['tweets', '/timeline/following'],
                (oldData) => {
                    if (!oldData) return oldData
                    const newPages = [...oldData.pages]
                    if (newPages[0]) {
                        newPages[0] = {
                            ...newPages[0],
                            data: [tweet, ...newPages[0].data],
                        }
                    }

                    return {
                        ...oldData,
                        pages: newPages,
                    }
                },
            )
        },
        onError: (error) => {
            console.log('post tweet error =======>', error)
        },
    })
}

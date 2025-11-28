import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { TweetBody } from '../types/tweetBody'
import type { Tweet, TweetsPage } from '~/modules/tweets/types/tweet'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { cacheInvalidation } from '~/modules/Common/queries'

export function usePostTweet() {
    const { $timelineService } = useNuxtApp()
    const queryClient = useQueryClient()
    const router = useRouter()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: (tweet: TweetBody) =>
            ($timelineService as any).createTweet(tweet) as Promise<any>,
        onSuccess: (data) => {
            const tab = router.currentRoute.value.query.tab || 'foryou'

            const path = tab === 'foryou' ? '/timeline/for-you' : '/timeline/following'

            const tweet = {
                ...data.data,
                user: userStore.getUser(),
            }

            // update the infinite query cache optimistically
            queryClient.setQueryData<{ pages: TweetsPage[]; pageParams: string[] }>(
                ['tweets', path],
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
            cacheInvalidation.onCreatePostTweet(queryClient)
        },
        onError: (error) => {
            console.log('post tweet error =======>', error)
        },
    })
}

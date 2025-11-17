import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import { computed, unref, type MaybeRef } from 'vue'
import type { Tweet, TweetDetails } from '../types'
import type { TweetsPage } from '../types/tweet'

// Query for fetching tweets by path

export function useTweetsQuery(path: MaybeRef<string>) {
    const { $tweetService } = useNuxtApp()
    
    // Create reactive query key based on the path
    const queryKey = computed(() => ['tweets', unref(path)])
    
    // return useQuery<Tweet[]>({
    //     queryKey,
    //     queryFn: () => ($tweetService as any).fetchTweets(unref(path)),
    // })

    return useInfiniteQuery<TweetsPage>({
        queryKey,
        queryFn: ({ pageParam = '' }) => ($tweetService as any).fetchTweets(unref(path), pageParam) as Promise<TweetsPage>,
        getNextPageParam: (lastPage) => {
            // return nextCursor if present, otherwise undefined
            return lastPage?.nextCursor ?? undefined
        },
        initialPageParam: '',
    })
}

// Query for fetching tweet details (tweet + replies)
export function useTweetDetailsQuery(tweetId: string) {
    const { $tweetService } = useNuxtApp()
    return useQuery<TweetDetails | null>({
        queryKey: ['tweetDetails', tweetId],
        queryFn: () => ($tweetService as any).fetchTweetDetails(tweetId),
        enabled: !!tweetId,
    })
}

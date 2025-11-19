import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query'
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
export function useTweetDetailsQuery(tweetId: string, initialData?: Tweet) {
    const { $tweetService } = useNuxtApp()
    
    const queryResult = useQuery<TweetDetails | null>({
        queryKey: ['tweetDetails', tweetId],
        queryFn: async () => {
            try {
                const tweetDetails = await ($tweetService as any).fetchTweetDetails(tweetId)
                const tweetReplies = await ($tweetService as any).fetchtweetreplies(tweetId)
                
                // Combine tweet details and replies into a single object
                const result: TweetDetails | null = tweetDetails 
                    ? { tweet: tweetDetails, replies: tweetReplies || [] } 
                    : null
                
                
                // Return the fresh data if available
                if (result) return result
                
                // If no result but we have initialData, wrap it in TweetDetails structure
                if (initialData) {
                    return { tweet: initialData, replies: [] }
                }
                
                return null
            } catch (error: any) {
                console.error('💥 Error fetching tweet details:', error)
                
                // On error, fallback to initialData if available
                if (initialData) {
                    console.log('🔄 Using initialData as fallback due to error')
                    return { tweet: initialData, replies: [] }
                }
                
                // If no initialData, return null instead of throwing
                console.warn('⚠️ Returning null due to error (no initialData)')
                return null
            }
        },
        enabled: !!tweetId,
        // Use initialData to pre-populate cache if available
        initialData: initialData ? { tweet: initialData, replies: [] } : undefined,
        // Always consider initialData as stale so it refetches
        initialDataUpdatedAt: initialData ? 0 : undefined,
        // Retry once on failure
        retry: 1,
    })
    return queryResult
}




export function mutateTweetLikesQuery(tweetId: string ,isLike: boolean) {
    return useMutation({
        mutationKey: ['mutateTweetLikes', tweetId],
        mutationFn: (isLike: boolean) => {
            const { $tweetService } = useNuxtApp()
            return isLike
                ? ($tweetService as any).likeTweet(tweetId)
                : ($tweetService as any).unlikeTweet(tweetId)
        }
    })
}
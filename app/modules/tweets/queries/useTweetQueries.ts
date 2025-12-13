import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import { unref, type MaybeRef } from 'vue'
import type { Tweet, TweetDetails, User, TweetSummary } from '../types'
import type { TweetsPage } from '../types/tweet'
import { cacheInvalidation } from '~/modules/Common/queries/cacheInvalidation'
import { query } from 'happy-dom/lib/PropertySymbol.js'

// Query for fetching tweets by path

export function useTweetsQuery(path: MaybeRef<string>) {
    const { $tweetService } = useNuxtApp()

    // Create reactive query key based on the path
    const queryKey = computed(() => ['tweets', unref(path)])
    if(unref(path).toString().startsWith('/search')) {
        queryKey.value.splice(1, 0, '/search')
    }
    console.log('Using query key for tweets query:', queryKey.value)

    return useInfiniteQuery<TweetsPage>({
        queryKey,
        queryFn: ({ pageParam = '' }) =>
            ($tweetService as any).fetchTweets(unref(path), pageParam) as Promise<TweetsPage>,
        getNextPageParam: (lastPage) => {
            // return nextCursor if present, otherwise undefined
            return lastPage?.nextCursor ?? undefined
        },
        initialPageParam: '',
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
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
                console.error('Error fetching tweet details:', error)

                // On error, fallback to initialData if available
                if (initialData) {
                    console.log('Using initialData as fallback due to error')
                    return { tweet: initialData, replies: [] }
                }

                // If no initialData, return null instead of throwing
                console.warn('Returning null due to error (no initialData)')
                return null
            }
        },
        enabled: !!tweetId,
        // Use initialData for instant UI, but always refetch
        initialData: initialData ? { tweet: initialData, replies: [] } : undefined,
        initialDataUpdatedAt: 0, // Treat as immediately stale
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
        // Retry once on failure
        retry: 1,
    })
    return queryResult
}

export function useTweetSummaryQuery(tweetId: string, enabled: boolean = true) {
    const { $tweetService } = useNuxtApp()
    return useQuery<TweetSummary | null>({
        queryKey: ['tweetSummary', tweetId],
        queryFn: () => ($tweetService as any).fetchTweetSummary(tweetId),
        enabled,
        staleTime: 1000 * 60 * 30, // 30 minutes - summaries don't change often
        gcTime: 1000 * 60 * 60, // 1 hour
    })
}

export function mutateTweetLikesQuery(tweetId: string, isLike: boolean) {
    const { $queryClient } = useNuxtApp()
    return useMutation({
        mutationKey: ['mutateTweetLikes', tweetId],
        mutationFn: (isLike: boolean) => {
            const { $tweetService } = useNuxtApp()
            return isLike
                ? ($tweetService as any).likeTweet(tweetId)
                : ($tweetService as any).unlikeTweet(tweetId)
        },
        onSuccess: () => {
            console.log('Successfully mutated like status for tweet:', tweetId)
            cacheInvalidation.onTweetLikeChange($queryClient, tweetId)
        },
        onError: (error) => {
            console.error('Error mutating like status for tweet:', tweetId, error)
        },
    })
}

export function mutateTweetRepostsQuery(tweetId: string, isRetweet: boolean, path: string) {
    return useMutation({
        mutationKey: ['mutateTweetRetweets', tweetId],
        mutationFn: (isRetweet: boolean) => {
            const { $tweetService } = useNuxtApp()
            return isRetweet
                ? ($tweetService as any).repostTweet(tweetId)
                : ($tweetService as any).unrepostTweet(tweetId)
        },
        onSuccess: () => {
            const { $queryClient } = useNuxtApp()
            console.log('Successfully mutated repost status for tweet:', tweetId, path)
            cacheInvalidation.onTweetRepostChange($queryClient, tweetId, path)
        },
    })
}

export function mutateTweetBookmarkQuery(tweetId: string, isBookmarked: boolean) {
    return useMutation({
        mutationKey: ['mutateTweetBookmark', tweetId],
        mutationFn: (isBookmarked: boolean) => {
            const { $tweetService } = useNuxtApp()
            return isBookmarked
                ? ($tweetService as any).bookmarkTweet(tweetId)
                : ($tweetService as any).unbookmarkTweet(tweetId)
        },
        onSuccess: () => {
            const { $queryClient } = useNuxtApp()
            cacheInvalidation.onTweetBookmarkChange($queryClient, tweetId)
        },
    })
}

export function useDeleteTweetMutation(tweetId: string, parentTweetId?: string) {
    const { $queryClient } = useNuxtApp()

    return useMutation({
        mutationKey: ['deleteTweet', tweetId],
        mutationFn: () => {
            const { $tweetService } = useNuxtApp()
            return ($tweetService as any).deleteTweet(tweetId)
        },
        onSuccess: () => {
            // Remove tweet from all cached tweet queries
            $queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
                if (!oldData) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        data: page.data.filter((tweet: Tweet) => tweet.tweet_id !== tweetId),
                    })),
                }
            })
            // Invalidate tweet details cache
            $queryClient.invalidateQueries({ queryKey: ['tweetDetails', tweetId] })
            if (parentTweetId) {
                cacheInvalidation.onReplyDelete($queryClient, parentTweetId)
            }
        },
        onError: (error) => {
            console.error('Error deleting tweet:', tweetId, error)
        },
    })
}

export function useUpdateTweetMutation(tweetId: string) {
    const { $queryClient } = useNuxtApp()

    return useMutation({
        mutationKey: ['updateTweet', tweetId],
        mutationFn: (content: string) => {
            const { $tweetService } = useNuxtApp()
            return ($tweetService as any).updateTweet(tweetId, content)
        },
        onSuccess: (_data, content) => {
            // Update tweet content in all cached tweet queries
            console.log('Successfully updated tweet:', tweetId)
            $queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
                if (!oldData) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        data: page.data.map((tweet: Tweet) =>
                            tweet.tweet_id === tweetId ? { ...tweet, content } : tweet,
                        ),
                    })),
                }
            })
            // Also update tweet details cache if it exists
            $queryClient.setQueryData(['tweetDetails', tweetId], (oldData: TweetDetails | null) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    tweet: { ...oldData.tweet, content },
                }
            })
            cacheInvalidation.onTweetUpdate($queryClient, tweetId)
        },
        onError: (error) => {
            console.error('Error updating tweet:', tweetId, error)
        },
    })
}

// Query for fetching quotes for a tweet
export function useTweetQuotesQuery(tweetId: MaybeRef<string>) {
    const { $tweetService } = useNuxtApp()

    return useQuery<Tweet[]>({
        queryKey: ['tweetQuotes', unref(tweetId)],
        queryFn: () => ($tweetService as any).fetchtweetquotes(unref(tweetId)) as Promise<Tweet[]>,
        enabled: () => !!unref(tweetId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    })
}

// Query for fetching reposts for a tweet
export function useTweetRepostsQuery(tweetId: MaybeRef<string>) {
    const { $tweetService } = useNuxtApp()

    return useQuery<User[]>({
        queryKey: ['tweetReposts', unref(tweetId)],
        queryFn: () => ($tweetService as any).fetchTweetReposts(unref(tweetId)) as Promise<User[]>,
        enabled: () => !!unref(tweetId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    })
}

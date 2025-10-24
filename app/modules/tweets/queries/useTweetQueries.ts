import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import type { Tweet, TweetDetails } from '../types'

// Query for fetching all tweets
export function useTweetsQuery() {
    const { $tweetService } = useNuxtApp()
    return useQuery<Tweet[]>({
        queryKey: ['tweets'],
        queryFn: () => ($tweetService as any).fetchTweets(),
    })
}

// Query for fetching a single tweet by ID
export function useTweetQuery(tweetId: string) {
    const { $tweetService } = useNuxtApp()
    return useQuery<Tweet | null>({
        queryKey: ['tweet', tweetId],
        queryFn: () => ($tweetService as any).fetchTweetById(tweetId),
        enabled: !!tweetId,
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

// Query for fetching tweets by user
export function useUserTweetsQuery(userId: string) {
    const { $tweetService } = useNuxtApp()
    return useQuery<Tweet[]>({
        queryKey: ['userTweets', userId],
        queryFn: () => ($tweetService as any).fetchUserTweets(userId),
        enabled: !!userId,
    })
}

// Query for fetching user by ID
export function useUserQuery(userId: string) {
    const { $tweetService } = useNuxtApp()
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => ($tweetService as any).fetchUserById(userId),
        enabled: !!userId,
    })
}
import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp, useRoute } from '#app'
import { computed, unref, type Ref, type MaybeRef } from 'vue'
import type { Tweet, TweetDetails } from '../types'

// Query for fetching all tweets (now accepts a reactive fetchingSource)
export function useTweetsQuery(fetchingSource?: MaybeRef<string | null | undefined>) {
    const { $tweetService } = useNuxtApp()
    const route = useRoute()
    
    // Create reactive query key based on the source
    const queryKey = computed(() => {
        const source = unref(fetchingSource)
       const username = route.params.username as string
        
        // Include username in the key when fetching user tweets
        if (source === 'user' && username) {
            return ['tweets', source, username]
        }
        return source ? ['tweets', source] : ['tweets', 'all']
    })
    
    // Create query function that switches based on source
    const queryFn = () => {
        const source = unref(fetchingSource)
        const service = $tweetService as any
        
        switch (source) {
            case 'home':
                return service.fetchTweets()
            case 'user':
                // Get the username from the route params if available
                const username = route.params.username as string
                return service.fetchUserTweets ? service.fetchUserTweets(username) : service.fetchTweets()
            case 'likes':
                return service.fetchLikedTweets ? service.fetchLikedTweets() : service.fetchTweets()
            case 'media':
                return service.fetchMediaTweets ? service.fetchMediaTweets() : service.fetchTweets()
            case 'replies':
                return service.fetchReplies ? service.fetchReplies() : service.fetchTweets()
            default:
                return service.fetchTweets()
        }
    }
    
    return useQuery<Tweet[]>({
        queryKey,
        queryFn,
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
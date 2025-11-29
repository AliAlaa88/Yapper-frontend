import type { QueryClient } from '@tanstack/vue-query'
import { queryKeys } from './queryKeys'
import { query } from 'happy-dom/lib/PropertySymbol.js'

export const cacheInvalidation = {
    // ==================== Tweet Mutations ====================
    /**
     * Call after creating a new tweet
     */

    /**
     * Call after deleting a tweet
     */
    onTweetDelete: (queryClient: QueryClient, tweetId: string) => {
        queryClient.removeQueries({ queryKey: queryKeys.tweets.details(tweetId) })
    },

    /**
     * Call after liking/unliking a tweet
     */
    onTweetLikeChange: (queryClient: QueryClient, tweetId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        //  TODO: add the cache invalidation for profile tabs (likes tab)
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list('/users/me/liked-posts') })
        console.log('Invalidated like cache for tweet:', tweetId)   
    },

    /**
     * Call after reposting/unreposting a tweet
     */
    onTweetRepostChange: (queryClient: QueryClient, tweetId: string,path:string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        //  TODO: add the cache invalidation for profile tabs (posts tab)
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list(path) })
        console.log('Invalidated repost cache for tweet:', tweetId ,path)
    },

    /**
     * Call after bookmarking/unbookmarking a tweet
     */
    onTweetBookmarkChange: (queryClient: QueryClient, tweetId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
    },

    // ==================== Profile Mutations ====================

    /**
     * Call after updating user profile (bio, display name, etc.)
     */
    onProfileUpdate: (queryClient: QueryClient, username: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(username) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    /**
     * Call after updating username
     */
    onUsernameChange: (queryClient: QueryClient, oldUsername: string) => {
        queryClient.removeQueries({ queryKey: queryKeys.users.profile(oldUsername) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    /**
     * Call after updating avatar
     */
    onAvatarChange: (queryClient: QueryClient, username: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(username) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    /**
     * Call after updating cover photo
     */
    onCoverPhotoChange: (queryClient: QueryClient, username: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(username) })
    },

    // ==================== User Action Mutations ====================

    /**
     * Call after following/unfollowing a user
     */
    onFollowChange: (
        queryClient: QueryClient,
        targetUserId: string,
        targetUsername: string,
        currentUserId: string,
    ) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(targetUsername) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.followers(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.following(currentUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
    },

    /**
     * Call after blocking/unblocking a user
     */
    onBlockChange: (queryClient: QueryClient, targetUserId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.settings.blockedUsers() })
        // queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    /**
     * Call after muting/unmuting a user
     */
    onMuteChange: (queryClient: QueryClient, targetUserId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.settings.mutedUsers() })
        // queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    /**
     * Call after removing a follower
     */
    onRemoveFollower: (queryClient: QueryClient, currentUserId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.followers(currentUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
    },

    // ==================== Auth Mutations ====================

    /**
     * Call after logout to clear all cached data
     */
    onLogout: (queryClient: QueryClient) => {
        queryClient.clear()
    },

    /**
     * Call after login to refetch user data
     */
    onLogin: (queryClient: QueryClient) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() })
    },
}

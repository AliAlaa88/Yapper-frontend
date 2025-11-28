import type { QueryClient } from '@tanstack/vue-query'
import { queryKeys } from './queryKeys'

/**
 * Centralized cache invalidation utilities.
 * Use these functions in mutation onSuccess handlers to ensure proper cache invalidation.
 */
export const cacheInvalidation = {
    // ==================== Tweet Mutations ====================

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
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    /**
     * Call after reposting/unreposting a tweet
     */
    onTweetRepostChange: (queryClient: QueryClient, tweetId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
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
    },

    /**
     * Call after updating username
     */
    onUsernameChange: (queryClient: QueryClient, oldUsername: string) => {
        // Remove old username cache completely
        queryClient.removeQueries({ queryKey: queryKeys.users.profile(oldUsername) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        // Invalidate all tweets since they contain user info
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    /**
     * Call after updating avatar
     */
    onAvatarChange: (queryClient: QueryClient, username: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(username) })
        // Invalidate tweets since they display user avatars
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
    },

    /**
     * Call after muting/unmuting a user
     */
    onMuteChange: (queryClient: QueryClient, targetUserId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.settings.mutedUsers() })
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

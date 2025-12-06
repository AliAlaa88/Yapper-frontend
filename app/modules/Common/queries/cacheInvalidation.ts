import type { QueryClient, InfiniteData } from '@tanstack/vue-query'
import type { MutedAndBlockedListsApiResponse } from '~/modules/settings/types/settings'
import { queryKeys } from './queryKeys'

export const cacheInvalidation = {
    // ==================== Tweet Mutations ====================
    /**
     * Call after creating a new tweet
     */

    toggleBlockedInCache: (queryClient: QueryClient, userId: string, isBlocked: boolean) => {
        queryClient.setQueryData<InfiniteData<MutedAndBlockedListsApiResponse>>(
            queryKeys.settings.blockedUsers(),
            (oldData) => {
                if (!oldData) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        data: {
                            ...page.data,
                            data: page.data.data.map((user) =>
                                user.user_id === userId ? { ...user, is_blocked: isBlocked } : user,
                            ),
                        },
                    })),
                }
            },
        )
    },

    toggleMutedInCache: (queryClient: QueryClient, userId: string, isMuted: boolean) => {
        queryClient.setQueryData<InfiniteData<MutedAndBlockedListsApiResponse>>(
            queryKeys.settings.mutedUsers(),
            (oldData) => {
                if (!oldData) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        data: {
                            ...page.data,
                            data: page.data.data.map((user) =>
                                user.user_id === userId ? { ...user, is_muted: isMuted } : user,
                            ),
                        },
                    })),
                }
            },
        )
    },

    onTweetCreate: (queryClient: QueryClient, userId: string) => {
        console.log('Invalidating caches for new tweet by user:', userId)
        console.log('Invalidated caches for new tweet by user:', queryClient)
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list(`/users/${userId}/posts`) })
    },
    /**
     * Call after deleting a tweet
     */
    onTweetDelete: (queryClient: QueryClient, tweetId: string) => {
        queryClient.removeQueries({ queryKey: queryKeys.tweets.details(tweetId) })
    },
    onReplyCreate: (queryClient: QueryClient, parentTweetId: string, userId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(parentTweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list(`/users/${userId}/replies`) })
    },

    /**
     * Call after liking/unliking a tweet
     */
    onTweetLikeChange: (queryClient: QueryClient, tweetId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list('/users/me/liked-posts') })
        console.log('Invalidated like cache for tweet:', tweetId)
    },

    /**
     * Call after reposting/unreposting a tweet
     */
    onTweetRepostChange: (queryClient: QueryClient, tweetId: string, path: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list(path) })
        console.log('Invalidated repost cache for tweet:', tweetId, path)
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
        queryClient.invalidateQueries({ queryKey: queryKeys.settings.usernameRecommendation() })
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
        // queryClient.invalidateQueries({ queryKey: queryKeys.settings.blockedUsers() })
        // queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    /**
     * Call after muting/unmuting a user
     */
    onMuteChange: (queryClient: QueryClient, targetUserId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(targetUserId) })
        // queryClient.invalidateQueries({ queryKey: queryKeys.settings.mutedUsers() })
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

    // ==================== Chat/Conversation Mutations ====================

    /**
     * Call after creating a new conversation
     */
    onConversationCreate: (queryClient: QueryClient) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all })
    },
}

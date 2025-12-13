import type { QueryClient, InfiniteData } from '@tanstack/vue-query'
import type { MutedAndBlockedListsApiResponse } from '~/modules/settings/types/settings'
import { queryKeys } from './queryKeys'

export const cacheInvalidation = {
    // ==================== Tweet Mutations ====================
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

    onTweetDelete: (queryClient: QueryClient, tweetId: string) => {
        queryClient.removeQueries({ queryKey: queryKeys.tweets.details(tweetId) })
    },

    onReplyCreate: (queryClient: QueryClient, parentTweetId: string, userId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(parentTweetId) })
        queryClient.invalidateQueries({
            queryKey: queryKeys.tweets.list(`/users/${userId}/replies`),
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list('/timeline/following') })
    },
    onReplyDelete: (queryClient: QueryClient, parentTweetId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(parentTweetId) })
    },
    onTweetLikeChange: (queryClient: QueryClient, tweetId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list('/users/me/liked-posts') })
        console.log('Invalidated like cache for tweet:', tweetId)
    },

    onTweetRepostChange: (queryClient: QueryClient, tweetId: string, path: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list(path) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.list('/timeline/following') })
        console.log('Invalidated repost cache for tweet:', tweetId, path)
    },

    onTweetBookmarkChange: (queryClient: QueryClient, tweetId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.all })
    },

    onTweetUpdate: (queryClient: QueryClient, tweetId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.summary(tweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.details(tweetId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
    },

    // ==================== Profile Mutations ====================
    onProfileUpdate: (queryClient: QueryClient, username: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(username) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    onUsernameChange: (queryClient: QueryClient, oldUsername: string) => {
        queryClient.removeQueries({ queryKey: queryKeys.users.profile(oldUsername) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.settings.usernameRecommendation() })
    },

    onAvatarChange: (queryClient: QueryClient, username: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(username) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    onCoverPhotoChange: (queryClient: QueryClient, username: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(username) })
    },

    // ==================== User Action Mutations ====================
    onFollowChange: (
        queryClient: QueryClient,
        targetUserId: string,
        targetUsername: string,
        currentUserId: string,
        isFollowing: boolean, // true = just followed, false = just unfollowed
    ) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(targetUsername) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.followers(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.following(currentUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })

        // Optimistically update all tweet caches that contain this user
        // This ensures UserCard tooltips in timeline show updated follower counts immediately
        queryClient.setQueriesData({ queryKey: ['tweets'] }, (oldData: any) => {
            if (!oldData?.pages) return oldData

            const followerDelta = isFollowing ? 1 : -1

            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        data: page.data.map((tweet: any) => {
                            // Update user data in the tweet if it matches the target user
                            if (tweet.user?.id === targetUserId) {
                                return {
                                    ...tweet,
                                    user: {
                                        ...tweet.user,
                                        followers: Math.max(0, (tweet.user.followers || 0) + followerDelta),
                                    },
                                }
                            }
                            // Also update parent_tweet user if it exists (for replies/quotes)
                            if (tweet.parent_tweet?.user?.id === targetUserId) {
                                return {
                                    ...tweet,
                                    parent_tweet: {
                                        ...tweet.parent_tweet,
                                        user: {
                                            ...tweet.parent_tweet.user,
                                            followers: Math.max(0, (tweet.parent_tweet.user.followers || 0) + followerDelta),
                                        },
                                    },
                                }
                            }
                            return tweet
                        }),
                    }
                }),
            }
        })
    },

    onBlockChange: (queryClient: QueryClient, targetUserId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
        // queryClient.invalidateQueries({ queryKey: queryKeys.settings.blockedUsers() })
        // queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    onMuteChange: (queryClient: QueryClient, targetUserId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(targetUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
        // queryClient.invalidateQueries({ queryKey: queryKeys.settings.mutedUsers() })
        // queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all })
    },

    onRemoveFollower: (queryClient: QueryClient, currentUserId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.followers(currentUserId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
    },

    // ==================== Auth Mutations ====================
    onLogout: (queryClient: QueryClient) => {
        queryClient.clear()
    },

    onLogin: (queryClient: QueryClient) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() })
    },

    // ==================== Chat/Conversation Mutations ====================
    onConversationCreate: (queryClient: QueryClient) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all })
    },

    onFirstMessageSent: (queryClient: QueryClient) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all })
    },

    onRemoveNotification: (queryClient: QueryClient) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },

    onRemoveMention: (queryClient: QueryClient) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.mentions })
    },
}

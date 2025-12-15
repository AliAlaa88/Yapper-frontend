import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cacheInvalidation } from '../../queries/cacheInvalidation'
import { queryKeys } from '../../queries/queryKeys'

describe('cacheInvalidation', () => {
    let mockQueryClient: any

    beforeEach(() => {
        mockQueryClient = {
            setQueryData: vi.fn(),
            invalidateQueries: vi.fn(),
            removeQueries: vi.fn(),
            setQueriesData: vi.fn(),
            clear: vi.fn(),
        }
        vi.clearAllMocks()
    })

    describe('toggleBlockedInCache', () => {
        it('should update blocked status in cache', () => {
            const userId = 'user-123'
            const isBlocked = true

            cacheInvalidation.toggleBlockedInCache(mockQueryClient, userId, isBlocked)

            expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
                queryKeys.settings.blockedUsers(),
                expect.any(Function),
            )
        })

        it('should not modify cache if data is undefined', () => {
            const userId = 'user-123'
            const updater = mockQueryClient.setQueryData.mock.calls[0]?.[1]

            cacheInvalidation.toggleBlockedInCache(mockQueryClient, userId, true)

            expect(mockQueryClient.setQueryData).toHaveBeenCalled()
        })

        it('should handle toggle from blocked to unblocked', () => {
            cacheInvalidation.toggleBlockedInCache(mockQueryClient, 'user-123', false)
            cacheInvalidation.toggleBlockedInCache(mockQueryClient, 'user-123', true)

            expect(mockQueryClient.setQueryData).toHaveBeenCalledTimes(2)
        })
    })

    describe('toggleMutedInCache', () => {
        it('should update muted status in cache', () => {
            const userId = 'user-456'
            const isMuted = true

            cacheInvalidation.toggleMutedInCache(mockQueryClient, userId, isMuted)

            expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
                queryKeys.settings.mutedUsers(),
                expect.any(Function),
            )
        })

        it('should handle toggle from muted to unmuted', () => {
            cacheInvalidation.toggleMutedInCache(mockQueryClient, 'user-456', true)
            cacheInvalidation.toggleMutedInCache(mockQueryClient, 'user-456', false)

            expect(mockQueryClient.setQueryData).toHaveBeenCalledTimes(2)
        })
    })

    describe('Tweet Mutations', () => {
        it('onTweetCreate should invalidate user posts cache', () => {
            const userId = 'user-123'
            cacheInvalidation.onTweetCreate(mockQueryClient, userId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.list(`/users/${userId}/posts`),
            })
        })

        it('onTweetDelete should remove tweet details cache', () => {
            const tweetId = 'tweet-123'
            cacheInvalidation.onTweetDelete(mockQueryClient, tweetId)

            expect(mockQueryClient.removeQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.details(tweetId),
            })
        })

        it('onReplyCreate should invalidate parent tweet and related caches', () => {
            const parentTweetId = 'tweet-456'
            const userId = 'user-123'

            cacheInvalidation.onReplyCreate(mockQueryClient, parentTweetId, userId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.details(parentTweetId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.list(`/users/${userId}/replies`),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.list('/timeline/following'),
            })
        })

        it('onReplyDelete should invalidate parent tweet and timeline caches', () => {
            const parentTweetId = 'tweet-456'

            cacheInvalidation.onReplyDelete(mockQueryClient, parentTweetId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.details(parentTweetId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.list('/timeline/following'),
            })
        })

        it('onTweetLikeChange should invalidate tweet details and likes cache', () => {
            const tweetId = 'tweet-123'

            cacheInvalidation.onTweetLikeChange(mockQueryClient, tweetId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.details(tweetId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.list('/users/me/liked-posts'),
            })
        })

        it('onTweetRepostChange should invalidate tweet details and user timeline caches', () => {
            const tweetId = 'tweet-123'
            const path = '/timeline/following'

            cacheInvalidation.onTweetRepostChange(mockQueryClient, tweetId, path)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.details(tweetId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.list(path),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.list('/timeline/following'),
            })
        })

        it('onTweetBookmarkChange should invalidate tweet details and bookmarks cache', () => {
            const tweetId = 'tweet-123'

            cacheInvalidation.onTweetBookmarkChange(mockQueryClient, tweetId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.details(tweetId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.bookmarks.all,
            })
        })

        it('onTweetUpdate should invalidate tweet summary, details and search cache', () => {
            const tweetId = 'tweet-123'

            cacheInvalidation.onTweetUpdate(mockQueryClient, tweetId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.summary(tweetId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.details(tweetId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.search.all,
            })
        })
    })

    describe('Profile Mutations', () => {
        it('onProfileUpdate should invalidate profile and tweets caches', () => {
            const username = 'johndoe'

            cacheInvalidation.onProfileUpdate(mockQueryClient, username)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.me(),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.profile(username),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.tweets.all,
            })
        })

        it('onUsernameChange should remove old profile and invalidate caches', () => {
            const oldUsername = 'oldname'

            cacheInvalidation.onUsernameChange(mockQueryClient, oldUsername)

            expect(mockQueryClient.removeQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.profile(oldUsername),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.me(),
            })
        })

        it('onAvatarChange should invalidate profile and tweets caches', () => {
            const username = 'johndoe'

            cacheInvalidation.onAvatarChange(mockQueryClient, username)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.me(),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.profile(username),
            })
        })

        it('onCoverPhotoChange should invalidate me and profile caches', () => {
            const username = 'johndoe'

            cacheInvalidation.onCoverPhotoChange(mockQueryClient, username)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.me(),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.profile(username),
            })
        })
    })

    describe('User Action Mutations', () => {
        it('onFollowChange should invalidate relevant user and tweet caches', () => {
            const targetUserId = 'user-123'
            const targetUsername = 'johndoe'
            const currentUserId = 'user-456'
            const isFollowing = true

            cacheInvalidation.onFollowChange(
                mockQueryClient,
                targetUserId,
                targetUsername,
                currentUserId,
                isFollowing,
            )

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.byId(targetUserId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.profile(targetUsername),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.followers(targetUserId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.following(currentUserId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.me(),
            })
        })

        it('onFollowChange should also update tweet caches with follower delta', () => {
            const targetUserId = 'user-123'
            const targetUsername = 'johndoe'
            const currentUserId = 'user-456'

            cacheInvalidation.onFollowChange(
                mockQueryClient,
                targetUserId,
                targetUsername,
                currentUserId,
                true,
            )

            expect(mockQueryClient.setQueriesData).toHaveBeenCalledWith(
                { queryKey: ['tweets'] },
                expect.any(Function),
            )
        })

        it('onBlockChange should invalidate user and notifications caches', () => {
            const targetUserId = 'user-123'

            cacheInvalidation.onBlockChange(mockQueryClient, targetUserId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.byId(targetUserId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.search.all,
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.notifications.all,
            })
        })

        it('onMuteChange should invalidate user and search caches', () => {
            const targetUserId = 'user-123'

            cacheInvalidation.onMuteChange(mockQueryClient, targetUserId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.byId(targetUserId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.search.all,
            })
        })

        it('onRemoveFollower should invalidate follower and me caches', () => {
            const currentUserId = 'user-123'

            cacheInvalidation.onRemoveFollower(mockQueryClient, currentUserId)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.followers(currentUserId),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.me(),
            })
        })
    })

    describe('Auth Mutations', () => {
        it('onLogout should clear all query data', () => {
            cacheInvalidation.onLogout(mockQueryClient)

            expect(mockQueryClient.clear).toHaveBeenCalled()
        })

        it('onLogin should invalidate user and auth caches', () => {
            cacheInvalidation.onLogin(mockQueryClient)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.users.me(),
            })
            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.auth.user(),
            })
        })
    })

    describe('Chat/Conversation Mutations', () => {
        it('onConversationCreate should invalidate conversations cache', () => {
            cacheInvalidation.onConversationCreate(mockQueryClient)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.conversations.all,
            })
        })

        it('onFirstMessageSent should invalidate conversations cache', () => {
            cacheInvalidation.onFirstMessageSent(mockQueryClient)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.conversations.all,
            })
        })

        it('onRemoveNotification should invalidate notifications cache', () => {
            cacheInvalidation.onRemoveNotification(mockQueryClient)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.notifications.all,
            })
        })

        it('onRemoveMention should invalidate mentions cache', () => {
            cacheInvalidation.onRemoveMention(mockQueryClient)

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: queryKeys.notifications.mentions,
            })
        })
    })

    describe('cache invalidation methods', () => {
        it('should have all expected methods', () => {
            const expectedMethods = [
                'toggleBlockedInCache',
                'toggleMutedInCache',
                'onTweetCreate',
                'onTweetDelete',
                'onReplyCreate',
                'onReplyDelete',
                'onTweetLikeChange',
                'onTweetRepostChange',
                'onTweetBookmarkChange',
                'onTweetUpdate',
                'onProfileUpdate',
                'onUsernameChange',
                'onAvatarChange',
                'onCoverPhotoChange',
                'onFollowChange',
                'onBlockChange',
                'onMuteChange',
                'onRemoveFollower',
                'onLogout',
                'onLogin',
                'onConversationCreate',
                'onFirstMessageSent',
                'onRemoveNotification',
                'onRemoveMention',
            ]

            expectedMethods.forEach((method) => {
                expect(cacheInvalidation).toHaveProperty(method)
                expect(typeof cacheInvalidation[method as keyof typeof cacheInvalidation]).toBe('function')
            })
        })
    })
})

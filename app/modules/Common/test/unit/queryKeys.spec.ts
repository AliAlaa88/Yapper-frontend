import { describe, it, expect, beforeEach, vi } from 'vitest'
import { queryKeys } from '../../queries/queryKeys'

describe('queryKeys', () => {
    describe('tweets', () => {
        it('should have tweets.all key', () => {
            expect(queryKeys.tweets.all).toEqual(['tweets'])
        })

        it('should generate tweets.list key with path', () => {
            const key = queryKeys.tweets.list('/timeline')
            expect(key).toEqual(['tweets', '/timeline'])
        })

        it('should generate tweets.details key with tweetId', () => {
            const key = queryKeys.tweets.details('123')
            expect(key).toEqual(['tweetDetails', '123'])
        })

        it('should generate tweets.summary key with tweetId', () => {
            const key = queryKeys.tweets.summary('456')
            expect(key).toEqual(['tweetSummary', '456'])
        })

        it('should handle different paths in list keys', () => {
            const paths = ['/timeline/following', '/users/me/liked-posts', '/search']
            paths.forEach((path) => {
                const key = queryKeys.tweets.list(path)
                expect(key).toEqual(['tweets', path])
                expect(key[1]).toBe(path)
            })
        })
    })

    describe('users', () => {
        it('should have users.all key', () => {
            expect(queryKeys.users.all).toEqual(['user'])
        })

        it('should generate users.profile key with username', () => {
            const key = queryKeys.users.profile('johndoe')
            expect(key).toEqual(['user', 'johndoe'])
        })

        it('should generate users.byId key with userId', () => {
            const key = queryKeys.users.byId('user-123')
            expect(key).toEqual(['user', 'user-123'])
        })

        it('should generate users.me key', () => {
            const key = queryKeys.users.me()
            expect(key).toEqual(['me'])
        })

        it('should generate users.followers key', () => {
            const key = queryKeys.users.followers('user-123')
            expect(key).toEqual(['followers', 'user-123'])
        })

        it('should generate users.following key', () => {
            const key = queryKeys.users.following('user-456')
            expect(key).toEqual(['following', 'user-456'])
        })
    })

    describe('settings', () => {
        it('should generate settings.mutedUsers key', () => {
            const key = queryKeys.settings.mutedUsers()
            expect(key).toEqual(['muted-users'])
        })

        it('should generate settings.blockedUsers key', () => {
            const key = queryKeys.settings.blockedUsers()
            expect(key).toEqual(['blocked-users'])
        })

        it('should generate settings.usernameRecommendation key', () => {
            const key = queryKeys.settings.usernameRecommendation()
            expect(key).toEqual(['username-recommendation'])
        })
    })

    describe('auth', () => {
        it('should generate auth.user key', () => {
            const key = queryKeys.auth.user()
            expect(key).toEqual(['getUser'])
        })
    })

    describe('conversations', () => {
        it('should have conversations.all key', () => {
            expect(queryKeys.conversations.all).toEqual(['conversations'])
        })
    })

    describe('notifications', () => {
        it('should have notifications.all key', () => {
            expect(queryKeys.notifications.all).toEqual(['notifications'])
        })

        it('should have notifications.mentions key', () => {
            expect(queryKeys.notifications.mentions).toEqual(['mentions'])
        })
    })

    describe('search', () => {
        it('should have search.all key', () => {
            expect(queryKeys.search.all).toEqual(['tweets', '/search'])
        })
    })

    describe('bookmarks', () => {
        it('should have bookmarks.all key', () => {
            expect(queryKeys.bookmarks.all).toEqual(['tweets', 'tweets/bookmarks'])
        })
    })

    describe('query key consistency', () => {
        it('should have proper key structure for nested queries', () => {
            expect(Array.isArray(queryKeys.tweets.all)).toBe(true)
            expect(Array.isArray(queryKeys.users.all)).toBe(true)
            expect(Array.isArray(queryKeys.conversations.all)).toBe(true)
        })

        it('should have proper key structure for functions', () => {
            const tweetKey = queryKeys.tweets.details('123')
            const userKey = queryKeys.users.profile('user')
            expect(Array.isArray(tweetKey)).toBe(true)
            expect(Array.isArray(userKey)).toBe(true)
            expect(tweetKey.length).toBe(2)
            expect(userKey.length).toBe(2)
        })

        it('should not have duplicate top-level keys', () => {
            const topKeys = Object.keys(queryKeys)
            const uniqueKeys = new Set(topKeys)
            expect(topKeys.length).toBe(uniqueKeys.size)
        })
    })

    describe('key isolation', () => {
        it('tweets and search keys should be distinct', () => {
            expect(queryKeys.tweets.all).not.toEqual(queryKeys.search.all)
        })

        it('different user keys should be distinct', () => {
            const profile1 = queryKeys.users.profile('user1')
            const profile2 = queryKeys.users.profile('user2')
            expect(profile1).not.toEqual(profile2)
        })

        it('different tweet detail keys should be distinct', () => {
            const tweet1 = queryKeys.tweets.details('123')
            const tweet2 = queryKeys.tweets.details('456')
            expect(tweet1).not.toEqual(tweet2)
        })
    })
})

import { describe, it, expect } from 'vitest'
import { getProfileUrl, getTweetUrl, getTweetUrlFromParts } from '../../utils/navigation'
import type { User, Tweet } from '../../types'

describe('navigation utilities', () => {
  describe('getProfileUrl', () => {
    it('returns custom link when user has a link property', () => {
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        username: 'johndoe',
        avatar: '/avatar.jpg',
        link: '/custom/profile/link',
      }

      expect(getProfileUrl(user)).toBe('/custom/profile/link')
    })

    it('returns profile URL with username when link is not provided', () => {
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        username: 'johndoe',
        avatar: '/avatar.jpg',
      }

      expect(getProfileUrl(user)).toBe('/profile/johndoe')
    })

    it('returns # as fallback when user has no link and no username', () => {
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        username: '',
        avatar: '/avatar.jpg',
      }

      expect(getProfileUrl(user)).toBe('#')
    })

    it('returns /profile/johndoe when link is empty string', () => {
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        username: 'johndoe',
        avatar: '/avatar.jpg',
        link: '',
      }

      expect(getProfileUrl(user)).toBe('/profile/johndoe')
    })

    it('prioritizes custom link over username', () => {
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        username: 'johndoe',
        avatar: '/avatar.jpg',
        link: '/external/profile',
      }

      expect(getProfileUrl(user)).toBe('/external/profile')
    })
  })

  describe('getTweetUrl', () => {
    it('returns tweet URL with username and tweet ID', () => {
      const tweet: Tweet = {
        id: 'tweet123',
        content: { text: 'Hello world', images: [], videos: [] },
        user: {
          id: 'user1',
          name: 'John Doe',
          username: 'johndoe',
          avatar: '/avatar.jpg',
        },
        stats: { likes: 0, replies: 0, retweets: 0 },
        type: 'tweet',
        createdAt: '2025-10-17T12:00:00.000Z',
      }

      expect(getTweetUrl(tweet)).toBe('/johndoe/status/tweet123')
    })

    it('returns # when tweet has no username', () => {
      const tweet: Tweet = {
        id: 'tweet123',
        content: { text: 'Hello world', images: [], videos: [] },
        user: {
          id: 'user1',
          name: 'John Doe',
          username: '',
          avatar: '/avatar.jpg',
        },
        stats: { likes: 0, replies: 0, retweets: 0 },
        type: 'tweet',
        createdAt: '2025-10-17T12:00:00.000Z',
      }

      expect(getTweetUrl(tweet)).toBe('#')
    })

    it('returns # when tweet has no ID', () => {
      const tweet: Tweet = {
        id: '',
        content: { text: 'Hello world', images: [], videos: [] },
        user: {
          id: 'user1',
          name: 'John Doe',
          username: 'johndoe',
          avatar: '/avatar.jpg',
        },
        stats: { likes: 0, replies: 0, retweets: 0 },
        type: 'tweet',
        createdAt: '2025-10-17T12:00:00.000Z',
      }

      expect(getTweetUrl(tweet)).toBe('#')
    })

    it('returns # when both username and ID are missing', () => {
      const tweet: Tweet = {
        id: '',
        content: { text: 'Hello world', images: [], videos: [] },
        user: {
          id: 'user1',
          name: 'John Doe',
          username: '',
          avatar: '/avatar.jpg',
        },
        stats: { likes: 0, replies: 0, retweets: 0 },
        type: 'tweet',
        createdAt: '2025-10-17T12:00:00.000Z',
      }

      expect(getTweetUrl(tweet)).toBe('#')
    })

    it('works with reply type tweets', () => {
      const tweet: Tweet = {
        id: 'reply123',
        content: { text: 'Reply message', images: [], videos: [] },
        user: {
          id: 'user2',
          name: 'Jane Smith',
          username: 'janesmith',
          avatar: '/avatar2.jpg',
        },
        stats: { likes: 5, replies: 0, retweets: 0 },
        type: 'reply',
        createdAt: '2025-10-17T12:00:00.000Z',
      }

      expect(getTweetUrl(tweet)).toBe('/janesmith/status/reply123')
    })
  })

  describe('getTweetUrlFromParts', () => {
    it('constructs tweet URL from username and tweetId', () => {
      expect(getTweetUrlFromParts('johndoe', 'tweet123')).toBe('/johndoe/status/tweet123')
    })

    it('handles usernames with special characters', () => {
      expect(getTweetUrlFromParts('john_doe_123', 'tweet456')).toBe('/john_doe_123/status/tweet456')
    })

    it('constructs URL with different username formats', () => {
      expect(getTweetUrlFromParts('user', 'id1')).toBe('/user/status/id1')
      expect(getTweetUrlFromParts('a', 'b')).toBe('/a/status/b')
      expect(getTweetUrlFromParts('VeryLongUsername123', 'VeryLongTweetId456')).toBe('/VeryLongUsername123/status/VeryLongTweetId456')
    })

    it('handles numeric-like strings', () => {
      expect(getTweetUrlFromParts('user123', '456789')).toBe('/user123/status/456789')
    })
  })
})

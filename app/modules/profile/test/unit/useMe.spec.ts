import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMe, setMe, clearMe } from '../../composables/useMe'
import type { Me } from '../../types/user'

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $userInfoService: {
            getMe: vi.fn(() =>
                Promise.resolve({
                    user_id: '1',
                    name: 'Test User',
                    username: 'mhassan123',
                    bio: null,
                    avatar_url: null,
                    cover_url: null,
                    followers_count: 0,
                    following_count: 0,
                    country: null,
                    created_at: '2025-01-01',
                }),
            ),
        },
    }),
}))

vi.mock('@tanstack/vue-query', () => ({
    useQuery: vi.fn(() => ({
        data: { value: null },
    })),
}))

describe('useMe', () => {
    beforeEach(() => {
        clearMe()
        const mockUser: Me = {
            user_id: '1',
            name: 'Test User',
            username: 'mhassan123',
            bio: null,
            avatar_url: null,
            cover_url: null,
            followers_count: 0,
            following_count: 0,
            country: null,
            created_at: '2025-01-01',
        }
        setMe(mockUser)
    })

    it('returns true when username matches', () => {
        const { isMe } = useMe('mhassan123')
        expect(isMe.value).toBe(true)
    })

    it('returns false when username does not match', () => {
        const { isMe } = useMe('differentuser')
        expect(isMe.value).toBe(false)
    })
})

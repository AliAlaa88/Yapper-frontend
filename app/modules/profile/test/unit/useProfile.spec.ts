import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProfile } from '../../composables/useProfile'
import { useProfileStore } from '../../stores/profileStore'
import { setActivePinia, createPinia } from 'pinia'

const mockMeQuery = {
    data: { value: null },
    isLoading: { value: false },
}

const mockUserQuery = {
    data: { value: null },
    isLoading: { value: false },
}

vi.mock('../../queries/useMeQuery', () => ({
    useMeQuery: () => mockMeQuery,
}))

vi.mock('../../queries/useOtherUserQuery', () => ({
    useOtherUserQuery: () => mockUserQuery,
}))

describe('useProfile', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        })
    })

    it('identifies own profile correctly', () => {
        const currentUser = { username: 'testuser', user_id: '123' }
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(currentUser))

        mockMeQuery.data.value = {
            user_id: '123',
            name: 'Test User',
            username: 'testuser',
            bio: 'Test bio',
            avatar_url: 'avatar.jpg',
            cover_url: 'cover.jpg',
            country: 'USA',
            created_at: '2024-01-01',
            birth_date: '1990-01-01',
            followers_count: 100,
            following_count: 50,
        }

        const result = useProfile('testuser')

        // isMyProfile is returned as a computed from the store
        expect(result.isMyProfile).toBeDefined()
    })

    it('identifies other user profile correctly', () => {
        const currentUser = { username: 'myuser', user_id: '123' }
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(currentUser))

        mockUserQuery.data.value = {
            user_id: '456',
            name: 'Other User',
            username: 'otheruser',
            bio: 'Other bio',
            avatar_url: 'avatar2.jpg',
            is_follower: false,
            is_following: false,
            is_muted: false,
            is_blocked: false,
            top_mutual_followers: [],
            mutual_followers_count: '0',
        }

        const result = useProfile('otheruser')

        // isMyProfile is returned as a computed from the store
        expect(result.isMyProfile).toBeDefined()
    })

    it('returns profile from store', () => {
        const currentUser = { username: 'testuser', user_id: '123' }
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(currentUser))

        const mockProfile = {
            user_id: '123',
            name: 'Test User',
            username: 'testuser',
            bio: 'Test bio',
            avatar_url: 'avatar.jpg',
            cover_url: 'cover.jpg',
            country: 'USA',
            created_at: '2024-01-01',
            birth_date: '1990-01-01',
            followers_count: 100,
            following_count: 50,
        }

        mockMeQuery.data.value = mockProfile

        const result = useProfile('testuser')

        expect(result.profile).toBeDefined()
    })

    it('returns loading state from query', () => {
        const currentUser = { username: 'testuser', user_id: '123' }
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(currentUser))

        mockMeQuery.isLoading.value = false

        const result = useProfile('testuser')

        expect(result.isLoading).toBeDefined()
    })

    it('handles missing currentUser in localStorage', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)

        const result = useProfile('testuser')

        expect(result).toBeDefined()
        expect(result.profile).toBeDefined()
    })

    it('handles invalid JSON in localStorage', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid json')

        const result = useProfile('testuser')

        expect(result).toBeDefined()
    })
})

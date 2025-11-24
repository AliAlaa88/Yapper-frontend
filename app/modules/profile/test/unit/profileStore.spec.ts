import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '../../stores/profileStore'
import type { Me, OtherUser } from '../../types/user'

describe('profileStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('initializes with null profile and false isMyProfile', () => {
        const store = useProfileStore()

        expect(store.profile).toBeNull()
        expect(store.isMyProfile).toBe(false)
    })

    it('sets profile correctly for current user', () => {
        const store = useProfileStore()
        const mockUser: Me = {
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

        store.setProfile(mockUser, true)

        expect(store.profile).toEqual(mockUser)
        expect(store.isMyProfile).toBe(true)
    })

    it('sets profile correctly for other user', () => {
        const store = useProfileStore()
        const mockOtherUser: OtherUser = {
            user_id: '456',
            name: 'Other User',
            username: 'otheruser',
            bio: 'Other bio',
            avatar_url: 'avatar2.jpg',
            cover_url: 'cover2.jpg',
            is_follower: false,
            is_following: false,
            is_muted: false,
            is_blocked: false,
            followers_count: 50,
            following_count: 25,
            top_mutual_followers: [],
            mutual_followers_count: '0',
        }

        store.setProfile(mockOtherUser, false)

        expect(store.profile).toEqual(mockOtherUser)
        expect(store.isMyProfile).toBe(false)
    })

    it('clears profile correctly', () => {
        const store = useProfileStore()
        const mockUser: Me = {
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

        store.setProfile(mockUser, true)
        store.clearProfile()

        expect(store.profile).toBeNull()
        expect(store.isMyProfile).toBe(false)
    })

    it('gets profile ID when profile exists', () => {
        const store = useProfileStore()
        const mockUser: Me = {
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

        store.setProfile(mockUser, true)

        expect(store.getProfileId()).toBe('123')
    })

    it('returns null for profile ID when profile is null', () => {
        const store = useProfileStore()

        expect(store.getProfileId()).toBeNull()
    })

    it('updates profile data correctly', () => {
        const store = useProfileStore()
        const initialUser: Me = {
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

        store.setProfile(initialUser, true)

        const updatedUser: Me = {
            ...initialUser,
            name: 'Updated Name',
            bio: 'Updated bio',
        }

        store.setProfile(updatedUser, true)

        expect(store.profile?.name).toBe('Updated Name')
        expect(store.profile?.bio).toBe('Updated bio')
    })

    it('switches from own profile to other profile', () => {
        const store = useProfileStore()
        const myUser: Me = {
            user_id: '123',
            name: 'My User',
            username: 'myuser',
            bio: 'My bio',
            avatar_url: 'avatar.jpg',
            cover_url: 'cover.jpg',
            country: 'USA',
            created_at: '2024-01-01',
            birth_date: '1990-01-01',
            followers_count: 100,
            following_count: 50,
        }

        store.setProfile(myUser, true)
        expect(store.isMyProfile).toBe(true)

        const otherUser: OtherUser = {
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

        store.setProfile(otherUser, false)
        expect(store.isMyProfile).toBe(false)
        expect(store.profile?.user_id).toBe('456')
    })
})

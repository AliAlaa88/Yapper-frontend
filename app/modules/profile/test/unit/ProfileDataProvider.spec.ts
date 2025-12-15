import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '../../stores/profileStore'

describe('ProfileDataProvider Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('uses profile store initialization', () => {
        const store = useProfileStore()
        expect(store.profile).toBeNull()
        expect(store.isMyProfile).toBe(false)
    })

    it('sets profile in store correctly', () => {
        const store = useProfileStore()
        const mockProfile = {
            user_id: 'user-123',
            username: 'testuser',
            name: 'Test User',
        } as any

        store.setProfile(mockProfile, false)
        expect(store.profile).toEqual(mockProfile)
    })

    it('clears profile from store', () => {
        const store = useProfileStore()
        store.setProfile({ user_id: 'user-123', username: 'testuser' } as any, false)
        expect(store.profile).not.toBeNull()

        store.clearProfile()
        expect(store.profile).toBeNull()
    })

    it('handles profile store state transitions', () => {
        const store = useProfileStore()

        // Start with no profile
        expect(store.profile).toBeNull()

        // Set own profile
        store.setProfile({ user_id: 'me', username: 'myuser' } as any, true)
        expect(store.isMyProfile).toBe(true)

        // Switch to other profile
        store.setProfile({ user_id: 'other', username: 'otheruser' } as any, false)
        expect(store.isMyProfile).toBe(false)
    })

    it('gets profile ID from store', () => {
        const store = useProfileStore()
        store.setProfile({ user_id: 'user-456', username: 'alice' } as any, false)

        const id = store.getProfileId()
        expect(id).toBe('user-456')
    })

    it('manages profile updates', () => {
        const store = useProfileStore()
        store.setProfile(
            { user_id: 'user-789', username: 'bob', followers_count: 100 } as any,
            false,
        )

        expect(store.profile?.followers_count).toBe(100)
    })

    it('handles null profile gracefully', () => {
        const store = useProfileStore()
        expect(store.profile).toBeNull()

        const id = store.getProfileId()
        expect(id).toBeNull()
    })

    it('maintains profile store singleton', () => {
        const store1 = useProfileStore()
        const store2 = useProfileStore()

        store1.setProfile({ user_id: 'test-id', username: 'testuser' } as any, true)
        expect(store2.profile?.user_id).toBe('test-id')
    })
})

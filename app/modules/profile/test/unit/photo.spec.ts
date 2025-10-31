import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfilePhotoStore } from '../../stores/photo'

describe('ProfilePhotoStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('initializes with null values', () => {
        const store = useProfilePhotoStore()
        expect(store.photoUrl).toBeNull()
        expect(store.coverUrl).toBeNull()
    })

    it('sets and clears photo URL', () => {
        const store = useProfilePhotoStore()

        store.setPhotoUrl('https://example.com/photo.jpg')
        expect(store.photoUrl).toBe('https://example.com/photo.jpg')

        store.clearPhotoUrl()
        expect(store.photoUrl).toBeNull()
    })

    it('sets and clears cover URL', () => {
        const store = useProfilePhotoStore()

        store.setCoverUrl('https://example.com/cover.jpg')
        expect(store.coverUrl).toBe('https://example.com/cover.jpg')

        store.clearCoverUrl()
        expect(store.coverUrl).toBeNull()
    })

    it('handles multiple URL updates', () => {
        const store = useProfilePhotoStore()

        store.setPhotoUrl('url1')
        expect(store.photoUrl).toBe('url1')

        store.setPhotoUrl('url2')
        expect(store.photoUrl).toBe('url2')

        store.setCoverUrl('cover1')
        expect(store.coverUrl).toBe('cover1')

        store.setCoverUrl('cover2')
        expect(store.coverUrl).toBe('cover2')
    })
})

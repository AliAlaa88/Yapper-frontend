import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PhotoModal from '../../components/ProfilePhoto/PhotoModal.vue'
import { useProfilePhotoStore } from '../../stores/photo'

const mockPush = vi.fn()
const mockRoute = {
    params: { username: 'testuser' },
}

vi.mock('nuxt/app', () => ({
    useRoute: vi.fn(() => mockRoute),
    useRouter: vi.fn(() => ({
        push: mockPush,
    })),
}))

vi.mock('lucide-vue-next', () => ({
    X: {
        name: 'X',
        template: '<svg></svg>',
    },
}))

describe('PhotoModal', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        mockPush.mockClear()
    })

    it('renders the photo modal with image', () => {
        const store = useProfilePhotoStore()
        store.setPhotoUrl('https://example.com/photo.jpg')

        const wrapper = mount(PhotoModal)

        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toBe('https://example.com/photo.jpg')
    })

    it('closes modal when close button is clicked', async () => {
        const store = useProfilePhotoStore()
        store.setPhotoUrl('https://example.com/photo.jpg')

        const wrapper = mount(PhotoModal)
        await wrapper.find('button').trigger('click')

        expect(mockPush).toHaveBeenCalledWith('/profile/testuser')
    })

    it('closes modal on ESC key press', () => {
        const store = useProfilePhotoStore()
        store.setPhotoUrl('https://example.com/photo.jpg')

        mount(PhotoModal)

        const escEvent = new KeyboardEvent('keydown', { key: 'Escape' })
        window.dispatchEvent(escEvent)

        expect(mockPush).toHaveBeenCalledWith('/profile/testuser')
    })

    it('clears photo URL on unmount', () => {
        const store = useProfilePhotoStore()
        store.setPhotoUrl('https://example.com/photo.jpg')

        const wrapper = mount(PhotoModal)
        wrapper.unmount()

        expect(store.photoUrl).toBeNull()
    })
})

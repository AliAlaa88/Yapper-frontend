import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoverModal from '../../components/ProfilePhoto/CoverModal.vue'
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

describe('CoverModal', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        mockPush.mockClear()
    })

    it('renders the cover modal with image', () => {
        const store = useProfilePhotoStore()
        store.setCoverUrl('https://example.com/cover.jpg')

        const wrapper = mount(CoverModal)

        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toBe('https://example.com/cover.jpg')
    })

    it('closes modal when close button is clicked', async () => {
        const store = useProfilePhotoStore()
        store.setCoverUrl('https://example.com/cover.jpg')

        const wrapper = mount(CoverModal)
        await wrapper.find('button').trigger('click')

        expect(mockPush).toHaveBeenCalledWith('/profile/testuser')
    })

    it('closes modal on ESC key press', () => {
        const store = useProfilePhotoStore()
        store.setCoverUrl('https://example.com/cover.jpg')

        mount(CoverModal)

        const escEvent = new KeyboardEvent('keydown', { key: 'Escape' })
        window.dispatchEvent(escEvent)

        expect(mockPush).toHaveBeenCalledWith('/profile/testuser')
    })

    it('clears cover URL on unmount', () => {
        const store = useProfilePhotoStore()
        store.setCoverUrl('https://example.com/cover.jpg')

        const wrapper = mount(CoverModal)
        wrapper.unmount()

        expect(store.coverUrl).toBeNull()
    })
})

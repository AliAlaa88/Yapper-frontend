import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoverModal from '../../components/ProfilePhoto/CoverModal.vue'
import { useProfileStore } from '../../stores/profileStore'

const mockBack = vi.fn()
const mockRoute = {
    params: { username: 'testuser' },
}

vi.mock('nuxt/app', () => ({
    useRoute: vi.fn(() => mockRoute),
    useRouter: vi.fn(() => ({
        back: mockBack,
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
        mockBack.mockClear()
    })

    it('renders the cover modal with image', () => {
        const store = useProfileStore()
        store.setProfile(
            {
                user_id: '1',
                username: 'testuser',
                name: 'Test User',
                cover_url: 'https://example.com/cover.jpg',
            } as any,
            true,
        )

        const wrapper = mount(CoverModal)

        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toBe('https://example.com/cover.jpg')
    })

    it('closes modal when close button is clicked', async () => {
        const store = useProfileStore()
        store.setProfile(
            {
                user_id: '1',
                username: 'testuser',
                name: 'Test User',
                cover_url: 'https://example.com/cover.jpg',
            } as any,
            true,
        )

        const wrapper = mount(CoverModal)
        await wrapper.find('button').trigger('click')

        expect(mockBack).toHaveBeenCalled()
    })
})

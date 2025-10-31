import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import EditProfile from '../../components/EditProfile/EditProfile.vue'
import { useProfilePhotoStore } from '../../stores/photo'

const mockPush = vi.fn()
const mockMutateAsync = vi.fn()

vi.mock('nuxt/app', () => ({
    useRoute: vi.fn(() => ({ params: { username: 'testuser' } })),
    useRouter: vi.fn(() => ({ push: mockPush })),
}))

vi.mock('../../queries/useUserInfoQuery', () => ({
    useUserInfoQuery: vi.fn(() => ({
        data: {
            value: {
                id: '1',
                name: 'Test User',
                bio: 'Test bio',
                country: 'USA',
                created_at: '2020-01-01',
                avatar_url: 'https://example.com/avatar.jpg',
                cover_url: 'https://example.com/cover.jpg',
            },
        },
    })),
}))

vi.mock('../../queries/useEditProfileQuery', () => ({
    useEditProfileMutation: vi.fn(() => ({
        mutateAsync: mockMutateAsync,
        isPending: { value: false },
    })),
}))

vi.mock('lucide-vue-next', () => ({
    X: { name: 'X', template: '<svg></svg>' },
    Camera: { name: 'Camera', template: '<svg></svg>' },
}))

describe('EditProfile', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        mockPush.mockClear()
        mockMutateAsync.mockClear()
    })

    it('renders modal and initializes data', async () => {
        const wrapper = mount(EditProfile)
        await flushPromises()

        expect(wrapper.find('.fixed').exists()).toBe(true)
        expect((wrapper.find('#name').element as HTMLInputElement).value).toBe('Test User')
    })

    it('closes modal via close button, ESC, and click outside', async () => {
        const wrapper = mount(EditProfile)
        await wrapper.findComponent({ name: 'EditProfileHeader' }).vm.$emit('close')
        expect(mockPush).toHaveBeenCalledWith('/profile/testuser')

        mockPush.mockClear()
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
        expect(mockPush).toHaveBeenCalled()

        mockPush.mockClear()
        await wrapper.find('.fixed').trigger('click')
        expect(mockPush).toHaveBeenCalled()
    })

    it('handles photo upload and remove', async () => {
        const wrapper = mount(EditProfile)
        const store = useProfilePhotoStore()

        await wrapper.findComponent({ name: 'EditProfileCover' }).vm.$emit('remove')
        expect(store.coverUrl).toBeNull()

        await wrapper.findComponent({ name: 'EditProfileAvatar' }).vm.$emit('remove')
        expect(store.photoUrl).toBeNull()

        const coverComponent = wrapper.findComponent({ name: 'EditProfileCover' })
        await coverComponent.vm.$emit('upload')

        const avatarComponent = wrapper.findComponent({ name: 'EditProfileAvatar' })
        await avatarComponent.vm.$emit('upload')

        expect(wrapper.findAll('input[accept="image/*"]').length).toBe(2)
    })

    it('saves profile and closes modal', async () => {
        mockMutateAsync.mockResolvedValue({})
        const wrapper = mount(EditProfile)
        await flushPromises()

        await wrapper.findComponent({ name: 'EditProfileHeader' }).vm.$emit('save')
        await flushPromises()

        expect(mockMutateAsync).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/profile/testuser')
    })

    it('validates form and handles errors', async () => {
        const wrapper = mount(EditProfile)
        await flushPromises()

        const form = wrapper.findComponent({ name: 'EditProfileForm' })
        await form.vm.$emit('update:modelValue', { name: '', bio: '', country: '', created_at: '' })

        const header = wrapper.findComponent({ name: 'EditProfileHeader' })
        expect(header.props('isValid')).toBe(false)

        // Error handling
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
        mockMutateAsync.mockRejectedValue(new Error('Failed'))
        await form.vm.$emit('update:modelValue', {
            name: 'Valid',
            bio: '',
            country: '',
            created_at: '',
        })
        await header.vm.$emit('save')
        await flushPromises()

        expect(consoleError).toHaveBeenCalled()
        consoleError.mockRestore()
    })

    it('cleans up on unmount', () => {
        const store = useProfilePhotoStore()
        store.setPhotoUrl('test.jpg')
        store.setCoverUrl('cover.jpg')

        const wrapper = mount(EditProfile)
        wrapper.unmount()

        expect(store.photoUrl).toBeNull()
        expect(store.coverUrl).toBeNull()
    })
})

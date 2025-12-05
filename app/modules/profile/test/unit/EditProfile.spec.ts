import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import EditProfile from '../../components/EditProfile/EditProfile.vue'
import { useProfileStore } from '../../stores/profileStore'

const mockPush = vi.fn()
const mockEditMutateAsync = vi.fn()
const mockUploadCoverMutateAsync = vi.fn()
const mockUploadAvatarMutateAsync = vi.fn()

vi.mock('nuxt/app', () => ({
    useRoute: vi.fn(() => ({ params: { username: 'testuser' } })),
    useRouter: vi.fn(() => ({ back: mockPush })),
}))

vi.mock('../../queries/useEditProfileQuery', () => ({
    useEditProfileMutation: vi.fn(() => ({
        editProfileMutation: {
            mutateAsync: mockEditMutateAsync,
            isPending: { value: false },
        },
        uploadCoverPhotoMutation: {
            mutateAsync: mockUploadCoverMutateAsync,
            isPending: { value: false },
        },
        uploadAvatarMutation: {
            mutateAsync: mockUploadAvatarMutateAsync,
            isPending: { value: false },
        },
    })),
}))

vi.mock('lucide-vue-next', () => ({
    X: { name: 'X', template: '<svg></svg>' },
    Camera: { name: 'Camera', template: '<svg></svg>' },
}))

// Mock subcomponents to avoid rendering issues and focus on EditProfile logic
vi.mock('../../components/EditProfile/SubComponents/EditProfileHeader.vue', () => ({
    default: {
        name: 'EditProfileHeader',
        template: '<div @click="$emit(\'save\')">Header</div>',
        props: ['isValid', 'isSaving'],
        emits: ['close', 'save']
    }
}))
vi.mock('../../components/EditProfile/SubComponents/EditProfileCover.vue', () => ({
    default: {
        name: 'EditProfileCover',
        template: '<div @click="$emit(\'upload\')">Cover</div>',
        props: ['coverUrl'],
        emits: ['upload', 'remove']
    }
}))
vi.mock('../../components/EditProfile/SubComponents/EditProfileAvatar.vue', () => ({
    default: {
        name: 'EditProfileAvatar',
        template: '<div @click="$emit(\'upload\')">Avatar</div>',
        props: ['avatarUrl'],
        emits: ['upload', 'remove']
    }
}))
vi.mock('../../components/EditProfile/SubComponents/EditProfileForm.vue', () => ({
    default: {
        name: 'EditProfileForm',
        template: '<input v-model="modelValue.name" id="edit-profile-name-input" />',
        props: ['modelValue'],
        emits: ['update:modelValue']
    }
}))

describe('EditProfile', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        mockPush.mockClear()
        mockEditMutateAsync.mockClear()
        mockUploadCoverMutateAsync.mockClear()
        mockUploadAvatarMutateAsync.mockClear()
    })

    it('renders modal and initializes data from store', async () => {
        const store = useProfileStore()
        store.setProfile({
            user_id: '1',
            name: 'Ali',
            bio: 'Test',
            country: 'EG',
            birth_date: '2020-01-01',
            avatar_url: 'https://example.com/avatar.jpg',
            cover_url: 'https://example.com/cover.jpg',
        } as any, true)

        const wrapper = mount(EditProfile)
        await flushPromises()

        expect(wrapper.find('#edit-profile-modal').exists()).toBe(true)
        expect((wrapper.vm as any).formData.name).toBe('Ali')
    })

    it('closes modal via close button (header emit)', async () => {
        const wrapper = mount(EditProfile)
        await wrapper.findComponent({ name: 'EditProfileHeader' }).vm.$emit('close')
        expect(mockPush).toHaveBeenCalled()
    })

    it('saves profile and closes modal', async () => {
        const store = useProfileStore()
        store.setProfile({ user_id: '1', name: 'Ali' } as any, true)

        mockEditMutateAsync.mockResolvedValue({})
        const wrapper = mount(EditProfile)
        await flushPromises()

        await wrapper.findComponent({ name: 'EditProfileHeader' }).vm.$emit('save')
        await flushPromises()

        expect(mockEditMutateAsync).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalled()
    })
})

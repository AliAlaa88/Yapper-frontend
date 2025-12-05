import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EditProfileAvatar from '../../components/EditProfile/SubComponents/EditProfileAvatar.vue'

vi.mock('lucide-vue-next', () => ({
    X: { name: 'X', template: '<svg></svg>' },
    Camera: { name: 'Camera', template: '<svg></svg>' },
}))

describe('EditProfileAvatar', () => {
    it('renders with and without avatar image', () => {
        const withAvatar = mount(EditProfileAvatar, {
            props: { avatarUrl: 'https://example.com/avatar.jpg' },
        })
        const withoutAvatar = mount(EditProfileAvatar, {
            props: { avatarUrl: null },
        })

        expect(withAvatar.find('img').exists()).toBe(true)
        expect(withoutAvatar.find('img').exists()).toBe(false)
    })
})

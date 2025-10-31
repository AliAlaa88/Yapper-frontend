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

    it('emits upload and remove events', async () => {
        const wrapper = mount(EditProfileAvatar, {
            props: { avatarUrl: 'https://example.com/avatar.jpg' },
        })

        const buttons = wrapper.findAll('button')
        await buttons[0]?.trigger('click')
        await buttons[1]?.trigger('click')

        expect(wrapper.emitted('upload')).toBeTruthy()
        expect(wrapper.emitted('remove')).toBeTruthy()
    })

    it('shows remove button only when avatar exists', () => {
        const withAvatar = mount(EditProfileAvatar, {
            props: { avatarUrl: 'https://example.com/avatar.jpg' },
        })
        const withoutAvatar = mount(EditProfileAvatar, {
            props: { avatarUrl: null },
        })

        expect(withAvatar.findAll('button').length).toBe(2)
        expect(withoutAvatar.findAll('button').length).toBe(1)
    })
})

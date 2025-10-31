import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EditProfileCover from '../../components/EditProfile/SubComponents/EditProfileCover.vue'

vi.mock('lucide-vue-next', () => ({
    X: { name: 'X', template: '<svg></svg>' },
    Camera: { name: 'Camera', template: '<svg></svg>' },
}))

describe('EditProfileCover', () => {
    it('renders with and without cover image', () => {
        const withCover = mount(EditProfileCover, {
            props: { coverUrl: 'https://example.com/cover.jpg' },
        })
        const withoutCover = mount(EditProfileCover, {
            props: { coverUrl: null },
        })

        expect(withCover.find('img').exists()).toBe(true)
        expect(withoutCover.find('img').exists()).toBe(false)
    })

    it('emits upload and remove events', async () => {
        const wrapper = mount(EditProfileCover, {
            props: { coverUrl: 'https://example.com/cover.jpg' },
        })

        const buttons = wrapper.findAll('button')
        await buttons[0]?.trigger('click')
        await buttons[1]?.trigger('click')

        expect(wrapper.emitted('upload')).toBeTruthy()
        expect(wrapper.emitted('remove')).toBeTruthy()
    })

    it('shows remove button only when cover exists', () => {
        const withCover = mount(EditProfileCover, {
            props: { coverUrl: 'https://example.com/cover.jpg' },
        })
        const withoutCover = mount(EditProfileCover, {
            props: { coverUrl: null },
        })

        expect(withCover.findAll('button').length).toBe(2)
        expect(withoutCover.findAll('button').length).toBe(1)
    })
})

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
})

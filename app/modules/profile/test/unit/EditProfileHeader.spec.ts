import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EditProfileHeader from '../../components/EditProfile/SubComponents/EditProfileHeader.vue'

vi.mock('lucide-vue-next', () => ({
    X: { name: 'X', template: '<svg></svg>' },
}))

describe('EditProfileHeader', () => {
    it('renders header with title', () => {
        const wrapper = mount(EditProfileHeader, {
            props: { isValid: true, isSaving: false },
        })
        expect(wrapper.text()).toContain('Edit profile')
    })

    it('emits close and save events', async () => {
        const wrapper = mount(EditProfileHeader, {
            props: { isValid: true, isSaving: false },
        })

        const buttons = wrapper.findAll('button')
        await buttons[0]?.trigger('click')
        await buttons[1]?.trigger('click')

        expect(wrapper.emitted('close')).toBeTruthy()
        expect(wrapper.emitted('save')).toBeTruthy()
    })

    it('disables save button when invalid or saving', () => {
        const invalid = mount(EditProfileHeader, {
            props: { isValid: false, isSaving: false },
        })
        const saving = mount(EditProfileHeader, {
            props: { isValid: true, isSaving: true },
        })

        expect(invalid.findAll('button')[1]?.attributes('disabled')).toBeDefined()
        expect(saving.findAll('button')[1]?.attributes('disabled')).toBeDefined()
    })

    it('shows correct button text', () => {
        const normal = mount(EditProfileHeader, {
            props: { isValid: true, isSaving: false },
        })
        const saving = mount(EditProfileHeader, {
            props: { isValid: true, isSaving: true },
        })

        expect(normal.text()).toContain('Save')
        expect(saving.text()).toContain('Saving...')
    })
})

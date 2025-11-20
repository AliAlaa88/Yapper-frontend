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
})

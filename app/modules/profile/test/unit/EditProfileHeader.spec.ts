import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EditProfileHeader from '../../components/EditProfile/SubComponents/EditProfileHeader.vue'

vi.mock('lucide-vue-next', () => ({
    X: { name: 'X', template: '<svg></svg>' },
}))

const globalMocks = {
    mocks: {
        $t: (key: string) => key
    }
}

describe('EditProfileHeader', () => {
    it('renders header with title', () => {
        const wrapper = mount(EditProfileHeader, {
            props: { isValid: true, isSaving: false },
            global: globalMocks
        })
        expect(wrapper.text()).toContain('profile.editProfileModal.title')
    })

    it('disables save button when invalid or saving', () => {
        const invalid = mount(EditProfileHeader, {
            props: { isValid: false, isSaving: false },
            global: globalMocks
        })
        const saving = mount(EditProfileHeader, {
            props: { isValid: true, isSaving: true },
            global: globalMocks
        })

        expect(invalid.findAll('button')[1]?.attributes('disabled')).toBeDefined()
        expect(saving.findAll('button')[1]?.attributes('disabled')).toBeDefined()
    })
})

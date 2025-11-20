import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditProfileForm from '../../components/EditProfile/SubComponents/EditProfileForm.vue'

describe('EditProfileForm', () => {
    const formData = {
        name: 'Ali Alaa',
        bio: 'Bio',
        country: 'egypt',
        created_at: '2026-01-01',
    }

    it('renders all form fields with values', () => {
        const wrapper = mount(EditProfileForm, {
            props: { modelValue: formData },
        })

        expect(wrapper.find('#edit-profile-name-input').exists()).toBe(true)
        expect(wrapper.find('#edit-profile-bio-input').exists()).toBe(true)
        expect(wrapper.find('#edit-profile-location-input').exists()).toBe(true)
        expect(wrapper.find('#edit-profile-birthdate-input').exists()).toBe(true)

        expect((wrapper.find('#edit-profile-name-input').element as HTMLInputElement).value).toBe(
            'Ali Alaa',
        )
        expect(
            (wrapper.find('#edit-profile-bio-input').element as HTMLTextAreaElement).value,
        ).toBe('Bio')
    })
})

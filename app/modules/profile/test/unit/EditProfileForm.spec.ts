import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EditProfileForm from '../../components/EditProfile/SubComponents/EditProfileForm.vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: { value: 'en' },
    }),
}))

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
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })

        expect(wrapper.find('#edit-profile-name-input').exists()).toBe(true)
        expect(wrapper.find('#edit-profile-bio-input').exists()).toBe(true)
        expect(wrapper.find('#edit-profile-location-input').exists()).toBe(true)
        expect(wrapper.find('#edit-profile-month-input').exists()).toBe(true)
        expect(wrapper.find('#edit-profile-day-input').exists()).toBe(true)
        expect(wrapper.find('#edit-profile-year-input').exists()).toBe(true)

        expect((wrapper.find('#edit-profile-name-input').element as HTMLInputElement).value).toBe(
            'Ali Alaa',
        )
        expect((wrapper.find('#edit-profile-bio-input').element as HTMLTextAreaElement).value).toBe(
            'Bio',
        )
    })
})

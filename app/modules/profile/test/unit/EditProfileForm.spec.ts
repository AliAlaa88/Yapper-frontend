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

        expect(wrapper.find('#name').exists()).toBe(true)
        expect(wrapper.find('#bio').exists()).toBe(true)
        expect(wrapper.find('#location').exists()).toBe(true)
        expect(wrapper.find('#birthDate').exists()).toBe(true)

        expect((wrapper.find('#name').element as HTMLInputElement).value).toBe('Ali Alaa')
        expect((wrapper.find('#bio').element as HTMLTextAreaElement).value).toBe('Bio')
    })

    it('emits update:modelValue when fields change', async () => {
        const wrapper = mount(EditProfileForm, {
            props: { modelValue: formData },
        })

        await wrapper.find('#name').setValue('Jane Doe')
        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({
            name: 'Jane Doe',
        })
    })

    it('shows character counts', () => {
        const wrapper = mount(EditProfileForm, {
            props: { modelValue: formData },
        })

        expect(wrapper.text()).toContain('8/50')
        expect(wrapper.text()).toContain('8/160')
        expect(wrapper.text()).toContain('3/30')
    })

    it('enforces maxlength constraints', () => {
        const wrapper = mount(EditProfileForm, {
            props: { modelValue: formData },
        })

        expect(wrapper.find('#name').attributes('maxlength')).toBe('50')
        expect(wrapper.find('#bio').attributes('maxlength')).toBe('160')
        expect(wrapper.find('#location').attributes('maxlength')).toBe('30')
    })
})

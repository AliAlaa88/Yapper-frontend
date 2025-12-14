import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

import VerifyEmailOTP from '~/modules/settings/components/AccountInformations/SubComponents/VerifyEmailOTP.vue'

const verifyMutateAsync = vi.fn()
const resendMutateAsync = vi.fn()
const resetMock = vi.fn()

const isPending = ref(false)

vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({
        verifyEmailOTPMutation: {
            mutateAsync: verifyMutateAsync,
            isPending,
            reset: resetMock,
        },
        sendEmailOTPMutation: {
            mutateAsync: resendMutateAsync,
            isPending: ref(false),
        },
    }),
}))

describe('VerifyEmailOTP', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        isPending.value = false
    })

    const factory = () =>
        mount(VerifyEmailOTP, {
            props: {
                isOpen: true,
                newEmail: 'test@email.com',
            },
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    Popup: {
                        props: ['isOpen'],
                        template: `<div data-test="popup"><slot /></div>`,
                    },
                    Logo: true,
                    BackButton: {
                        template: `<button data-test="back" @click="$emit('close')" />`,
                    },
                    Button: {
                        props: ['buttonText', 'disabled'],
                        template: `
              <button
                :disabled="disabled"
                @click="$emit('click')"
              >
                {{ buttonText }}
              </button>`,
                    },
                },
            },
        })

    it('disables verify button when OTP is empty', () => {
        const wrapper = factory()

        const verifyButton = wrapper.find('#verify-otp-button')
        expect(verifyButton.attributes('disabled')).toBeDefined()
    })

    it('enables verify button when OTP is entered', async () => {
        const wrapper = factory()

        await wrapper.find('#input-otp').setValue('123456')
        const verifyButton = wrapper.find('#verify-otp-button')

        expect(verifyButton.attributes('disabled')).toBeUndefined()
    })

    it('disables OTP input while verification is pending', async () => {
        isPending.value = true
        const wrapper = factory()

        const input = wrapper.find('#input-otp')
        expect(input.attributes('disabled')).toBeDefined()
    })

    it('clears error message before verify attempt', async () => {
        verifyMutateAsync.mockRejectedValueOnce(new Error('Invalid OTP'))

        const wrapper = factory()
        await wrapper.find('#input-otp').setValue('111111')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('Invalid OTP')

        verifyMutateAsync.mockResolvedValueOnce({})
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).not.toContain('Invalid OTP')
    })

    it('handles non-Error rejection gracefully', async () => {
        verifyMutateAsync.mockRejectedValueOnce('OTP expired')

        const wrapper = factory()
        await wrapper.find('#input-otp').setValue('999999')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('OTP expired')
    })

    it('shows error message if resend OTP fails', async () => {
        resendMutateAsync.mockRejectedValueOnce(new Error('Resend failed'))

        const wrapper = factory()
        await wrapper.find('#reset-otp-button').trigger('click')
        await flushPromises()

        expect(wrapper.text()).toContain('Resend failed')
    })

    it('clears error message before resend attempt', async () => {
        resendMutateAsync.mockRejectedValueOnce(new Error('Error'))

        const wrapper = factory()
        await wrapper.find('#reset-otp-button').trigger('click')
        await flushPromises()

        expect(wrapper.text()).toContain('Error')

        resendMutateAsync.mockResolvedValueOnce({})
        await wrapper.find('#reset-otp-button').trigger('click')
        await flushPromises()

        expect(wrapper.text()).not.toContain('Error')
    })

    it('handles Popup close event correctly', async () => {
        const wrapper = factory()

        await wrapper.find('[data-test="popup"]').trigger('close')

        expect(resetMock).toHaveBeenCalled()
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('resets OTP and error message on close', async () => {
        const wrapper = factory()

        await wrapper.find('#input-otp').setValue('123456')
        verifyMutateAsync.mockRejectedValueOnce(new Error('Error'))
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        await wrapper.find('[data-test="back"]').trigger('click')

        expect(resetMock).toHaveBeenCalled()
        expect(wrapper.emitted('close')).toBeTruthy()
    })
})

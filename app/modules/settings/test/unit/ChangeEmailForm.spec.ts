import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import ChangeEmailForm from '~/modules/settings/components/AccountInformations/SubComponents/ChangeEmailForm.vue'
import { ref } from 'vue'

export const mockMutateAsync = vi.fn()

vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({
        sendEmailOTPMutation: {
            mutateAsync: mockMutateAsync,
            isPending: ref(false),
            isError: ref(false),
            error: ref(null),
        },
    }),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: ref({
            email: 'test@example.com',
        }),
    }),
}))

// Mock router
const routerBack = vi.fn()
vi.mock('vue-router', () => ({
    useRouter: () => ({
        back: routerBack,
    }),
}))

describe('ChangeEmailForm', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    const factory = () =>
        mount(ChangeEmailForm, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    Popup: { template: '<div><slot /></div>' },
                    Logo: true,
                    Button: {
                        template: `<button @click="$emit('click')"><slot /></button>`,
                    },
                    VerifyEmailOTP: {
                        template: '<div data-test="otp-modal"></div>',
                    },
                },
            },
        })

    it('renders title and description correctly', () => {
        const wrapper = factory()

        expect(wrapper.text()).toContain('settings.accountInfo.change_email')
        expect(wrapper.text()).toContain('settings.accountInfo.change_email_description')
    })

    it('shows validation error for invalid email', async () => {
        const wrapper = factory()

        const input = wrapper.find('#input-new-email')
        await input.setValue('invalid-email')

        expect(wrapper.text()).toContain('Please enter a valid email.')
        expect(wrapper.find('#cancel-email-form-button').exists()).toBe(true)
        expect(wrapper.find('#next-email-form-button').exists()).toBe(false)
    })

    it('shows next button when email is valid', async () => {
        const wrapper = factory()

        await wrapper.find('#input-new-email').setValue('valid@email.com')

        expect(wrapper.find('#next-email-form-button').exists()).toBe(true)
        expect(wrapper.find('#cancel-email-form-button').exists()).toBe(false)
    })

    it('opens OTP modal after successful submit', async () => {
        mockMutateAsync.mockResolvedValueOnce({})

        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('valid@email.com')
        await wrapper.find('form').trigger('submit.prevent')

        await flushPromises()

        expect(mockMutateAsync).toHaveBeenCalledWith({
            newEmail: 'valid@email.com',
        })

        expect(wrapper.find('[data-test="otp-modal"]').exists()).toBe(true)
    })

    it('shows error message when mutation fails', async () => {
        mockMutateAsync.mockRejectedValueOnce({
            response: {
                data: { message: 'Email already exists' },
            },
        })

        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('valid@email.com')
        await wrapper.find('form').trigger('submit.prevent')

        await flushPromises()

        expect(wrapper.text()).toContain('Email already exists')
    })

    it('resets email and navigates back on close', async () => {
        const wrapper = factory()

        await wrapper.find('#input-new-email').setValue('invalid-email')
        await wrapper.find('#cancel-email-form-button').trigger('click')

        expect(routerBack).toHaveBeenCalled()
    })
})

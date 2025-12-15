import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import ChangeEmailForm from '~/modules/settings/components/AccountInformations/SubComponents/ChangeEmailForm.vue'
import { ref, nextTick } from 'vue'

export const mockMutateAsync = vi.fn()
const errorRef = ref<Error | null>(null)

vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({
        sendEmailOTPMutation: {
            mutateAsync: mockMutateAsync,
            isPending: ref(false),
            isError: ref(false),
            error: errorRef,
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
        errorRef.value = null
    })


    const factory = () =>
        mount(ChangeEmailForm, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    Popup: { 
                        template: '<div><slot /></div>',
                        props: ['isOpen', 'hasCloseButton'],
                        emits: ['close'],
                    },
                    Logo: true,
                    Button: {
                        template: `<button @click="$emit('click')"><slot /></button>`,
                        props: ['isLoading', 'buttonText', 'buttonClass'],
                    },
                    VerifyEmailOTP: {
                        template: '<div data-test="otp-modal"></div>',
                        props: ['isOpen', 'newEmail'],
                        emits: ['close', 'verified'],
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
        expect(mockMutateAsync).toHaveBeenCalledWith({ newEmail: 'valid@email.com' })
        expect(wrapper.find('[data-test="otp-modal"]').exists()).toBe(true)
    })

    it('shows error message when mutation fails with axios-like error', async () => {
        mockMutateAsync.mockRejectedValueOnce({
            response: { data: { message: 'Email already exists' } },
        })
        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('valid@email.com')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(wrapper.text()).toContain('Email already exists')
    })

    it('shows error message when mutation fails with Error instance', async () => {
        mockMutateAsync.mockRejectedValueOnce(new Error('Network error'))
        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('valid@email.com')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(wrapper.text()).toContain('Network error')
    })

    it('shows generic error when mutation fails with unknown error type', async () => {
        mockMutateAsync.mockRejectedValueOnce('unknown error')
        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('valid@email.com')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(wrapper.text()).toContain('An error occurred. Please try again.')
    })

    it('resets email and navigates back on close', async () => {
        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('invalid-email')
        await wrapper.find('#cancel-email-form-button').trigger('click')
        expect(routerBack).toHaveBeenCalled()
    })

    it('clears error message when email input changes', async () => {
        mockMutateAsync.mockRejectedValueOnce(new Error('Some error'))
        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('valid@email.com')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(wrapper.text()).toContain('Some error')
        
        await wrapper.find('#input-new-email').setValue('new@email.com')
        await nextTick()
        expect(wrapper.vm.errorMessage).toBe('')
    })

    it('handles OTP modal close event', async () => {
        mockMutateAsync.mockResolvedValueOnce({})
        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('valid@email.com')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        
        expect(wrapper.vm.showOTPModal).toBe(true)
        wrapper.vm.handleCloseOTP()
        expect(wrapper.vm.showOTPModal).toBe(false)
    })

    it('handles email verified by closing OTP modal', async () => {
        mockMutateAsync.mockResolvedValueOnce({})
        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('valid@email.com')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        
        expect(wrapper.vm.showOTPModal).toBe(true)
        wrapper.vm.handleEmailVerified()
        expect(wrapper.vm.showOTPModal).toBe(false)
    })

    it('updates error message when mutation error ref changes', async () => {
        const wrapper = factory()
        await nextTick()
        
        errorRef.value = new Error('Mutation error from watcher')
        await nextTick()
        
        expect(wrapper.vm.errorMessage).toBe('Mutation error from watcher')
    })

    it('does not submit when email is invalid', async () => {
        const wrapper = factory()
        await wrapper.find('#input-new-email').setValue('invalid')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(mockMutateAsync).not.toHaveBeenCalled()
    })
})

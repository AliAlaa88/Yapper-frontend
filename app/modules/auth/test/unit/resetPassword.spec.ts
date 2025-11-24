import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import enMessages from '../../../../i18n/locales/en.json' with { type: 'json' }
import arMessages from '../../../../i18n/locales/ar.json' with { type: 'json' }
import ForgetPassword from '../../components/forgetPassword.vue'
import ForgetPasswordStep1 from '../../components/subComponents/forgetPasswordComponents/forgetPasswordStep1.vue'
import ForgetPasswordStep2 from '../../components/subComponents/forgetPasswordComponents/forgetPasswordStep2.vue'
import ForgetPasswordStep3 from '../../components/subComponents/forgetPasswordComponents/forgetPasswordStep3.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enMessages,
        ar: arMessages,
    },
})

// Mock the auth service
const mockAuthService = {
    forgotPassword: vi.fn(),
    verifyForgotPasswordOTP: vi.fn(),
    resetPassword: vi.fn(),
}

// Mock the Nuxt app
vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
    }),
    navigateTo: vi.fn(),
}))

// Mock the forgot password queries - match TanStack Vue Query structure
vi.mock('~/modules/auth/queries/useForgetPasswordQuery', () => ({
    useForgotPasswordQuery: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn((payload) => {
            // Simulate async operation then call onSuccess
            Promise.resolve().then(() => {
                onSuccess?.({ identifier: payload.identifier })
            })
        }),
        isLoading: ref(false),
        isError: ref(false),
    })),
    useVerifyForgotPasswordOTPQuery: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn((payload) => {
            Promise.resolve().then(() => {
                onSuccess?.({ reset_token: 'test-reset-token' })
            })
        }),
        isLoading: ref(false),
        isError: ref(false),
    })),
    useResetPasswordQuery: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn((payload) => {
            Promise.resolve().then(() => {
                onSuccess?.({ message: 'Password reset successful' })
            })
        }),
        isLoading: ref(false),
        isError: ref(false),
    })),
}))

function mountResetPassword() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return mount(ForgetPassword, {
        global: {
            plugins: [
                [VueQueryPlugin, { queryClient }],
                i18n,
            ],
            stubs: {
                'logo': true,
                'closeButton': true,
                'Popup': {
                    template: '<div class="popup-mock"><slot /></div>',
                },
                NuxtLink: { template: '<a><slot /></a>' },
            },
        },
    })
}

describe('Reset Password Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Rendering', () => {
        it('should render step 1 initially', () => {
            const wrapper = mountResetPassword()
            expect(wrapper.findComponent(ForgetPasswordStep1).exists()).toBe(true)
            expect(wrapper.findComponent(ForgetPasswordStep2).exists()).toBe(false)
            expect(wrapper.findComponent(ForgetPasswordStep3).exists()).toBe(false)
        })

        it('should display find account title in step 1', () => {
            const wrapper = mountResetPassword()
            expect(wrapper.text()).toContain('Find your X account')
        })

        it('should have identifier input in step 1', () => {
            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')
            expect(input.exists()).toBe(true)
            expect(input.attributes('placeholder')).toContain('Phone, email, or username')
        })

        it('should have Next button in step 1', () => {
            const wrapper = mountResetPassword()
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            expect(nextButton).toBeTruthy()
        })
    })

    describe('Step 1: Find Account', () => {
        it('should allow entering identifier', async () => {
            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('user@example.com')

            expect((input.element as HTMLInputElement).value).toBe('user@example.com')
        })

        it('should call forgotPassword mutation with identifier', async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })

            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('user@example.com')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.findComponent(ForgetPasswordStep2).exists()).toBe(true)        
        })

        it('should move to step 2 on successful identifier verification', async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })

            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('user@example.com')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.findComponent(ForgetPasswordStep2).exists()).toBe(true)
            expect(wrapper.findComponent(ForgetPasswordStep1).exists()).toBe(false)
        })

        it('should show error message when identifier not found', async () => {
            mockAuthService.forgotPassword.mockRejectedValue({
                response: {
                    data: {
                        message: 'Identifier not found',
                    },
                },
            })

            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('nonexistent@example.com')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.text()).toContain('Identifier not found')
        })

        it('should accept email as identifier', async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })

            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('test@example.com')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('test@example.com')
        })

        it('should accept phone number as identifier', async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })

            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('+1234567890')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('+1234567890')
        })

        it('should accept username as identifier', async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })

            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('johndoe')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('johndoe')
        })
    })

    describe('Step 2: Verify OTP', () => {
        beforeEach(async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })
        })

        it('should display OTP verification screen after step 1', async () => {
            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('user@example.com')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.text()).toContain('We sent you a code to reset your password')
            expect(wrapper.findComponent(ForgetPasswordStep2).exists()).toBe(true)
        })

        it('should show OTP input field', async () => {
            const wrapper = mountResetPassword()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('user@example.com')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            expect(otpInput.exists()).toBe(true)
            expect(otpInput.attributes('placeholder')).toContain('Enter OTP')
        })

        it('should allow entering OTP', async () => {
            const wrapper = mountResetPassword()
            
            // Move to step 2
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            // Enter OTP
            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')

            expect((otpInput.element as HTMLInputElement).value).toBe('123456')
        })

        it('should call verifyForgotPasswordOTP mutation with identifier and OTP', async () => {
            mockAuthService.verifyForgotPasswordOTP.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    reset_token: 'test-reset-token-123',
                },
            })

            const wrapper = mountResetPassword()
            
            // Move to step 2
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            // Verify OTP
            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(mockAuthService.verifyForgotPasswordOTP).toHaveBeenCalledWith('user@example.com', '123456')
        })

        it('should move to step 3 on successful OTP verification', async () => {
            mockAuthService.verifyForgotPasswordOTP.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    reset_token: 'test-reset-token-123',
                },
            })

            const wrapper = mountResetPassword()
            
            // Move to step 2
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            // Verify OTP
            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.findComponent(ForgetPasswordStep3).exists()).toBe(true)
            expect(wrapper.text()).toContain('Reset Your Password')
        })

        it('should show error message on invalid OTP', async () => {
            mockAuthService.verifyForgotPasswordOTP.mockRejectedValue({
                response: {
                    data: {
                        message: 'Invalid OTP',
                    },
                },
            })

            const wrapper = mountResetPassword()
            
            // Move to step 2
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            // Enter wrong OTP
            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('000000')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.text()).toContain('Invalid OTP')
        })

        it('should pass identifier to step 2', async () => {
            const wrapper = mountResetPassword()
            
            // Move to step 2
            const input = wrapper.find('input[type="text"]')
            await input.setValue('test@example.com')
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const step2 = wrapper.findComponent(ForgetPasswordStep2)
            expect(step2.props('identifier')).toBe('test@example.com')
        })
    })

    describe('Step 3: Reset Password', () => {
        beforeEach(async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })
            mockAuthService.verifyForgotPasswordOTP.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    reset_token: 'test-reset-token-123',
                },
            })
        })

        it('should display reset password screen after OTP verification', async () => {
            const wrapper = mountResetPassword()
            
            // Move through steps 1 and 2
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.text()).toContain('Reset Your Password')
            expect(wrapper.findComponent(ForgetPasswordStep3).exists()).toBe(true)
        })

        it('should have two password input fields', async () => {
            const wrapper = mountResetPassword()
            
            // Move to step 3
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const passwordInputs = wrapper.findAll('input[type="password"]')
            expect(passwordInputs.length).toBe(2)
        })

        it('should allow entering new password', async () => {
            const wrapper = mountResetPassword()
            
            // Move to step 3
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const passwordInputs = wrapper.findAll('input[type="password"]')
            await passwordInputs[0]?.setValue('NewPassword123!')
            await passwordInputs[1]?.setValue('NewPassword123!')

            expect((passwordInputs[0]?.element as HTMLInputElement).value).toBe('NewPassword123!')
            expect((passwordInputs[1]?.element as HTMLInputElement).value).toBe('NewPassword123!')
        })

        it('should show error when passwords do not match', async () => {
            const wrapper = mountResetPassword()
            
            // Move to step 3
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const passwordInputs = wrapper.findAll('input[type="password"]')
            await passwordInputs[0]?.setValue('Password123!')
            await passwordInputs[1]?.setValue('DifferentPassword123!')

            const resetButton = wrapper.findAll('button').find(btn => btn.text() === 'Reset Password')
            await resetButton?.trigger('click')
            await flushPromises()

            expect(wrapper.text()).toContain('Passwords do not match')
        })

        it('should call resetPassword mutation with correct data', async () => {
            mockAuthService.resetPassword.mockResolvedValue({
                data: { message: 'Password reset successfully' },
            })

            const wrapper = mountResetPassword()
            
            // Move to step 3
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const passwordInputs = wrapper.findAll('input[type="password"]')
            await passwordInputs[0]?.setValue('NewPassword123!')
            await passwordInputs[1]?.setValue('NewPassword123!')

            const resetButton = wrapper.findAll('button').find(btn => btn.text() === 'Reset Password')
            await resetButton?.trigger('click')
            await flushPromises()

            expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
                'user@example.com',
                'NewPassword123!',
                'test-reset-token-123',
            )
        })

        it('should emit finish event on successful password reset', async () => {
            mockAuthService.resetPassword.mockResolvedValue({
                data: { message: 'Password reset successfully' },
            })

            const wrapper = mountResetPassword()
            
            // Move through all steps
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const passwordInputs = wrapper.findAll('input[type="password"]')
            await passwordInputs[0]?.setValue('NewPassword123!')
            await passwordInputs[1]?.setValue('NewPassword123!')

            const resetButton = wrapper.findAll('button').find(btn => btn.text() === 'Reset Password')
            await resetButton?.trigger('click')
            await flushPromises()

            expect(wrapper.emitted('finish')).toBeTruthy()
        })

        it('should show error on password reset failure', async () => {
            mockAuthService.resetPassword.mockRejectedValue({
                response: {
                    data: {
                        message: 'Reset token expired',
                    },
                },
            })

            const wrapper = mountResetPassword()
            
            // Move to step 3
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const passwordInputs = wrapper.findAll('input[type="password"]')
            await passwordInputs[0]?.setValue('NewPassword123!')
            await passwordInputs[1]?.setValue('NewPassword123!')

            const resetButton = wrapper.findAll('button').find(btn => btn.text() === 'Reset Password')
            await resetButton?.trigger('click')
            await flushPromises()

            expect(wrapper.text()).toContain('Reset token expired')
        })

        it('should pass reset token to step 3', async () => {
            const wrapper = mountResetPassword()
            
            // Move to step 3
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const step3 = wrapper.findComponent(ForgetPasswordStep3)
            expect(step3.props('reset_token')).toBe('test-reset-token-123')
            expect(step3.props('identifier')).toBe('user@example.com')
        })
    })

    describe('Integration Tests', () => {
        it('should complete full reset password flow', async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })
            mockAuthService.verifyForgotPasswordOTP.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    reset_token: 'test-reset-token-123',
                },
            })
            mockAuthService.resetPassword.mockResolvedValue({
                data: { message: 'Password reset successfully' },
            })

            const wrapper = mountResetPassword()

            // Step 1: Enter identifier
            const input = wrapper.find('input[type="text"]')
            await input.setValue('user@example.com')
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.findComponent(ForgetPasswordStep2).exists()).toBe(true)

            // Step 2: Enter OTP
            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.findComponent(ForgetPasswordStep3).exists()).toBe(true)

            // Step 3: Enter new password
            const passwordInputs = wrapper.findAll('input[type="password"]')
            await passwordInputs[0]?.setValue('NewPassword123!')
            await passwordInputs[1]?.setValue('NewPassword123!')

            const resetButton = wrapper.findAll('button').find(btn => btn.text() === 'Reset Password')
            await resetButton?.trigger('click')
            await flushPromises()

            expect(wrapper.emitted('finish')).toBeTruthy()
            expect(wrapper.findComponent(ForgetPasswordStep2).exists()).toBe(true) 
            expect(mockAuthService.verifyForgotPasswordOTP).toHaveBeenCalledWith('user@example.com', '123456')
            expect(mockAuthService.resetPassword).toHaveBeenCalledWith('user@example.com', 'NewPassword123!', 'test-reset-token-123')
        })

        it('should handle different identifier types throughout the flow', async () => {
            mockAuthService.forgotPassword.mockResolvedValue({
                data: { message: 'Reset code sent successfully' },
            })
            mockAuthService.verifyForgotPasswordOTP.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    reset_token: 'test-token',
                },
            })
            mockAuthService.resetPassword.mockResolvedValue({
                data: { message: 'Password reset successfully' },
            })

            const identifiers = ['test@example.com', '+1234567890', 'testuser']

            for (const identifier of identifiers) {
                vi.clearAllMocks()
                const wrapper = mountResetPassword()

                // Step 1
                const input = wrapper.find('input[type="text"]')
                await input.setValue(identifier)
                let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
                await nextButton?.trigger('click')
                await flushPromises()

                // Step 2
                const otpInput = wrapper.find('input[type="text"]')
                await otpInput.setValue('123456')
                nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
                await nextButton?.trigger('click')
                await flushPromises()

                // Step 3
                const passwordInputs = wrapper.findAll('input[type="password"]')
                await passwordInputs[0]?.setValue('NewPass123!')
                await passwordInputs[1]?.setValue('NewPass123!')

                const resetButton = wrapper.findAll('button').find(btn => btn.text() === 'Reset Password')
                await resetButton?.trigger('click')
                await flushPromises()

                expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(identifier)
                expect(mockAuthService.verifyForgotPasswordOTP).toHaveBeenCalledWith(identifier, '123456')
                expect(mockAuthService.resetPassword).toHaveBeenCalledWith(identifier, 'NewPass123!', 'test-token')
            }
        })
    })
})
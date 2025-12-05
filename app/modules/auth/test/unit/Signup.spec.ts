import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import enMessages from '../../../../i18n/locales/en.json' with { type: 'json' }
import arMessages from '../../../../i18n/locales/ar.json' with { type: 'json' }
import Signup from '../../components/createAccount.vue'
import createAccount from '../../components/subComponents/signupComponents/createAccount.vue'
import verifyOtp from '../../components/subComponents/signupComponents/verifyOtp.vue'
import FinalRegister from '../../components/subComponents/signupComponents/FinalRegister.vue'

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
    registerStep1: vi.fn(),
    registerStep2: vi.fn(),
    registerStep3: vi.fn(),
    resendOTP: vi.fn(),
}

// Mock the Nuxt app
vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
            recaptcha: 'test-key',
        },
    }),
}))

// Mock register queries - call mockAuthService and handle callbacks properly
vi.mock('~/modules/auth/queries/useRegisterQuery', () => ({
    useRegisterS1Query: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn(async (payload) => {
            try {
                const result = await mockAuthService.registerStep1(payload)
                await Promise.resolve()
                onSuccess?.(result)
            } catch (error) {
                onError?.(error)
            }
        }),
        isLoading: ref(false),
        isError: ref(false),
    })),
    useRegisterS2Query: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn(async (payload) => {
            try {
                const result = await mockAuthService.registerStep2(payload)
                await Promise.resolve()
                onSuccess?.(result)
            } catch (error) {
                onError?.(error)
            }
        }),
        isLoading: ref(false),
        isError: ref(false),
    })),
    useRegisterS3Query: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn(async (payload) => {
            try {
                const result = await mockAuthService.registerStep3(payload)
                await Promise.resolve()
                onSuccess?.(result)
            } catch (error) {
                onError?.(error)
            }
        }),
        isLoading: ref(false),
        isError: ref(false),
    })),
    useResendOTPQuery: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn(async (email) => {
            try {
                const result = await mockAuthService.resendOTP(email)
                await Promise.resolve()
                onSuccess?.(result)
            } catch (error) {
                onError?.(error)
            }
        }),
        isLoading: ref(false),
        isError: ref(false),
    })),
}))

// Mock the user store
const mockUserStore = {
    setAuth: vi.fn(),
    setUser: vi.fn(),
    updateUser: vi.fn(),
    logout: vi.fn(),
    initAuth: vi.fn(),
    user: null,
    accessToken: null,
    isLoggedIn: false,
}

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
}))

// Mock router
const mockRouter = {
    push: vi.fn(),
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}))

function mountSignup() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return mount(Signup, {
        global: {
            plugins: [
                [VueQueryPlugin, { queryClient }],
                i18n,
            ],
            stubs: {
                logo: true,
                closeButton: true,
                backButton: true,
                Popup: {
                    template: '<div class="popup-mock"><slot /></div>',
                },
                NuxtLink: { template: '<a><slot /></a>' },
                Recaptcha: {
                    template:
                        '<div class="recaptcha-mock"><button @click="$emit(\'verified\', \'mock-captcha-token\')">Verify Captcha</button></div>',
                    methods: {
                        run: vi.fn().mockResolvedValue(undefined),
                    },
                },
            },
        },
    })
}

describe('Signup Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Set default successful mock implementations for navigation tests
        mockAuthService.registerStep1.mockResolvedValue({
            data: { message: 'Registration successful' },
        })
        mockAuthService.registerStep2.mockResolvedValue({
            data: { recommendations: ['safan_test', 'safan_dev', 'safan_user'] },
        })
        mockAuthService.registerStep3.mockResolvedValue({
            data: {
                access_token: 'test-token',
                user: { id: 1, email: 'Safan@Developer.com', name: 'Safan Test' },
            },
        })
        mockAuthService.resendOTP.mockResolvedValue({
            data: { message: 'OTP has been resent successfully' },
        })
    })

    describe('Initial Rendering', () => {
        it('should render signup step 1 initially', () => {
            const wrapper = mountSignup()
            expect(wrapper.findComponent(createAccount).exists()).toBe(true)
            expect(wrapper.findComponent(verifyOtp).exists()).toBe(false)
            expect(wrapper.findComponent(FinalRegister).exists()).toBe(false)
        })

        it('should display create account title', () => {
            const wrapper = mountSignup()
            expect(wrapper.text()).toContain('Create your account')
        })

        it('should have name, email, and date of birth inputs', () => {
            const wrapper = mountSignup()
            const inputs = wrapper.findAll('input[type="text"], input[type="email"]')
            expect(inputs.length).toBeGreaterThanOrEqual(2)
        })

        it('should have month, day, and year selects', () => {
            const wrapper = mountSignup()
            const selects = wrapper.findAll('select')
            expect(selects.length).toBe(3)
        })

        it('should have Next button', () => {
            const wrapper = mountSignup()
            const nextButton = wrapper.findAll('button').find((btn) => btn.text() === 'Next')
            expect(nextButton).toBeTruthy()
        })

        it('should have reCAPTCHA component', () => {
            const wrapper = mountSignup()
            expect(wrapper.find('.recaptcha-mock').exists()).toBe(true)
        })
    })

    describe('Step 1: Create Account', () => {
        it('should allow entering name and email', async () => {
            const wrapper = mountSignup()
            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')

            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')

            expect((nameInput.element as HTMLInputElement).value).toBe('Safan Test')
            expect((emailInput.element as HTMLInputElement).value).toBe('Safan@Developer.com')
        })

        it('should allow selecting date of birth', async () => {
            const wrapper = mountSignup()
            const selects = wrapper.findAll('select')

            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')

            expect((selects[0]?.element as HTMLSelectElement).value).toBe('1')
            expect((selects[1]?.element as HTMLSelectElement).value).toBe('1')
            expect((selects[2]?.element as HTMLSelectElement).value).toBe('2005')
        })

        it('should show error if captcha not completed', async () => {
            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')

            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')

            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            expect(wrapper.text()).toContain('Please complete the reCAPTCHA')
        })

        it('should call registerStep1 mutation with correct data', async () => {
            const registerSpy = vi.fn().mockResolvedValue({
                data: { message: 'OTP sent successfully' },
            })
            mockAuthService.registerStep1 = registerSpy

            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')

            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')

            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()

            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            expect(registerSpy).toHaveBeenCalledWith({
                Name: 'Safan Test',
                Email: 'Safan@Developer.com',
                Birth_date: '2005-01-01',
                Captcha_token: 'mock-captcha-token',
            })
        })

        it('should move to step 2 on successful registration', async () => {
            mockAuthService.registerStep1.mockResolvedValue({
                data: { message: 'OTP sent successfully' },
            })

            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')

            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')

            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()

            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            expect(wrapper.findComponent(verifyOtp).exists()).toBe(true)
            expect(wrapper.findComponent(createAccount).exists()).toBe(false)
            expect(wrapper.findComponent(FinalRegister).exists()).toBe(false)
        })

        it('should show error message on registration failure', async () => {
            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')

            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')

            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()

            mockAuthService.registerStep1.mockRejectedValue({
                response: {
                    data: {
                        message: 'Email already exists safan created it before',
                    },
                },
            })

            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            expect(wrapper.text()).toContain('Email already exists safan created it before')
        })
    })

    describe('Step 2: Verify OTP', () => {
        beforeEach(async () => {
            mockAuthService.registerStep1.mockResolvedValue({
                data: { message: 'OTP sent successfully' },
            })
        })
        it('should allow entering OTP', async () => {
            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()
            const nextButton = wrapper.findAll('button').find((btn) => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')

            expect((otpInput.element as HTMLInputElement).value).toBe('123456')
        })

        it('should call registerStep2 mutation with OTP and go to step 3', async () => {
            const registerStep2Spy = vi.fn().mockResolvedValue({
                data: {
                    message: 'OTP verified',
                    recommendations: ['safan_test', 'safantest123'],
                },
            })
            mockAuthService.registerStep2 = registerStep2Spy

            const wrapper = mountSignup()

            // Debug: Check initial state
            console.log('Initial component:', wrapper.findComponent(createAccount).exists())

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')
            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')
            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()
            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            const form2 = wrapper.find('form')
            await form2.trigger('submit.prevent')
            await flushPromises()

            expect(registerStep2Spy).toHaveBeenCalledWith({
                token: '123456',
                Email: 'Safan@Developer.com',
            })

            expect(wrapper.findComponent(FinalRegister).exists()).toBe(true)
        })

        it('should show error on invalid OTP', async () => {
            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')
            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')
            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()
            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            mockAuthService.registerStep2.mockRejectedValue({
                response: {
                    data: {
                        message: 'Invalid OTP',
                    },
                },
            })

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('000000')
            const form2 = wrapper.find('form')
            await form2.trigger('submit.prevent')
            await flushPromises()

            expect(wrapper.text()).toContain('Invalid OTP')
        })

        it('should allow resending OTP', async () => {
            const resendOTPSpy = vi.fn().mockResolvedValue({
                data: { message: 'OTP resent successfully' },
            })
            mockAuthService.resendOTP = resendOTPSpy

            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')
            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')
            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()
            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            const resendButton = wrapper
                .findAll('button')
                .find((btn) => btn.text() === 'Resend code')
            await resendButton?.trigger('click')
            await flushPromises()

            expect(resendOTPSpy).toHaveBeenCalledWith('Safan@Developer.com')
            expect(wrapper.text()).toContain('OTP has been resent successfully')
        })

        it('should allow going back to step 1', async () => {
            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')
            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')
            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()
            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            expect(wrapper.findComponent(verifyOtp).exists()).toBe(true)

            wrapper.findComponent(verifyOtp).vm.$emit('close')
            await flushPromises()

            expect(wrapper.findComponent(createAccount).exists()).toBe(true)
            expect(wrapper.findComponent(verifyOtp).exists()).toBe(false)
        })
    })

    describe('Step 3: Final Registration', () => {
        beforeEach(async () => {
            mockAuthService.registerStep1.mockResolvedValue({
                data: { message: 'OTP sent successfully' },
            })
            mockAuthService.registerStep2.mockResolvedValue({
                data: {
                    message: 'OTP verified',
                    recommendations: ['Safan_Test', 'Safan123'],
                },
            })
        })

        it('should allow entering password', async () => {
            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')
            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')
            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()
            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            const form2 = wrapper.find('form')
            await form2.trigger('submit.prevent')
            await flushPromises()

            const passwordInput = wrapper.find('input[type="password"]')

            await passwordInput.setValue('Password123!')

            expect((passwordInput.element as HTMLInputElement).value).toBe('Password123!')
        })

        it('should call registerStep3 mutation with complete data', async () => {
            const registerStep3Spy = vi.fn().mockResolvedValue({
                data:{data: {
                    access_token: 'test-token',
                    user: { id: 1, email: 'Safan@Developer.com', name: 'Safan Test' },
                },
            }
            })
            mockAuthService.registerStep3 = registerStep3Spy

            const wrapper = mountSignup()

            const nameInput = wrapper.find('input[type="text"]')
            const emailInput = wrapper.find('input[type="email"]')
            const selects = wrapper.findAll('select')
            await nameInput.setValue('Safan Test')
            await emailInput.setValue('Safan@Developer.com')
            await selects[0]?.setValue('1')
            await selects[1]?.setValue('1')
            await selects[2]?.setValue('2005')
            const captchaButton = wrapper.find('.recaptcha-mock button')
            await captchaButton.trigger('click')
            await flushPromises()
            const form = wrapper.find('form')
            await form.trigger('submit.prevent')
            await flushPromises()

            const otpInput = wrapper.find('input[type="text"]')
            await otpInput.setValue('123456')
            const form2 = wrapper.find('form')
            await form2.trigger('submit.prevent')
            await flushPromises()

            const passwordInput = wrapper.find('input[type="password"]')
            await passwordInput.setValue('Password123!')

            const form3 = wrapper.find('form')
            await form3.trigger('submit.prevent')
            await flushPromises()

            expect(registerStep3Spy).toHaveBeenCalledWith({
                Email: 'Safan@Developer.com',
                Password: 'Password123!',
                Username: 'Safan_Test',
                Language: 'en',
            })
        })
    })
})

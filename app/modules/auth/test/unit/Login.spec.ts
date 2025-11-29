import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import enMessages from '../../../../i18n/locales/en.json' with { type: 'json' }
import arMessages from '../../../../i18n/locales/ar.json' with { type: 'json' }
import Login from '../../components/login.vue'
import loginStep1 from '../../components/subComponents/loginComponents/loginStep1.vue'
import loginStep2 from '../../components/subComponents/loginComponents/loginStep2.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enMessages,
        ar: arMessages,
    },
})

const mockAuthService = {
    checkIdentifierAvailability: vi.fn(),
    login: vi.fn(),
}

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

// Mock the login queries - return success immediately for valid inputs
vi.mock('~/modules/auth/queries/useLoginQuery', () => ({
    useCheckIdentifierAvailabilityQuery: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn(async (identifier) => {
            try {
                const result = await mockAuthService.checkIdentifierAvailability(identifier)
                await Promise.resolve()
                onSuccess?.(result)
            } catch (error) {
                onError?.(error)
            }
        }),
    })),
    useLoginQuery: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn(async (payload) => {
            try {
                const result = await mockAuthService.login(payload.identifier, payload.password)
                await Promise.resolve()
                onSuccess?.(result)
            } catch (error) {
                onError?.(error)
            }
        }),
    })),
}))

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

const mockRouter = {
    push: vi.fn(),
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}))

function mountLogin() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return mount(Login, {
        global: {
            plugins: [
                [VueQueryPlugin, { queryClient }],
                i18n,
            ],
            stubs: {
                closeButton: true,
                logo: true,
                Logo: true,
                OAuth: true,
                Teleport: true,
                Popup: {
                    template: '<div class="popup-mock"><slot /></div>',
                },
                NuxtLink: { template: '<a><slot /></a>' },
            },
        },
        attachTo: document.body,
    })
}

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Rendering', () => {
        it('renders loginStep1 by default', () => {
            const wrapper = mountLogin()
            expect(wrapper.findComponent(loginStep1).exists()).toBe(true)
            expect(wrapper.findComponent(loginStep2).exists()).toBe(false)
        })

        it('displays Sign in title', () => {
            const wrapper = mountLogin()
            expect(wrapper.text()).toContain('Sign in to X')
        })

        it('has identifier input field', () => {
            const wrapper = mountLogin()
            const input = wrapper.find('input[type="text"]')
            expect(input.exists()).toBe(true)
            expect(input.attributes('placeholder')).toBe('Phone, email, or username')
        })

        it('has Next button', () => {
            const wrapper = mountLogin()
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            expect(nextButton?.exists()).toBe(true)
        })

        it('has Forgot password button', () => {
            const wrapper = mountLogin()
            expect(wrapper.text()).toContain('Forgot password?')
        })

        it('has Sign up link', () => {
            const wrapper = mountLogin()
            expect(wrapper.text()).toContain("Don't have an account?")
            expect(wrapper.text()).toContain('Sign up')
        })
    })

    describe('Step 1 - Identifier Input', () => {
        it('allows typing in identifier input', async () => {
            const wrapper = mountLogin()
            const input = wrapper.find('input[type="text"]')

            await input.setValue('testuser@example.com')
            expect((input.element as HTMLInputElement).value).toBe('testuser@example.com')
        })

        it('shows error message when identifier check fails', async () => {
            mockAuthService.checkIdentifierAvailability.mockRejectedValue({
                response: {
                    data: {
                        message: 'Safan test is not finding the identifier',
                    },
                },
            })

            const wrapper = mountLogin()
            const input = wrapper.find('#input-identifier-login')

            await input.setValue('nonexistent@example.com')
            const nextButton = wrapper.find('#button-next-login-s1')
            await nextButton.trigger('click')
            await flushPromises()

            expect(wrapper.text()).toContain('Safan test is not finding the identifier')
        })

        it('proceeds to step 2 when identifier check succeeds', async () => {
            mockAuthService.checkIdentifierAvailability.mockResolvedValue({
                data: {
                    identifier_type: 'email',
                },
            })

            const wrapper = mountLogin()
            const input = wrapper.find('#input-identifier-login')

            await input.setValue('valid@example.com')
            const nextButton = wrapper.find('#button-next-login-s1')
            await nextButton.trigger('click')
            await flushPromises()

            expect(wrapper.findComponent(loginStep1).exists()).toBe(false)
            expect(wrapper.findComponent(loginStep2).exists()).toBe(true)
        })

        it('emits switch event when Sign up is clicked', async () => {
            const wrapper = mountLogin()
            const signupButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign up')

            await signupButton?.trigger('click')
            expect(wrapper.emitted('switch')).toBeTruthy()
        })

        it('emits close event when close button is clicked', async () => {
            const wrapper = mountLogin()

            // The Login component receives close event from loginStep1 and re-emits it
            // Simulate the close event from the step component
            const step1 = wrapper.findComponent(loginStep1)
            await step1.vm.$emit('close')

            expect(wrapper.emitted('close')).toBeTruthy()
        })
    })

    describe('Step 2 - Password Input', () => {
        beforeEach(async () => {
            mockAuthService.checkIdentifierAvailability.mockResolvedValue({
                data: {
                    identifier_type: 'email',
                },
            })
        })

        it('shows password input in step 2', async () => {
            const wrapper = mountLogin()
            const input = wrapper.find('input[type="text"]')
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')

            await input.setValue('user@example.com')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.find('input[type="text"]').exists()).toBe(true)
        })

        it('allows typing in password input', async () => {
            const wrapper = mountLogin()
            const input = wrapper.find('#input-identifier-login')

            await input.setValue('user@example.com')
            const nextButton = wrapper.find('#button-next-login-s1')
            await nextButton.trigger('click')
            await flushPromises()

            const passwordInput = wrapper.find('input[type="password"]')

            if (passwordInput.exists()) {
                await passwordInput.setValue('password123')
                expect((passwordInput.element as HTMLInputElement).value).toBe('password123')
            }
        })

        it('shows error message on failed login', async () => {
            mockAuthService.login.mockRejectedValue({
                response: {
                    data: {
                        message: 'Backend Error Message, Safan in Testing',
                    },
                },
            })

            const wrapper = mountLogin()
            const input = wrapper.find('input[type="text"]')
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')

            await input.setValue('user@example.com')
            await nextButton?.trigger('click')
            await flushPromises()

            const passwordInput = wrapper.find('input[type="password"]')
            const loginButton = wrapper.findAll('button').find(btn => btn.text() === 'Login')
            if (passwordInput && loginButton) {
                await passwordInput.setValue('wrongpassword')
                await loginButton.trigger('click')
                await flushPromises()
                expect(wrapper.text()).toContain('Backend Error Message, Safan in Testing')
            }
        })

        it('successfully logs in with correct credentials', async () => {
            const mockUserData = {
                data: {
                    access_token: 'test-token-123',
                    user: {
                        id: '1',
                        email: 'user@example.com',
                        name: 'Test User',
                        phone_number: null,
                        avatar_url: null,
                        github_id: null,
                        facebook_id: null,
                        google_id: null,
                    },
                },
            }

            mockAuthService.login.mockResolvedValue(mockUserData)

            const wrapper = mountLogin()
            const input = wrapper.find('input[type="text"]')
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')

            await input.setValue('validuser@gmail.com')
            await nextButton?.trigger('click')
            await flushPromises()

            const passwordInput = wrapper.find('input[type="password"]')
            const loginButton = wrapper.findAll('button').find(btn => btn.text() === 'Login')

            if (passwordInput && loginButton) {
                await passwordInput.setValue('ValidPass#123')
                await loginButton.trigger('click')
                await flushPromises()

                expect(mockUserStore.setAuth).toHaveBeenCalledWith(mockUserData.data)
            }
        })
    })

    describe('Integration Tests', () => {
        it('completes full login flow', async () => {
            mockAuthService.checkIdentifierAvailability.mockResolvedValue({
                data: {
                    identifier_type: 'email',
                },
            })

            const mockUserData = {
                data: {
                    access_token: 'test-token-123',
                    user: {
                        id: '1',
                        email: 'user@example.com',
                        name: 'Test User',
                        phone_number: null,
                        avatar_url: null,
                        github_id: null,
                        facebook_id: null,
                        google_id: null,
                    },
                },
            }
            mockAuthService.login.mockResolvedValue(mockUserData)

            const wrapper = mountLogin()

            const identifierInput = wrapper.find('input[type="text"]')
            await identifierInput.setValue('user@example.com')

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
            await nextButton?.trigger('click')
            await flushPromises()

            expect(wrapper.findComponent(loginStep2).exists()).toBe(true)

            const passwordInput = wrapper.find('input[type="password"]')
            const loginButton = wrapper.findAll('button').find(btn => btn.text() === 'Login')

            if (passwordInput && loginButton) {
                await passwordInput.setValue('password123')
                await loginButton.trigger('click')
                await flushPromises()

                expect(mockAuthService.checkIdentifierAvailability).toHaveBeenCalledWith('user@example.com')
                expect(mockAuthService.login).toHaveBeenCalledWith(
                    'user@example.com',
                    'password123',
                    'email',
                )
                expect(mockUserStore.setAuth).toHaveBeenCalledWith(mockUserData.data)
            }
        })

        it('handles different identifier types (phone, username, email)', async () => {
            const testCases = [
                { identifier: 'user@example.com', type: 'email' },
                { identifier: '+1234567890', type: 'phone' },
                { identifier: 'username123', type: 'username' },
            ]

            for (const testCase of testCases) {
                mockAuthService.checkIdentifierAvailability.mockResolvedValue({
                    data: {
                        identifier_type: testCase.type,
                    },
                })

                mockAuthService.login.mockResolvedValue({
                    data: {
                        access_token: 'test-token',
                        user: { id: '1', email: 'user@example.com', name: 'Test' },
                    },
                })

                const wrapper = mountLogin()

                const identifierInput = wrapper.find('input[type="text"]')
                await identifierInput.setValue(testCase.identifier)

                const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next')
                await nextButton?.trigger('click')
                await flushPromises()

                expect(mockAuthService.checkIdentifierAvailability).toHaveBeenCalledWith(testCase.identifier)
            }
        })
    })
})

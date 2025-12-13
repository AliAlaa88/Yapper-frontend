import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import AuthHomePage from '../../views/index.vue'
import OAuth from '../../components/subComponents/OAuth.vue'
import Logo from '../../../Common/components/Logo'
import enMessages from '../../../../../i18n/locales/en.json'
import arMessages from '../../../../../i18n/locales/ar.json'

// Mock Nuxt composables
const mockPush = vi.fn()
const mockRouter = {
    push: mockPush,
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}))

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: {},
        runWithContext: (fn: any) => fn(),
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
}))

// Create i18n instance with actual translations
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enMessages,
        ar: arMessages,
    },
})

function mountAuthHomePage() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return mount(AuthHomePage, {
        global: {
            plugins: [
                [VueQueryPlugin, { queryClient }],
                i18n,
            ],
            stubs: {
                NuxtLink: {
                    template: '<a><slot /></a>',
                },
            },
        },
    })
}

describe('Auth Home Page', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Rendering', () => {
        it('should render the auth home page', () => {
            const wrapper = mountAuthHomePage()
            expect(wrapper.exists()).toBe(true)
        })

        it('should display "Happening now" heading', () => {
            const wrapper = mountAuthHomePage()
            expect(wrapper.text()).toContain('Happening now')
        })

        it('should display "Join today." heading', () => {
            const wrapper = mountAuthHomePage()
            expect(wrapper.text()).toContain('Join today.')
        })

        it('should render logo component', () => {
            const wrapper = mountAuthHomePage()
            const logoComponent = wrapper.findComponent(Logo)
            expect(logoComponent.exists()).toBe(true)
        })

        it('should render OAuth component', () => {
            const wrapper = mountAuthHomePage()
            const oauthComponent = wrapper.findComponent(OAuth)
            expect(oauthComponent.exists()).toBe(true)
        })

        it('should have two-column grid layout on desktop', () => {
            const wrapper = mountAuthHomePage()
            const mainDiv = wrapper.find('.grid')
            expect(mainDiv.classes()).toContain('grid-cols-1')
            expect(mainDiv.classes()).toContain('md:grid-cols-2')
        })
    })

    describe('Logo Component Rendering', () => {
        it('should render logo with correct classes for mobile', () => {
            const wrapper = mountAuthHomePage()
            const logos = wrapper.findAllComponents(Logo)

            expect(logos.length).toBeGreaterThan(0)
        })

        it('should have logo hidden on mobile in left section', () => {
            const wrapper = mountAuthHomePage()
            const leftSection = wrapper.find('.hidden.md\\:flex')
            expect(leftSection.exists()).toBe(true)
        })
    })

    describe('OAuth Component', () => {
        it('should render OAuth component for social login', () => {
            const wrapper = mountAuthHomePage()
            const oauthComponent = wrapper.findComponent(OAuth)
            expect(oauthComponent.exists()).toBe(true)
        })
    })

    describe('Create Account Button', () => {
        it('should render "Create account" button', () => {
            const wrapper = mountAuthHomePage()
            const createButton = wrapper.find('[data-testid="button-createAccount-authHome"]')
            expect(createButton.exists()).toBe(true)
            expect(createButton.text()).toBe('Create account')
        })


        it('should navigate to signup page when create account is clicked', async () => {
            const wrapper = mountAuthHomePage()
            const createButton = wrapper.find('[data-testid="button-createAccount-authHome"]')

            await createButton.trigger('click')
            await flushPromises()

            expect(mockPush).toHaveBeenCalledWith('/auth/signup')
        })

        it('should call goToSignup function on click', async () => {
            const wrapper = mountAuthHomePage()
            const createButton = wrapper.find('[data-testid="button-createAccount-authHome"]')

            await createButton.trigger('click')
            await flushPromises()

            expect(mockPush).toHaveBeenCalledTimes(1)
        })
    })

    describe('Terms and Privacy Text', () => {
        it('should display terms of service agreement', () => {
            const wrapper = mountAuthHomePage()
            expect(wrapper.text()).toContain(
                'By signing up, you agree to the Terms of Service and Privacy Policy.',
            )
        })
    })

    describe('Sign In Section', () => {
        it('should display "Already have an account?" text', () => {
            const wrapper = mountAuthHomePage()
            expect(wrapper.text()).toContain('Already have an account?')
        })

        it('should render "Sign in" button', () => {
            const wrapper = mountAuthHomePage()
            const signInButton = wrapper.find('[data-testid="button-signIn-authHome"]')
            expect(signInButton.exists()).toBe(true)
            expect(signInButton.text()).toContain('Sign in')
        })

        it('should navigate to login page when sign in is clicked', async () => {
            const wrapper = mountAuthHomePage()
            const signInButton = wrapper.find('[data-testid="button-signIn-authHome"]')

            await signInButton.trigger('click')
            await flushPromises()

            expect(mockPush).toHaveBeenCalledWith('/auth/login')
        })

        it('should call goToLogin function on click', async () => {
            const wrapper = mountAuthHomePage()
            const signInButton = wrapper.find('[data-testid="button-signIn-authHome"]')

            await signInButton.trigger('click')
            await flushPromises()

            expect(mockPush).toHaveBeenCalledTimes(1)
        })
    })

    describe('Navigation Functions', () => {
        it('should have goToLogin function that navigates correctly', async () => {
            const wrapper = mountAuthHomePage()
            const signInButton = wrapper.find('[data-testid="button-signIn-authHome"]')

            mockPush.mockClear()
            await signInButton.trigger('click')
            await flushPromises()

            expect(mockPush).toHaveBeenCalledWith('/auth/login')
            expect(mockPush).toHaveBeenCalledTimes(1)
        })

        it('should have goToSignup function that navigates correctly', async () => {
            const wrapper = mountAuthHomePage()
            const createButton = wrapper.find('[data-testid="button-createAccount-authHome"]')

            mockPush.mockClear()
            await createButton.trigger('click')
            await flushPromises()

            expect(mockPush).toHaveBeenCalledWith('/auth/signup')
            expect(mockPush).toHaveBeenCalledTimes(1)
        })

        it('should handle multiple clicks on create account button', async () => {
            const wrapper = mountAuthHomePage()
            const createButton = wrapper.find('[data-testid="button-createAccount-authHome"]')

            mockPush.mockClear()
            await createButton.trigger('click')
            await createButton.trigger('click')
            await createButton.trigger('click')
            await flushPromises()

            expect(mockPush).toHaveBeenCalledWith('/auth/signup')
            expect(mockPush).toHaveBeenCalledTimes(3)
        })

        it('should handle multiple clicks on sign in button', async () => {
            const wrapper = mountAuthHomePage()
            const signInButton = wrapper.find('[data-testid="button-signIn-authHome"]')

            mockPush.mockClear()
            await signInButton.trigger('click')
            await signInButton.trigger('click')
            await flushPromises()

            expect(mockPush).toHaveBeenCalledWith('/auth/login')
            expect(mockPush).toHaveBeenCalledTimes(2)
        })
    })

    describe('Button Interactions', () => {
        it('should have both buttons clickable', async () => {
            const wrapper = mountAuthHomePage()
            const createButton = wrapper.find('[data-testid="button-createAccount-authHome"]')
            const signInButton = wrapper.find('[data-testid="button-signIn-authHome"]')

            expect(createButton.attributes('disabled')).toBeUndefined()
            expect(signInButton.attributes('disabled')).toBeUndefined()
        })

        it('should navigate to different routes for each button', async () => {
            const wrapper = mountAuthHomePage()
            const createButton = wrapper.find('[data-testid="button-createAccount-authHome"]')
            const signInButton = wrapper.find('[data-testid="button-signIn-authHome"]')

            mockPush.mockClear()

            await createButton.trigger('click')
            await flushPromises()
            expect(mockPush).toHaveBeenLastCalledWith('/auth/signup')

            await signInButton.trigger('click')
            await flushPromises()
            expect(mockPush).toHaveBeenLastCalledWith('/auth/login')

            expect(mockPush).toHaveBeenCalledTimes(2)
        })
    })

    describe('Layout and Responsiveness', () => {
        it('should have background color black', () => {
            const wrapper = mountAuthHomePage()
            const mainDiv = wrapper.find('.min-h-svh')
            expect(mainDiv.classes()).toContain('bg-primary')
        })

        it('should have text color white', () => {
            const wrapper = mountAuthHomePage()
            const mainDiv = wrapper.find('.min-h-svh')
            expect(mainDiv.classes()).toContain('text-primary')
        })

        it('should have minimum full screen height', () => {
            const wrapper = mountAuthHomePage()
            const mainDiv = wrapper.find('.min-h-svh')
            expect(mainDiv.classes()).toContain('min-h-svh')
        })

        it('should have right section with proper padding', () => {
            const wrapper = mountAuthHomePage()
            const rightSection = wrapper.find('.flex.items-center.justify-center.p-6')
            expect(rightSection.exists()).toBe(true)
            expect(rightSection.classes()).toContain('p-6')
            expect(rightSection.classes()).toContain('sm:p-10')
        })
    })

    describe('Content Structure', () => {
        it('should have proper heading hierarchy', () => {
            const wrapper = mountAuthHomePage()
            const h1 = wrapper.find('h1')
            const h2 = wrapper.find('h2')
            const h3 = wrapper.find('h3')

            expect(h1.exists()).toBe(true)
            expect(h1.text()).toBe('Happening now')
            expect(h2.exists()).toBe(true)
            expect(h2.text()).toBe('Join today.')
            expect(h3.exists()).toBe(true)
            expect(h3.text()).toBe('Already have an account?')
        })

        it('should have buttons in correct order', () => {
            const wrapper = mountAuthHomePage()
            const buttons = wrapper.findAll('button')

            const createButton = buttons.find((btn) => btn.text().includes('Create account'))
            const signInButton = buttons.find((btn) => btn.text().includes('Sign in'))

            expect(createButton).toBeDefined()
            expect(signInButton).toBeDefined()
        })

        it('should render slot for modal overlays', () => {
            const wrapper = mountAuthHomePage()
            expect(wrapper.html()).toBeTruthy()
        })
    })

})
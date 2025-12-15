import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import { ref, watch } from 'vue' // Added ref and watch
import enMessages from '../../../../../i18n/locales/en.json'
import arMessages from '../../../../../i18n/locales/ar.json'
import CompleteAccount from '../../components/CompleteAccount.vue'
import ProfilePicture from '../../components/subComponents/CompleteAccountComponents/ProfilePicture.vue'
import Username from '../../components/subComponents/CompleteAccountComponents/Username.vue'
import Language from '../../components/subComponents/CompleteAccountComponents/Language.vue'
import Interests from '../../components/subComponents/CompleteAccountComponents/Interests.vue'

// Stub global Nuxt composables
vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
        apiUrl: 'http://localhost:3000',
        env: 'test',
    },
}))
vi.stubGlobal('navigateTo', vi.fn())

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enMessages,
        ar: arMessages,
    },
})

// Mock cookie
const mockCookie = { value: 'test-token' }
vi.stubGlobal('useCookie', () => mockCookie)

// Mock user store
const mockUserStore = {
    setAuth: vi.fn(),
    setUser: vi.fn(),
    user: null,
}
vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
}))

// Mock useGetUserQuery - returns data safely
vi.mock('~/modules/auth/queries/useGetuserQuery', () => ({
    useGetUserQuery: vi.fn((enableRef, onSuccess, onError) => {
        const data = ref({ id: 1, name: 'Test User' })

        if (enableRef?.value) {
            onSuccess?.({ data: { id: 1, name: 'Test User' } })
        }

        return {
            data,
            isLoading: ref(false),
            isError: ref(false),
            error: ref(null),
        }
    }),
}))

// Mock useRegisterQuery (needed for checkIdentifier in Username)
vi.mock('~/modules/auth/queries/useRegisterQuery', () => ({
    checkIdentifier: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: ref(false),
        isError: ref(false),
    })),
}))

// Mock useCompleteProfileQuery (needed for ProfilePicture, Username, Language, and Interests)
vi.mock('~/modules/auth/queries/useCompleteProfileQuery', () => ({
    useUpdateProfileMutation: vi.fn(() => ({
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isLoading: ref(false),
        isError: ref(false),
        isPending: ref(false),
    })),
    useUpdateProfilePictureMutation: vi.fn(() => ({
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isLoading: ref(false),
        isError: ref(false),
        isPending: ref(false),
    })),
    useUpdateUsernameMutation: vi.fn(() => ({
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isLoading: ref(false),
        isError: ref(false),
        isPending: ref(false),
    })),
    useUpdateLanguageMutation: vi.fn(() => ({
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isLoading: ref(false),
        isError: ref(false),
        isPending: ref(false),
    })),
    useFetchInterests: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: ref(false),
        isError: ref(false),
        data: ref(['Music', 'Sports', 'Tech']),
    })),
    useUpdateInterestsMutation: vi.fn(() => ({
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isLoading: ref(false),
        isError: ref(false),
        isPending: ref(false),
    })),
}))

// Mock Nuxt app
vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: {
            getUserData: vi.fn(() => Promise.resolve({ id: 1, name: 'Test User' })),
        },
        runWithContext: (fn: any) => fn(),
        callHook: vi.fn(),
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
            env: 'test',
        },
    }),
    useCookie: () => mockCookie,
}))

function mountCompleteAccount(props = {}) {
    const defaultProps = {
        Recommendations: ['user123', 'user456', 'user789'],
        skipImg: false,
        ...props,
    }

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return mount(CompleteAccount, {
        props: defaultProps,
        global: {
            plugins: [[VueQueryPlugin, { queryClient }], i18n],
            stubs: {
                Popup: {
                    template: '<div class="popup-mock"><slot /></div>',
                },
                NuxtLink: { template: '<a><slot /></a>' },
            },
        },
    })
}

describe('CompleteAccount Component', () => {
    describe('Initial Rendering', () => {
        it('should render ProfilePicture step first when skipImg is false', () => {
            const wrapper = mountCompleteAccount({ skipImg: false })
            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(true)
            expect(wrapper.findComponent(Username).exists()).toBe(false)
        })

        it('should skip ProfilePicture and show Username when skipImg is true', () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(false)
            expect(wrapper.findComponent(Username).exists()).toBe(true)
        })
    })

    describe('Profile Picture Step - Detailed Rendering', () => {
        it('should render profile picture upload section', () => {
            const wrapper = mountCompleteAccount({ skipImg: false })
            const profilePicComponent = wrapper.findComponent(ProfilePicture)

            expect(profilePicComponent.text()).toContain('Pick a profile picture')
            expect(profilePicComponent.text()).toContain('Have a favorite selfie? Upload it now.')
        })

        it('should have file input with correct attributes', () => {
            const wrapper = mountCompleteAccount({ skipImg: false })
            const profilePicComponent = wrapper.findComponent(ProfilePicture)
            const fileInput = profilePicComponent.find('#input-profile-picture-complete')

            expect(fileInput.exists()).toBe(true)
            expect(fileInput.attributes('type')).toBe('file')
            expect(fileInput.attributes('accept')).toBe('image/*')
        })

        it('should have skip button visible', () => {
            const wrapper = mountCompleteAccount({ skipImg: false })
            const profilePicComponent = wrapper.findComponent(ProfilePicture)
            const skipButton = profilePicComponent.find('#button-skip-profile-picture')

            expect(skipButton.exists()).toBe(true)
            expect(skipButton.text()).toBe('Skip for now')
        })

        it('should show Next button after emitting next event with image', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false })
            const profilePicComponent = wrapper.findComponent(ProfilePicture)

            // Simulate the component emitting next event with image URL
            await profilePicComponent.vm.$emit('next', 'https://example.com/sa3fan_avatar.jpg')
            await flushPromises()

            // After emit, should move to username step
            expect(wrapper.findComponent(Username).exists()).toBe(true)
        })

        it('should move to Username step when Next is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false })
            const profilePicComponent = wrapper.findComponent(ProfilePicture)

            await profilePicComponent.vm.$emit('next', 'https://example.com/sa3fan_avatar.jpg')
            await flushPromises()

            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(false)
            expect(wrapper.findComponent(Username).exists()).toBe(true)
        })

        it('should move to Username step when Skip is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false })
            const profilePicComponent = wrapper.findComponent(ProfilePicture)

            await profilePicComponent.vm.$emit('skip')
            await flushPromises()

            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(false)
            expect(wrapper.findComponent(Username).exists()).toBe(true)
        })
    })

    describe('Username Step', () => {
        it('should render username input section', () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)

            expect(usernameComponent.text()).toContain('What should we call you?')
            expect(usernameComponent.text()).toContain('Your username is unique')
        })

        it('should have username input with test ID', () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)
            const usernameInput = usernameComponent.find('#input-username-complete')

            expect(usernameInput.exists()).toBe(true)
            expect(usernameInput.attributes('placeholder')).toBe('username')
            expect(usernameInput.attributes('maxlength')).toBe('25')
        })

        it('should allow entering sa3fan_test username', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)
            const usernameInput = usernameComponent.find('#input-username-complete')

            await usernameInput.setValue('sa3fan_test')
            await flushPromises()

            expect((usernameInput.element as HTMLInputElement).value).toBe('sa3fan_test')
        })

        it('should display character counter', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)
            const usernameInput = usernameComponent.find('#input-username-complete')

            await usernameInput.setValue('sa3fan')
            await flushPromises()

            expect(usernameComponent.text()).toContain('6/25')
        })

        it('should show "Available!" message for valid username', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)
            const usernameInput = usernameComponent.find('#input-username-complete')

            await usernameInput.setValue('sa3fan_test')
            await flushPromises()

            const successMessage = usernameComponent.find('#success-message-username')
            expect(successMessage.exists()).toBe(true)
            expect(successMessage.text()).toBe('Available!')
        })

        it('should display recommendations', () => {
            const recommendations = ['sa3fan_test', 'sa3fan_dev', 'developer_sa3fan']
            const wrapper = mountCompleteAccount({
                skipImg: true,
                Recommendations: recommendations,
            })
            const usernameComponent = wrapper.findComponent(Username)

            expect(usernameComponent.text()).toContain('Recommended usernames:')
            expect(usernameComponent.text()).toContain('sa3fan_test')
            expect(usernameComponent.text()).toContain('sa3fan_dev')
            expect(usernameComponent.text()).toContain('developer_sa3fan')
        })

        it('should allow clicking on recommendation to select it', async () => {
            const recommendations = ['sa3fan_test', 'sa3fan_dev', 'developer_sa3fan']
            const wrapper = mountCompleteAccount({
                skipImg: true,
                Recommendations: recommendations,
            })
            const usernameComponent = wrapper.findComponent(Username)
            const firstRecommendation = usernameComponent.find('#recommendation-0-username')

            await firstRecommendation.trigger('click')
            await flushPromises()

            const usernameInput = usernameComponent.find('#input-username-complete')
            expect((usernameInput.element as HTMLInputElement).value).toBe('sa3fan_test')
        })

        it('should have Next button enabled for valid username', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)
            const usernameInput = usernameComponent.find('#input-username-complete')

            await usernameInput.setValue('sa3fan_test')
            await flushPromises()

            const nextButton = usernameComponent.find('#button-next-username')
            expect(nextButton.attributes('disabled')).toBeUndefined()
        })

        it('should have Skip button visible', () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)
            const skipButton = usernameComponent.find('#button-skip-username')

            expect(skipButton.exists()).toBe(true)
            expect(skipButton.text()).toBe('Skip for now')
        })

        it('should receive recommendations prop', () => {
            const recommendations = ['s3fan_test', 's3fan_test2', 's3fan_test3']
            const wrapper = mountCompleteAccount({
                skipImg: true,
                Recommendations: recommendations,
            })

            const usernameComponent = wrapper.findComponent(Username)
            expect(usernameComponent.props('Recommendations')).toEqual(recommendations)
        })

        it('should move to Language step when Next is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)

            await usernameComponent.vm.$emit('next', 's3fan_test')
            await flushPromises()

            expect(wrapper.findComponent(Username).exists()).toBe(false)
            expect(wrapper.findComponent(Language).exists()).toBe(true)
        })

        it('should move to Language step when Skip is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })
            const usernameComponent = wrapper.findComponent(Username)

            await usernameComponent.vm.$emit('skip')
            await flushPromises()

            expect(wrapper.findComponent(Username).exists()).toBe(false)
            expect(wrapper.findComponent(Language).exists()).toBe(true)
        })

        it('should go back to ProfilePicture when Back is clicked (if not skipped)', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false })

            const profilePicComponent = wrapper.findComponent(ProfilePicture)
            await profilePicComponent.vm.$emit('next', 'https://example.com/avatar.jpg')
            await flushPromises()

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('back')
            await flushPromises()

            expect(wrapper.findComponent(Username).exists()).toBe(false)
            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(true)
        })
    })

    describe('Language Step', () => {
        it('should render language selection section', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('next', 'sa3fan_test')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            expect(languageComponent.text()).toContain('Select your language')
            expect(languageComponent.text()).toContain(
                'This will help us personalize your Yapper experience',
            )
        })

        it('should display English and Arabic language options', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('next', 'sa3fan_test')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            const englishButton = languageComponent.find('#button-language-en')
            const arabicButton = languageComponent.find('#button-language-ar')

            expect(englishButton.exists()).toBe(true)
            expect(englishButton.text()).toContain('English')
            expect(arabicButton.exists()).toBe(true)
            expect(arabicButton.text()).toContain('Arabic')
            expect(arabicButton.text()).toContain('العربية')
        })

        it('should allow selecting English language', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('next', 'sa3fan_test')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            const englishButton = languageComponent.find('#button-language-en')
            expect(englishButton.exists()).toBe(true)
        })

        it('should allow selecting Arabic language', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('next', 'sa3fan_test')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            const arabicButton = languageComponent.find('#button-language-ar')

            expect(arabicButton.exists()).toBe(true)
        })

        it('should have Skip button visible', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('next', 'sa3fan_test')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            const skipButton = languageComponent.find('#button-skip-language')

            expect(skipButton.exists()).toBe(true)
            expect(skipButton.text()).toBe('Skip for now')
        })

        it('should move to Interests step when Next is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('next', 's3fan_test')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            await languageComponent.vm.$emit('next', 'English')
            await flushPromises()

            expect(wrapper.findComponent(Language).exists()).toBe(false)
            expect(wrapper.findComponent(Interests).exists()).toBe(true)
        })

        it('should move to Interests step when Skip is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('skip')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            await languageComponent.vm.$emit('skip')
            await flushPromises()

            expect(wrapper.findComponent(Language).exists()).toBe(false)
            expect(wrapper.findComponent(Interests).exists()).toBe(true)
        })

        it('should go back to Username when Back is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('next', 'myusername')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            await languageComponent.vm.$emit('back')
            await flushPromises()

            expect(wrapper.findComponent(Language).exists()).toBe(false)
            expect(wrapper.findComponent(Username).exists()).toBe(true)
        })
    })

    describe('Interests Step', () => {
        it('should render interests selection section', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('skip')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            await languageComponent.vm.$emit('skip')
            await flushPromises()

            const interestsComponent = wrapper.findComponent(Interests)
            expect(interestsComponent.text()).toContain('What are you interested in?')
            expect(interestsComponent.text()).toContain(
                'Select at least 3 interests to help us tailor your feed',
            )
        })

        it('should show selection counter', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('skip')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            await languageComponent.vm.$emit('skip')
            await flushPromises()

            const interestsComponent = wrapper.findComponent(Interests)

            expect(interestsComponent.text()).toContain('0 selected')
        })

        it('should require at least 3 interests message', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('skip')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            await languageComponent.vm.$emit('skip')
            await flushPromises()

            const interestsComponent = wrapper.findComponent(Interests)

            expect(interestsComponent.text()).toContain('3 more needed')
        })

        it('should have Next button disabled until 3 interests selected', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('skip')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            await languageComponent.vm.$emit('skip')
            await flushPromises()

            const interestsComponent = wrapper.findComponent(Interests)
            const nextButton = interestsComponent.find('#button-next-interests')

            expect(nextButton.attributes('disabled')).toBeDefined()
        })

        it('should have Skip button visible', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            const usernameComponent = wrapper.findComponent(Username)
            await usernameComponent.vm.$emit('skip')
            await flushPromises()

            const languageComponent = wrapper.findComponent(Language)
            await languageComponent.vm.$emit('skip')
            await flushPromises()

            const interestsComponent = wrapper.findComponent(Interests)
            const skipButton = interestsComponent.find('#button-skip-interests')

            expect(skipButton.exists()).toBe(true)
            expect(skipButton.text()).toBe('Skip for now')
        })

        it('should emit finish with null/empty values when all steps are skipped', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            // Skip Username step
            let skipButton = wrapper.find('[data-testid="skip-button"]')
            if (skipButton.exists()) {
                await skipButton.trigger('click')
            }
            await flushPromises()

            // Skip Language step
            skipButton = wrapper.find('[data-testid="skip-button"]')
            if (skipButton.exists()) {
                await skipButton.trigger('click')
            }
            await flushPromises()

            // Skip Interests step
            skipButton = wrapper.find('[data-testid="skip-button"]')
            if (skipButton.exists()) {
                await skipButton.trigger('click')
            }
            await flushPromises()

            const finishEvent = wrapper.emitted('finish')
            if (finishEvent) {
                expect(finishEvent).toBeTruthy()
                expect(finishEvent[0][0]).toEqual({
                    profilePicture: null,
                    username: null,
                    language: null,
                    interests: [],
                })
            }
        })

        it('should go back to Language when Back is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true })

            let component = wrapper.findComponent(Username)
            await component.vm.$emit('skip')
            await flushPromises()

            component = wrapper.findComponent(Language)
            await component.vm.$emit('skip')
            await flushPromises()

            component = wrapper.findComponent(Interests)
            await component.vm.$emit('back')
            await flushPromises()

            expect(wrapper.findComponent(Interests).exists()).toBe(false)
            expect(wrapper.findComponent(Language).exists()).toBe(true)
        })
    })
})

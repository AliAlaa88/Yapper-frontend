import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import enMessages from '../../../../i18n/locales/en.json' with { type: 'json' }
import arMessages from '../../../../i18n/locales/ar.json' with { type: 'json' }

import SuccessPage from '~/modules/auth/components/success.vue'
import { watch } from 'vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enMessages,
        ar: arMessages,
    },
})

const mockAuthService = {
    getUserData: vi.fn(),
}

const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
}

const mockUserStore = {
    setAuth: vi.fn(),
    logout: vi.fn(),
    user: null,
    accessToken: null,
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}))

// Mock cookie storage
const mockCookie = {
    value: null as string | null,
}

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
    useRouter: () => mockRouter,
    useCookie: () => mockCookie,
}))

vi.stubGlobal('useRouter', () => mockRouter)

Object.defineProperty(globalThis.process, 'client', {
    value: true,
    writable: true,
    configurable: true,
})

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
}))

// Mock OAuth and user queries - return success immediately
vi.mock('~/modules/auth/queries/useOAuthQuery', () => ({
    useExchangeTokenQuery: vi.fn((onSuccess, onError) => ({
        mutate: vi.fn(async (payload) => {
            try {
                const token = payload.exchange_token
                if (token) {
                    await Promise.resolve()
                    onSuccess?.({ access_token: token })
                } else {
                    throw new Error('No exchange token provided')
                }
            } catch (error) {
                onError?.(error)
            }
        }),
    })),
}))

vi.mock('~/modules/auth/queries/useGetuserQuery', () => ({
    useGetUserQuery: vi.fn((enableRef, onSuccess, onError) => {
        // Watch for enableRef to become true, then call getUserData and onSuccess
        watch(() => enableRef.value, async (enabled) => {
            if (enabled) {
                try {
                    const userData = await mockAuthService.getUserData()
                    await Promise.resolve()
                    onSuccess?.(userData)
                } catch (error) {
                    onError?.(error)
                }
            }
        }, { immediate: true })
        
        return {
            data: { value: { username: 'testuser', email: 'test@example.com' } },
            isLoading: false,
            isError: false,
        }
    }),
}))

const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

delete (window as any).location
window.location = {
    search: '',
} as any

function mountSuccessPage(token: string = '') {
    window.location.search = token ? `?exchange_token=${token}` : ''

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return mount(SuccessPage, {
        global: {
            plugins: [
                [VueQueryPlugin, { queryClient }],
                i18n,
            ],
            mocks: {
                useRouter: () => mockRouter,
                useNuxtApp: () => ({
                    $authService: mockAuthService,
                }),
                useRuntimeConfig: () => ({
                    public: {
                        apiUrl: 'http://localhost:3000',
                    },
                }),
            },
            stubs: {
                NuxtLink: { template: '<a><slot /></a>' },
            },
        },
    })
}

describe('OAuth Existing Account Flow - Success Page', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.clear()
        mockUserStore.user = null
        mockUserStore.accessToken = null
        window.location.search = ''
    })

    afterEach(() => {
        vi.clearAllMocks()
        localStorageMock.clear()
    })

    describe('Initial Rendering', () => {
        it('should render loading state initially', () => {
            const wrapper = mountSuccessPage('test-token-123')
            expect(wrapper.text()).toContain('Loading...')
            expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
        })

    })

    describe('Token Handling', () => {
        it('should handle special characters in token', async () => {
            const specialToken = 'token-with-special-chars_123.456!@#'
            const mockUserData = {
                data: {
                    id: '777',
                    name: 'Sa3fan Test',
                    email: 'Sa3fan@Developer.com',
                    username: 'sa3fan_test',
                },
            }

            mockAuthService.getUserData.mockResolvedValue(mockUserData)

            mountSuccessPage(specialToken)
            await flushPromises()

            expect(mockUserStore.accessToken).toBe(specialToken)
        })
        it('should extract token from URL parameters', async () => {
            const token = 'oauth-access-token-123'
            mountSuccessPage(token)
            await flushPromises()
            
            expect(mockUserStore.accessToken).toBe(token)
        })

    })

    describe('User Data Fetching', () => {
        it('should call getUserData when token is present', async () => {
            const token = 'valid-oauth-token'
            const mockUserData = {
                data: {
                    id: '123',
                    name: 'Sa3fan Test',
                    email: 'Sa3fan@Developer.com',
                    username: 'sa3fan_test',
                    avatar_url: 'https://example.com/sa3fan.jpg',
                    google_id: 'google-123',
                },
            }

            mockAuthService.getUserData.mockResolvedValue(mockUserData)

            mountSuccessPage(token)
            await flushPromises()

            expect(mockAuthService.getUserData).toHaveBeenCalled()
        })

        it('should set auth data when user data fetch succeeds', async () => {
            const token = 'valid-oauth-token-abc'
            const mockUserData = {
                data: {
                    id: '456',
                    name: 'Sa3fan Test',
                    email: 'Sa3fan@Developer.com',
                    username: 'sa3fan_test',
                    avatar_url: 'https://example.com/sa3fan.jpg',
                    facebook_id: 'facebook-456',
                },
            }

            mockAuthService.getUserData.mockResolvedValue(mockUserData)

            mountSuccessPage(token)
            await flushPromises()

            expect(mockUserStore.setAuth).toHaveBeenCalledWith({
                access_token: token,
                user: mockUserData.data,
            })
        })

    })

    describe('Error Handling', () => {
        it('should logout user when getUserData fails', async () => {
            const token = 'invalid-token'
            
            mockAuthService.getUserData.mockRejectedValue({
                response: {
                    status: 401,
                    data: {
                        message: 'Invalid token',
                    },
                },
            })

            mountSuccessPage(token)
            await flushPromises()

            expect(mockUserStore.logout).toHaveBeenCalled()
        })

    })


    describe('Loading State Management', () => {
        it('should start with loading state showing', () => {
            const wrapper = mountSuccessPage('test-token')
            expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
            expect(wrapper.text()).toContain('Loading...')
        })

        it('should show loading during authentication', async () => {
            const mockUserData = {
                data: {
                    id: '999',
                    name: 'Sa3fan Test',
                    email: 'Sa3fan@Developer.com',
                    username: 'sa3fan_test',
                },
            }

            mockAuthService.getUserData.mockResolvedValue(mockUserData)

            const wrapper = mountSuccessPage('test-token')
            
            expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
        })

    })
})
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import { createI18n } from 'vue-i18n';
import enMessages from '../../../../i18n/locales/en.json' with { type: 'json' };
import arMessages from '../../../../i18n/locales/ar.json' with { type: 'json' };
import OAuthComplete from '../../components/OAuthComplete.vue';
import OAuthStep1 from '../../components/subComponents/OAuthComponents/OAuthStep1.vue';

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
    ExchangeToken: vi.fn(),
    OAuthCompleteStep1: vi.fn(),
    OAuthCompleteStep2: vi.fn(),
};

// Mock the Nuxt app
vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
    navigateTo: vi.fn(),
}));

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
};

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
}));

// Mock router
const mockRouter = {
    push: vi.fn(),
};

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}));

// Mock OAuth queries
vi.mock('~/modules/auth/queries/useOAuthQuery', async (importOriginal) => {
    return {
        useExchangeTokenQuery: vi.fn((onSuccess, onError) => ({
            mutate: vi.fn(async (payload) => {
                try {
                    const result = await mockAuthService.ExchangeToken(payload.exchange_token);
                    await Promise.resolve();
                    onSuccess?.(result);
                } catch (error) {
                    onError?.(error);
                }
            }),
        })),
        useOAuthCompleteStep1Query: vi.fn((onSuccess, onError) => ({
            mutate: vi.fn(async (payload) => {
                try {
                    const result = await mockAuthService.OAuthCompleteStep1(
                        payload.OAuth_session_token,
                        payload.Birth_date
                    );
                    await Promise.resolve();
                    onSuccess?.(result);
                } catch (error) {
                    onError?.(error);
                }
            }),
        })),
        useOAuthCompleteStep2Query: vi.fn((onSuccess, onError) => ({
            mutate: vi.fn(async (payload) => {
                try {
                    const result = await mockAuthService.OAuthCompleteStep2(
                        payload.OAuth_session_token,
                        payload.Username
                    );
                    await Promise.resolve();
                    onSuccess?.(result);
                } catch (error) {
                    onError?.(error);
                }
            }),
        })),
    };
});

function mountOAuthComplete(exchange_token = 'test-oauth-token-123') {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return mount(OAuthComplete, {
        props: {
            exchange_token,
        },
        global: {
            plugins: [
                [VueQueryPlugin, { queryClient }],
                i18n,
            ],
            stubs: {
                'logo': true,
                'closeButton': true,
                'backButton': true,
                'Teleport': true, // Stub teleport to prevent issues in tests
            },
        },
        attachTo: document.body, // Attach to body for teleport to work
    });
}

describe('OAuth New Account Registration', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock ExchangeToken to return session_token
        mockAuthService.ExchangeToken.mockResolvedValue({
            session_token: 'test-session-token-123',
        });
    });

    describe('Initial Rendering', () => {
        it('should render OAuth step 1 initially', () => {
            const wrapper = mountOAuthComplete();
            expect(wrapper.findComponent(OAuthStep1).exists()).toBe(true);
        });

        it('should pass OAuth_session_token to step 1 after exchange', async () => {
            const wrapper = mountOAuthComplete();
            await flushPromises();

            const step1 = wrapper.findComponent(OAuthStep1);
            expect(step1.props('OAuth_session_token')).toBe('test-session-token-123');
        });

        it('should display birth date title', async () => {
            const wrapper = mountOAuthComplete();
            await flushPromises();
            expect(wrapper.text()).toContain("What's your birth date?");
        });

        it('should have month, day, and year selects', async () => {
            const wrapper = mountOAuthComplete();
            await flushPromises();
            const selects = wrapper.findAll('select');
            expect(selects.length).toBe(3); // month, day, year
        });

        it('should have Next button', async () => {
            const wrapper = mountOAuthComplete();
            await flushPromises();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            expect(nextButton).toBeTruthy();
        });

        it('should display privacy policy message', async () => {
            const wrapper = mountOAuthComplete();
            await flushPromises();
            expect(wrapper.text()).toContain('By signing up, you agree to our Terms, Data Policy and Cookies Policy');
        });
    });

    describe('Step 1: Birth Date', () => {
        it('should allow selecting birth date', async () => {
            const wrapper = mountOAuthComplete();
            await flushPromises();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('5'); // May
            await selects[1]?.setValue('15'); // Day 15
            await selects[2]?.setValue('1990'); // Year 1990

            expect((selects[0]?.element as HTMLSelectElement).value).toBe('5');
            expect((selects[1]?.element as HTMLSelectElement).value).toBe('15');
            expect((selects[2]?.element as HTMLSelectElement).value).toBe('1990');
        });

        it('should call OAuthCompleteStep1 with correct data', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data:{data: {
                    message: 'Birth date verified',
                    usernames: ['s3fan_test', 's3fan123']
                }
            }
            });

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data:{data: {
                    message: 'Username set successfully'
                }
            }
            });

            const wrapper = mountOAuthComplete('oauth-token-789');
            await flushPromises();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'test-session-token-123',
                '2005-01-01'
            );
        });

        it('should automatically call step2 after step1 succeeds', async () => {
            const recommendations = ['s3fan_test', 's3fan123'];
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: {
                    message: 'Birth date verified',
                    usernames: recommendations
                }
            });

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    message: 'Username set successfully'
                }
            });

            const wrapper = mountOAuthComplete('oauth-token-789');
            await flushPromises();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith(
                'test-session-token-123',
                's3fan_test'
            );
        });

        it('should complete registration after successful step2', async () => {
            const recommendations = ['sa3fan_test', 'sa3fan123'];
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: {
                    message: 'Birth date verified',
                    usernames: recommendations
                }
            });

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    message: 'Registration complete sa3fan is doing great work'
                }
            });

            const wrapper = mountOAuthComplete();
            await flushPromises();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalled();
            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalled();
        });

        it('should show error message on API failure', async () => {
            mockAuthService.OAuthCompleteStep1.mockRejectedValue({
                response: {
                    data: {
                        message: 'sa3fan tells you this is error',
                    },
                },
            });

            const wrapper = mountOAuthComplete();
            await flushPromises();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2020');

            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(wrapper.text()).toContain('sa3fan tells you this is error');
        });


        it('should format single-digit month and day with leading zeros', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: {
                    usernames: ['sa3fan_test']
                }
            });

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    message: 'Success'
                }
            });

            const wrapper = mountOAuthComplete('token-123');
            await flushPromises();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'test-session-token-123',
                '2005-01-01'
            );
        });
    });

    describe('Step 2: Automatic Username Assignment', () => {
        it('should call OAuthCompleteStep2 with first recommendation automatically', async () => {
            const recommendations = ['sa3fan_test', 'sa3fan123'];
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: {
                    message: 'Success',
                    usernames: recommendations
                }
            });

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    message: 'Username set successfully'
                }
            });

            const wrapper = mountOAuthComplete('oauth-session-456');
            await flushPromises();
            const selects = wrapper.findAll('select');
            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith(
                'test-session-token-123',
                'sa3fan_test'
            );
        });
    });

    describe('Integration Tests', () => {
        it('should complete full OAuth registration flow', async () => {
            const recommendations = ['sa3fan_test', 'sa3fan123'];
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: {
                    usernames: recommendations
                }
            });

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    message: 'Registration complete'
                }
            });

            const wrapper = mountOAuthComplete('full-flow-token');
            await flushPromises();

            const selects = wrapper.findAll('select');
            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'test-session-token-123',
                '2005-01-01'
            );
            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith(
                'test-session-token-123',
                'sa3fan_test'
            );
        });

        it('should handle errors and allow retry in each step', async () => {
            mockAuthService.OAuthCompleteStep1.mockRejectedValueOnce({
                response: { data: { message: 'Server error' } }
            });

            mockAuthService.OAuthCompleteStep1.mockResolvedValueOnce({
                data: { usernames: ['retry_sa3fan'] }
            });

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: { message: 'Success' }
            });

            const wrapper = mountOAuthComplete();
            await flushPromises();

            const selects = wrapper.findAll('select');
            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            let form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(wrapper.text()).toContain('Server error');

            await selects[0]?.setValue('12');
            await selects[1]?.setValue('24');
            await selects[2]?.setValue('2004');

            form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            // Should successfully call both steps
            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalled();
            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalled();
        });


        it('should handle step2 error and stay on step1', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { usernames: ['sa3fan_test'] }
            });

            mockAuthService.OAuthCompleteStep2.mockRejectedValue({
                response: {
                    data: {
                        message: 'Username already taken'
                    }
                }
            });

            const wrapper = mountOAuthComplete();
            await flushPromises();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('5');
            await selects[1]?.setValue('15');
            await selects[2]?.setValue('1990');

            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(wrapper.text()).toContain('Username already taken');
            expect(wrapper.findComponent(OAuthStep1).exists()).toBe(true);
        });
    });
});

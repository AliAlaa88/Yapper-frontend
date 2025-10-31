import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import OAuthComplete from '../../components/OAuthComplete.vue';
import OAuthStep1 from '../../components/subComponents/OAuthComponents/OAuthStep1.vue';

// Mock the auth service
const mockAuthService = {
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
    user: null,
    accessToken: null,
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

function mountOAuthComplete(oauth_session_token = 'test-oauth-token-123') {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return mount(OAuthComplete, {
        props: {
            oauth_session_token,
        },
        global: {
            plugins: [[VueQueryPlugin, { queryClient }]],
            stubs: {
                'logo': true,
                'closeButton': true,
                'backButton': true,
            },
        },
    });
}

describe('OAuth New Account Registration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render OAuth step 1 initially', () => {
            const wrapper = mountOAuthComplete();
            expect(wrapper.findComponent(OAuthStep1).exists()).toBe(true);
        });

        it('should pass oauth_session_token to step 1', () => {
            const token = 'test-token-456';
            const wrapper = mountOAuthComplete(token);
            const step1 = wrapper.findComponent(OAuthStep1);
            expect(step1.props('OAuth_session_token')).toBe(token);
        });

        it('should display birth date title', () => {
            const wrapper = mountOAuthComplete();
            expect(wrapper.text()).toContain("What's your birth date?");
        });

        it('should have month, day, and year selects', () => {
            const wrapper = mountOAuthComplete();
            const selects = wrapper.findAll('select');
            expect(selects.length).toBe(3); // month, day, year
        });

        it('should have Next button', () => {
            const wrapper = mountOAuthComplete();
            const signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            expect(signUpButton).toBeTruthy();
        });

        it('should display privacy policy message', () => {
            const wrapper = mountOAuthComplete();
            expect(wrapper.text()).toContain('By signing up, you agree to our Terms, Data Policy and Cookies Policy');
        });
    });

    describe('Step 1: Birth Date', () => {
        it('should allow selecting birth date', async () => {
            const wrapper = mountOAuthComplete();
            const selects = wrapper.findAll('select');
            
            await selects[0]?.setValue('5'); // May
            await selects[1]?.setValue('15'); // Day 15
            await selects[2]?.setValue('1990'); // Year 1990

            expect((selects[0]?.element as HTMLSelectElement).value).toBe('5');
            expect((selects[1]?.element as HTMLSelectElement).value).toBe('15');
            expect((selects[2]?.element as HTMLSelectElement).value).toBe('1990');
        });

        it('should show error if birth date is incomplete', async () => {
            const wrapper = mountOAuthComplete();
            const selects = wrapper.findAll('select');
            
            await selects[0]?.setValue('5');

            const signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Please select your complete birth date');
        });

        it('should call OAuthCompleteStep1 with correct data', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { 
                    message: 'Birth date verified',
                    usernames: ['s3fan_test', 's3fan123']
                }
            });
            
            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    message: 'Username set successfully'
                }
            });

            const wrapper = mountOAuthComplete('oauth-token-789');
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1'); 
            await selects[1]?.setValue('1'); 
            await selects[2]?.setValue('2005'); 

            const signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'oauth-token-789',
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
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith(
                'oauth-token-789',
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
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1'); 
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const signUpButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
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
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2020');

            const signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
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
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1'); 
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'token-123',
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
            const selects = wrapper.findAll('select');
            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const signUpButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith(
                'oauth-session-456',
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

            const selects = wrapper.findAll('select');
            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const signUpButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'full-flow-token',
                '2005-01-01'
            );
            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith(
                'full-flow-token',
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

            const selects = wrapper.findAll('select');
            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            let signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Server error');

            await selects[0]?.setValue('12');
            await selects[1]?.setValue('24');
            await selects[2]?.setValue('2004');

            signUpButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
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
            const selects = wrapper.findAll('select');
            
            await selects[0]?.setValue('5');
            await selects[1]?.setValue('15');
            await selects[2]?.setValue('1990');

            const signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Username already taken');
            expect(wrapper.findComponent(OAuthStep1).exists()).toBe(true);
        });
    });
});

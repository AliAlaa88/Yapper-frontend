import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import OAuthComplete from '../../components/OAuthComplete.vue';
import OAuthStep1 from '../../components/subComponents/OAuthComponents/OAuthStep1.vue';
import OAuthStep2 from '../../components/subComponents/OAuthComponents/OAuthStep2.vue';

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
            expect(wrapper.findComponent(OAuthStep2).exists()).toBe(false);
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
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            expect(nextButton).toBeTruthy();
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
            
            // Only set month, leave day and year empty
            await selects[0]?.setValue('5');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Please select your complete birth date');
        });

        it('should call OAuthCompleteStep1 with correct data', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { 
                    message: 'Birth date verified',
                    usernames: ['john_doe', 'johndoe123']
                }
            });

            const wrapper = mountOAuthComplete('oauth-token-789');
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('5'); // May
            await selects[1]?.setValue('15'); // Day 15
            await selects[2]?.setValue('1990'); // Year 1990

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'oauth-token-789',
                '1990-05-15'
            );
        });

        it('should move to step 2 on successful birth date submission', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { 
                    message: 'Birth date verified',
                    usernames: ['john_doe', 'johndoe123']
                }
            });

            const wrapper = mountOAuthComplete();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('12'); // December
            await selects[1]?.setValue('25'); // Day 25
            await selects[2]?.setValue('1995'); // Year 1995

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(OAuthStep2).exists()).toBe(true);
            expect(wrapper.findComponent(OAuthStep1).exists()).toBe(false);
        });

        it('should show error message on API failure', async () => {
            mockAuthService.OAuthCompleteStep1.mockRejectedValue({
                response: {
                    data: {
                        message: 'Invalid birth date',
                    },
                },
            });

            const wrapper = mountOAuthComplete();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2020');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Invalid birth date');
        });

        it('should pass recommendations to step 2', async () => {
            const recommendations = ['alice_wonder', 'alice123', 'wonderland_alice'];
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { 
                    message: 'Success',
                    usernames: recommendations
                }
            });

            const wrapper = mountOAuthComplete();
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('3');
            await selects[1]?.setValue('10');
            await selects[2]?.setValue('1992');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const step2 = wrapper.findComponent(OAuthStep2);
            expect(step2.props('recommendations')).toEqual(recommendations);
        });

        it('should format single-digit month and day with leading zeros', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { 
                    usernames: ['test_user']
                }
            });

            const wrapper = mountOAuthComplete('token-123');
            const selects = wrapper.findAll('select');

            await selects[0]?.setValue('3'); // March (single digit)
            await selects[1]?.setValue('5'); // Day 5 (single digit)
            await selects[2]?.setValue('1988');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'token-123',
                '1988-03-05' // Should have leading zeros
            );
        });
    });

    describe('Step 2: Username Selection', () => {
        async function moveToStep2(wrapper: any, recommendations = ['john_doe', 'johndoe123']) {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { 
                    message: 'Success',
                    usernames: recommendations
                }
            });

            const selects = wrapper.findAll('select');
            await selects[0].setValue('6');
            await selects[1].setValue('20');
            await selects[2].setValue('1990');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();
        }

        it('should display username selection screen', async () => {
            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper);

            expect(wrapper.text()).toContain('Choose a username');
            expect(wrapper.findComponent(OAuthStep2).exists()).toBe(true);
        });

        it('should display username recommendations', async () => {
            const recommendations = ['alice_wonder', 'alice123', 'wonderland'];
            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper, recommendations);

            expect(wrapper.text()).toContain('Recommended usernames');
            expect(wrapper.text()).toContain('alice_wonder');
            expect(wrapper.text()).toContain('alice123');
            expect(wrapper.text()).toContain('wonderland');
        });

        it('should allow clicking on recommended username', async () => {
            const recommendations = ['test_user', 'user123'];
            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper, recommendations);

            const recommendationButtons = wrapper.findAll('li');
            await recommendationButtons[0]?.trigger('click');
            await flushPromises();

            const usernameInput = wrapper.find('input[type="text"]');
            expect((usernameInput.element as HTMLInputElement).value).toBe('test_user');
        });

        it('should allow typing custom username', async () => {
            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper);

            const usernameInput = wrapper.find('input[type="text"]');
            await usernameInput.setValue('custom_username');

            expect((usernameInput.element as HTMLInputElement).value).toBe('custom_username');
        });

        it('should call OAuthCompleteStep2 with correct data', async () => {
            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    access_token: 'test-token',
                    user: { id: 1, email: 'user@example.com', username: 'test_user' }
                }
            });

            const wrapper = mountOAuthComplete('oauth-session-456');
            await moveToStep2(wrapper);

            const usernameInput = wrapper.find('input[type="text"]');
            await usernameInput.setValue('test_user');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith(
                'oauth-session-456',
                'test_user'
            );
        });

        it('should store user data on successful registration', async () => {
            const userData = {
                access_token: 'test-access-token',
                user: { 
                    id: 1, 
                    email: 'user@example.com', 
                    username: 'johndoe',
                    name: 'John Doe'
                }
            };

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: userData
            });

            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper);

            const usernameInput = wrapper.find('input[type="text"]');
            await usernameInput.setValue('johndoe');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(mockUserStore.setAuth).toHaveBeenCalledWith(userData);
        });

        it('should emit finish event on successful registration', async () => {
            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    access_token: 'test-token',
                    user: { id: 1, username: 'testuser' }
                }
            });

            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper);

            const usernameInput = wrapper.find('input[type="text"]');
            await usernameInput.setValue('testuser');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Wait for the 1500ms timeout in the component
            await new Promise(resolve => setTimeout(resolve, 1600));

            expect(wrapper.emitted('finish')).toBeTruthy();
        });

        it('should show success message on registration', async () => {
            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    access_token: 'token',
                    user: { id: 1 }
                }
            });

            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper);

            const usernameInput = wrapper.find('input[type="text"]');
            await usernameInput.setValue('newuser');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Account created successfully');
        });

        it('should show error message on registration failure', async () => {
            mockAuthService.OAuthCompleteStep2.mockRejectedValue({
                response: {
                    data: {
                        message: 'Username already taken',
                    },
                },
            });

            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper);

            const usernameInput = wrapper.find('input[type="text"]');
            await usernameInput.setValue('taken_username');

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Username already taken');
        });

        it('should allow going back to step 1', async () => {
            const wrapper = mountOAuthComplete();
            await moveToStep2(wrapper);

            expect(wrapper.findComponent(OAuthStep2).exists()).toBe(true);

            // Emit back event
            wrapper.findComponent(OAuthStep2).vm.$emit('back');
            await flushPromises();

            expect(wrapper.findComponent(OAuthStep1).exists()).toBe(true);
            expect(wrapper.findComponent(OAuthStep2).exists()).toBe(false);
        });

        it('should preserve oauth_session_token when going back', async () => {
            const token = 'preserve-test-token';
            const wrapper = mountOAuthComplete(token);
            await moveToStep2(wrapper);

            wrapper.findComponent(OAuthStep2).vm.$emit('back');
            await flushPromises();

            const step1 = wrapper.findComponent(OAuthStep1);
            expect(step1.props('OAuth_session_token')).toBe(token);
        });
    });

    describe('Integration Tests', () => {
        it('should complete full OAuth registration flow', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { 
                    usernames: ['alice_w', 'alice123']
                }
            });

            mockAuthService.OAuthCompleteStep2.mockResolvedValue({
                data: {
                    access_token: 'final-token',
                    user: { id: 1, email: 'alice@example.com', username: 'alice_w' }
                }
            });

            const wrapper = mountOAuthComplete('full-flow-token');

            // Step 1: Enter birth date
            const selects = wrapper.findAll('select');
            await selects[0]?.setValue('8');
            await selects[1]?.setValue('12');
            await selects[2]?.setValue('1993');

            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Should be on step 2
            expect(wrapper.text()).toContain('Choose a username');

            // Step 2: Choose username
            const usernameInput = wrapper.find('input[type="text"]');
            await usernameInput.setValue('alice_w');

            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Wait for success and finish emit
            await new Promise(resolve => setTimeout(resolve, 1600));

            expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                'full-flow-token',
                '1993-08-12'
            );
            expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith(
                'full-flow-token',
                'alice_w'
            );
            expect(mockUserStore.setAuth).toHaveBeenCalled();
            expect(wrapper.emitted('finish')).toBeTruthy();
        });

        it('should handle errors and allow retry in each step', async () => {
            // First attempt fails
            mockAuthService.OAuthCompleteStep1.mockRejectedValueOnce({
                response: { data: { message: 'Server error' } }
            });

            // Second attempt succeeds
            mockAuthService.OAuthCompleteStep1.mockResolvedValueOnce({
                data: { usernames: ['retry_user'] }
            });

            const wrapper = mountOAuthComplete();

            // First attempt
            const selects = wrapper.findAll('select');
            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2000');

            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Server error');

            // Retry
            await selects[0]?.setValue('2');
            await selects[1]?.setValue('2');
            await selects[2]?.setValue('2000');

            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(OAuthStep2).exists()).toBe(true);
        });

        it('should handle different date formats correctly', async () => {
            mockAuthService.OAuthCompleteStep1.mockResolvedValue({
                data: { usernames: ['test'] }
            });

            const wrapper = mountOAuthComplete('token');

            // Test edge case dates
            const testCases = [
                { month: '1', day: '1', year: '2000', expected: '2000-01-01' },
                { month: '12', day: '31', year: '1999', expected: '1999-12-31' },
                { month: '2', day: '29', year: '2000', expected: '2000-02-29' }, // Leap year
            ];

            for (const testCase of testCases) {
                const selects = wrapper.findAll('select');
                await selects[0]?.setValue(testCase.month);
                await selects[1]?.setValue(testCase.day);
                await selects[2]?.setValue(testCase.year);

                const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
                await nextButton?.trigger('click');
                await flushPromises();

                expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith(
                    'token',
                    testCase.expected
                );

                // Go back for next test
                if (testCases.indexOf(testCase) < testCases.length - 1) {
                    wrapper.findComponent(OAuthStep2).vm.$emit('back');
                    await flushPromises();
                }
            }
        });
    });
});

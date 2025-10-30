import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import Signup from '../../components/createAccount.vue';
import createAccount from '../../components/subComponents/signupComponents/createAccount.vue';
import verifyOtp from '../../components/subComponents/signupComponents/verifyOtp.vue';
import FinalRegister from '../../components/subComponents/signupComponents/FinalRegister.vue';

// Mock the auth service
const mockAuthService = {
    registerStep1: vi.fn(),
    registerStep2: vi.fn(),
    registerStep3: vi.fn(),
    resendOTP: vi.fn(),
};

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

function mountSignup() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return mount(Signup, {
        global: {
            plugins: [[VueQueryPlugin, { queryClient }]],
            stubs: {
                'logo': true,
                'closeButton': true,
                'backButton': true,
                'Recaptcha': {
                    template: '<div class="recaptcha-mock"><button @click="$emit(\'verified\', \'mock-captcha-token\')">Verify Captcha</button></div>',
                    methods: {
                        run: vi.fn().mockResolvedValue(undefined)
                    }
                },
            },
        },
    });
}

describe('Signup Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render signup step 1 initially', () => {
            const wrapper = mountSignup();
            expect(wrapper.findComponent(createAccount).exists()).toBe(true);
            expect(wrapper.findComponent(verifyOtp).exists()).toBe(false);
            expect(wrapper.findComponent(FinalRegister).exists()).toBe(false);
        });

        it('should display create account title', () => {
            const wrapper = mountSignup();
            expect(wrapper.text()).toContain('Create Your account');
        });

        it('should have name, email, and date of birth inputs', () => {
            const wrapper = mountSignup();
            const inputs = wrapper.findAll('input[type="text"], input[type="email"]');
            expect(inputs.length).toBeGreaterThanOrEqual(2); // name and email
        });

        it('should have month, day, and year selects', () => {
            const wrapper = mountSignup();
            const selects = wrapper.findAll('select');
            expect(selects.length).toBe(3); // month, day, year
        });

        it('should have Next button', () => {
            const wrapper = mountSignup();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            expect(nextButton).toBeTruthy();
        });

        it('should have reCAPTCHA component', () => {
            const wrapper = mountSignup();
            expect(wrapper.find('.recaptcha-mock').exists()).toBe(true);
        });
    });

    describe('Step 1: Create Account', () => {
        it('should allow entering name and email', async () => {
            const wrapper = mountSignup();
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');

            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');

            expect((nameInput.element as HTMLInputElement).value).toBe('John Doe');
            expect((emailInput.element as HTMLInputElement).value).toBe('john@example.com');
        });

        it('should allow selecting date of birth', async () => {
            const wrapper = mountSignup();
            const selects = wrapper.findAll('select');
            
            await selects[0].setValue('5'); // May
            await selects[1].setValue('15'); // Day 15
            await selects[2].setValue('1990'); // Year 1990

            expect((selects[0].element as HTMLSelectElement).value).toBe('5');
            expect((selects[1].element as HTMLSelectElement).value).toBe('15');
            expect((selects[2].element as HTMLSelectElement).value).toBe('1990');
        });

        it('should show error if captcha not completed', async () => {
            const wrapper = mountSignup();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Please complete the reCAPTCHA');
        });

        it('should call registerStep1 mutation with correct data', async () => {
            mockAuthService.registerStep1.mockResolvedValue({
                data: { message: 'OTP sent successfully' }
            });

            const wrapper = mountSignup();
            
            // Fill in the form
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            const selects = wrapper.findAll('select');

            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            await selects[0].setValue('5'); // May
            await selects[1].setValue('15'); // Day 15
            await selects[2].setValue('1990'); // Year 1990

            // Verify captcha
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();

            // Click Next
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.registerStep1).toHaveBeenCalledWith({
                Name: 'John Doe',
                Email: 'john@example.com',
                Birth_date: '1990-05-15',
                Captcha_token: 'mock-captcha-token'
            });
        });

        it('should move to step 2 on successful registration', async () => {
            mockAuthService.registerStep1.mockResolvedValue({
                data: { message: 'OTP sent successfully' }
            });

            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            const selects = wrapper.findAll('select');

            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            await selects[0].setValue('5');
            await selects[1].setValue('15');
            await selects[2].setValue('1990');

            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(verifyOtp).exists()).toBe(true);
            expect(wrapper.findComponent(createAccount).exists()).toBe(false);
        });

        it('should show error message on registration failure', async () => {
            mockAuthService.registerStep1.mockRejectedValue({
                response: {
                    data: {
                        message: 'Email already exists',
                    },
                },
            });

            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');

            await nameInput.setValue('John Doe');
            await emailInput.setValue('existing@example.com');

            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Email already exists');
        });

        it('should skip to step 3 if current_step is 2 in error', async () => {
            mockAuthService.registerStep1.mockRejectedValue({
                response: {
                    data: {
                        message: 'User already verified',
                        current_step: 2,
                    },
                },
            });

            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');

            await nameInput.setValue('John Doe');
            await emailInput.setValue('verified@example.com');

            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(FinalRegister).exists()).toBe(true);
        });
    });

    describe('Step 2: Verify OTP', () => {
        beforeEach(async () => {
            mockAuthService.registerStep1.mockResolvedValue({
                data: { message: 'OTP sent successfully' }
            });
        });

        it('should display verify OTP screen after step 1', async () => {
            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');

            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');

            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('We sent you a code');
            expect(wrapper.findComponent(verifyOtp).exists()).toBe(true);
        });

        it('should allow entering OTP', async () => {
            const wrapper = mountSignup();
            
            // Move to step 2
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Enter OTP
            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');

            expect((otpInput.element as HTMLInputElement).value).toBe('123456');
        });

        it('should call registerStep2 mutation with OTP', async () => {
            mockAuthService.registerStep2.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    recommendations: ['john_doe', 'johndoe123']
                }
            });

            const wrapper = mountSignup();
            
            // Move to step 2
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Enter OTP and submit
            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.registerStep2).toHaveBeenCalledWith({
                token: '123456',
                Email: 'john@example.com'
            });
        });

        it('should move to step 3 on successful OTP verification', async () => {
            mockAuthService.registerStep2.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    recommendations: ['john_doe', 'johndoe123']
                }
            });

            const wrapper = mountSignup();
            
            // Move to step 2
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Verify OTP
            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(FinalRegister).exists()).toBe(true);
            expect(wrapper.text()).toContain('Choose username and a password');
        });

        it('should show error on invalid OTP', async () => {
            mockAuthService.registerStep2.mockRejectedValue({
                response: {
                    data: {
                        message: 'Invalid OTP',
                    },
                },
            });

            const wrapper = mountSignup();
            
            // Move to step 2
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Enter wrong OTP
            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('000000');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Invalid OTP');
        });

        it('should allow resending OTP', async () => {
            mockAuthService.resendOTP.mockResolvedValue({
                data: { message: 'OTP resent successfully' }
            });

            const wrapper = mountSignup();
            
            // Move to step 2
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Click resend
            const resendButton = wrapper.findAll('button').find(btn => btn.text() === 'Resend code');
            await resendButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.resendOTP).toHaveBeenCalledWith('john@example.com');
            expect(wrapper.text()).toContain('OTP has been resent successfully');
        });

        it('should allow going back to step 1', async () => {
            const wrapper = mountSignup();
            
            // Move to step 2
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(verifyOtp).exists()).toBe(true);

            // Emit close event from verifyOtp
            wrapper.findComponent(verifyOtp).vm.$emit('close');
            await flushPromises();

            expect(wrapper.findComponent(createAccount).exists()).toBe(true);
            expect(wrapper.findComponent(verifyOtp).exists()).toBe(false);
        });
    });

    describe('Step 3: Final Registration', () => {
        beforeEach(async () => {
            mockAuthService.registerStep1.mockResolvedValue({
                data: { message: 'OTP sent successfully' }
            });
            mockAuthService.registerStep2.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    recommendations: ['john_doe', 'johndoe123']
                }
            });
        });

        it('should display final registration screen after OTP verification', async () => {
            const wrapper = mountSignup();
            
            // Move through steps 1 and 2
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Choose username and a password');
            expect(wrapper.findComponent(FinalRegister).exists()).toBe(true);
        });

        it('should allow entering username and password', async () => {
            const wrapper = mountSignup();
            
            // Move to step 3
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Fill final registration form
            const usernameInput = wrapper.find('input[type="text"]');
            const passwordInput = wrapper.find('input[type="password"]');

            await usernameInput.setValue('johndoe');
            await passwordInput.setValue('Password123!');

            expect((usernameInput.element as HTMLInputElement).value).toBe('johndoe');
            expect((passwordInput.element as HTMLInputElement).value).toBe('Password123!');
        });

        it('should call registerStep3 mutation with complete data', async () => {
            mockAuthService.registerStep3.mockResolvedValue({
                data: {
                    access_token: 'test-token',
                    user: { id: 1, email: 'john@example.com', name: 'John Doe' }
                }
            });

            const wrapper = mountSignup();
            
            // Move to step 3
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Complete registration
            const usernameInput = wrapper.find('input[type="text"]');
            const passwordInput = wrapper.find('input[type="password"]');
            const languageSelect = wrapper.find('select');

            await usernameInput.setValue('johndoe');
            await passwordInput.setValue('Password123!');
            await languageSelect.setValue('en');

            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.registerStep3).toHaveBeenCalledWith({
                Email: 'john@example.com',
                Password: 'Password123!',
                Username: 'johndoe',
                Language: 'en'
            });
        });

        it('should emit finish event on successful registration', async () => {
            mockAuthService.registerStep3.mockResolvedValue({
                data: {
                    access_token: 'test-token',
                    user: { id: 1, email: 'john@example.com', name: 'John Doe' }
                }
            });

            const wrapper = mountSignup();
            
            // Move through all steps
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const usernameInput = wrapper.find('input[type="text"]');
            const passwordInput = wrapper.find('input[type="password"]');
            await usernameInput.setValue('johndoe');
            await passwordInput.setValue('Password123!');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            // Wait for success message and finish emit (1500ms timeout in component)
            await new Promise(resolve => setTimeout(resolve, 1600));

            expect(wrapper.emitted('finish')).toBeTruthy();
        });

        it('should show username recommendations', async () => {
            mockAuthService.registerStep2.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    recommendations: ['john_doe', 'johndoe123', 'doe_john']
                }
            });

            const wrapper = mountSignup();
            
            // Move to step 3
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('John Doe');
            await emailInput.setValue('john@example.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');
            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Recommended usernames');
            expect(wrapper.text()).toContain('john_doe');
            expect(wrapper.text()).toContain('johndoe123');
        });
    });
});

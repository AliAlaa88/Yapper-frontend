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
            expect(inputs.length).toBeGreaterThanOrEqual(2);
        });

        it('should have month, day, and year selects', () => {
            const wrapper = mountSignup();
            const selects = wrapper.findAll('select');
            expect(selects.length).toBe(3); 
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

            await nameInput.setValue('Safan Test');
            await emailInput.setValue('Sa3fan@Developer.com');

            expect((nameInput.element as HTMLInputElement).value).toBe('Safan Test');
            expect((emailInput.element as HTMLInputElement).value).toBe('Sa3fan@Developer.com');
        });

        it('should allow selecting date of birth', async () => {
            const wrapper = mountSignup();
            const selects = wrapper.findAll('select');
            
            await selects[0]?.setValue('1'); 
            await selects[1]?.setValue('1'); 
            await selects[2]?.setValue('2005'); 

            expect((selects[0]?.element as HTMLSelectElement).value).toBe('1');
            expect((selects[1]?.element as HTMLSelectElement).value).toBe('1');
            expect((selects[2]?.element as HTMLSelectElement).value).toBe('2005');
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
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            const selects = wrapper.findAll('select');

            await nameInput.setValue('Safan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
            await selects[0]?.setValue('1'); 
            await selects[1]?.setValue('1'); 
            await selects[2]?.setValue('2005'); 

            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.registerStep1).toHaveBeenCalledWith({
                Name: 'Safan Test',
                Email: 'Sa3fan@Developer.com',
                Birth_date: '2005-01-01',
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

            await nameInput.setValue('Safan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
            await selects[0]?.setValue('1');
            await selects[1]?.setValue('1');
            await selects[2]?.setValue('2005');

            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(verifyOtp).exists()).toBe(true);
            expect(wrapper.findComponent(createAccount).exists()).toBe(false);
            expect(wrapper.findComponent(FinalRegister).exists()).toBe(false);
        });

        it('should show error message on registration failure', async () => {
            mockAuthService.registerStep1.mockRejectedValue({
                response: {
                    data: {
                        message: 'Email already exists sa3fan created it before',
                    },
                },
            });

            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');

            await nameInput.setValue('Sa3fan Test');
            await emailInput.setValue('Sa3fan@Developer.com');

            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();

            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.text()).toContain('Email already exists sa3fan created it before');
        });
    });

    describe('Step 2: Verify OTP', () => {
        beforeEach(async () => {
            mockAuthService.registerStep1.mockResolvedValue({
                data: { message: 'OTP sent successfully' }
            });
        });
        it('should allow entering OTP', async () => {
            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('Sa3fan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const otpInput = wrapper.find('input[type="text"]');
            await otpInput.setValue('123456');

            expect((otpInput.element as HTMLInputElement).value).toBe('123456');
        });

        it('should call registerStep2 mutation with OTP and go to step 3', async () => {
            mockAuthService.registerStep2.mockResolvedValue({
                data: { 
                    message: 'OTP verified',
                    recommendations: ['sa3fan_test', 'sa3fantest123']
                }
            });

            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('Sa3fan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
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

            expect(mockAuthService.registerStep2).toHaveBeenCalledWith({
                token: '123456',
                Email: 'Sa3fan@Developer.com'
            });

            nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(FinalRegister).exists()).toBe(true);
            expect(wrapper.text()).toContain('Enter a password');
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
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('Sa3fan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            let nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

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
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('Sa3fan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            const resendButton = wrapper.findAll('button').find(btn => btn.text() === 'Resend code');
            await resendButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.resendOTP).toHaveBeenCalledWith('Sa3fan@Developer.com');
            expect(wrapper.text()).toContain('OTP has been resent successfully');
        });

        it('should allow going back to step 1', async () => {
            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('Sa3fan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
            const captchaButton = wrapper.find('.recaptcha-mock button');
            await captchaButton.trigger('click');
            await flushPromises();
            const nextButton = wrapper.findAll('button').find(btn => btn.text() === 'Next');
            await nextButton?.trigger('click');
            await flushPromises();

            expect(wrapper.findComponent(verifyOtp).exists()).toBe(true);

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
                    recommendations: ['Sa3fan_Test', 'Sa3fan123']
                }
            });
        });

        it('should allow entering password', async () => {
            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('Sa3fan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
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

            const passwordInput = wrapper.find('input[type="password"]');

            await passwordInput.setValue('Password123!');

            expect((passwordInput.element as HTMLInputElement).value).toBe('Password123!');
        });

        it('should call registerStep3 mutation with complete data', async () => {
            mockAuthService.registerStep3.mockResolvedValue({
                data: {
                    access_token: 'test-token',
                    user: { id: 1, email: 'Sa3fan@Developer.com', name: 'Sa3fan Test' }
                }
            });

            const wrapper = mountSignup();
            
            const nameInput = wrapper.find('input[type="text"]');
            const emailInput = wrapper.find('input[type="email"]');
            await nameInput.setValue('Sa3fan Test');
            await emailInput.setValue('Sa3fan@Developer.com');
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

            const passwordInput = wrapper.find('input[type="password"]');

            await passwordInput.setValue('Password123!');

            const signUpButton = wrapper.findAll('button').find(btn => btn.text() === 'Sign Up');
            await signUpButton?.trigger('click');
            await flushPromises();

            expect(mockAuthService.registerStep3).toHaveBeenCalledWith({
                Email: 'Sa3fan@Developer.com',
                Password: 'Password123!',
                Username: 'Sa3fan_Test',
                Language: 'en'
            });
        });
    });
});

import { useNuxtApp } from '#app';
import type { RegisterPayload } from './types/register';
export const createAuthService = () => {
    const { $yapperApi } = useNuxtApp();

    return {
        login: async () => {
            // Call API to log in user            
        },
        registerStep1: async (payload: RegisterPayload) => {
            const response = await $yapperApi.post('https://dev.yapper.cmp27.space/auth/signup/step1', {
                name: payload.Name,
                email: payload.Email,
                birth_date: payload.Birth_date,
                captcha_token: payload.Captcha_token
            });
            return response.data;
        },
        registerStep2: async () => {
            // Call API to verify the code and complete registration
        },
        registerStep3: async () => {
            // Call API to finalize registration with setting password
        },
        resendOTP: async () => {
            // Call API to resend OTP code
        },
        forgotPassword: async () => {
            // Call API to initiate password reset
        },
        veriftyForgotPasswordOTP: async () => {
            // Call API to verify OTP for password reset
        },
        OAuthCompleteStep1: async () => {
            // Call API to complete OAuth registration step 1
        },
        OAuthCompleteStep2: async () => {
            // Call API to complete OAuth registration step 2
        },
        getUserData: async () => {
            // Call API to get user data
        }
    };
};

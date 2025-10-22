import { useNuxtApp } from '#app';
import type { RegisterPayload,verifyAccountPayload,finalizeRegisterPayload } from './types/register';
export const createAuthService = () => {
    const { $yapperApi } = useNuxtApp();

    return {
        login: async () => {
            // Call API to log in user            
        },
        registerStep1: async (payload: RegisterPayload) => {
            const response = await $yapperApi.post('http://localhost:3000/auth/signup/step1', {
                name: payload.Name,
                email: payload.Email,
                birth_date: payload.Birth_date,
                captcha_token: payload.Captcha_token
            });
            return response.data;
        },
        registerStep2: async (payload: verifyAccountPayload) => {
            const response = await $yapperApi.post('http://localhost:3000/auth/signup/step2', {
                email: payload.Email,
                token: payload.token
            });
            return response.data;
        },
        registerStep3: async (payload: finalizeRegisterPayload) => {
            const response = await $yapperApi.post('http://localhost:3000/auth/signup/step3', {
                email: payload.Email,
                password: payload.Password,
                username: payload.Username,
                language: payload.Language
            },{withCredentials: true});
            return response.data;
        },
        resendOTP: async (email: string) => {
            const response = await $yapperApi.post('http://localhost:3000/auth/resend-otp', {
                email
            });
            return response.data;
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

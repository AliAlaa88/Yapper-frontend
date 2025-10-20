import axios from 'axios';
import OAuth from './components/subComponents/OAuth.vue';
export const createAuthService = () => {
    return {
        login: async () => {
            // Call API to log in user            
        },
        registerStep1: async () => {
            // Call API to register user
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
        // Add more auth-related methods as needed
    };
};

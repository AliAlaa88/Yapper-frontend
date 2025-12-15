import { useNuxtApp } from '#app'
import type {
    RegisterPayload,
    verifyAccountPayload,
    finalizeRegisterPayload,
} from './types/register'

export const createAuthService = () => {
    const { $yapperApi } = useNuxtApp()
    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl

    return {
        checkIdentifierAvailability: async (identifier: string) => {
            const response = await $yapperApi.post(`${API_URL}/auth/check-identifier`, {
                identifier: identifier,
            })
            return response.data
        },
        login: async (identifier: string, Password: string, Type: string) => {
            // Call API to log in user
            const response = await $yapperApi.post(`${API_URL}/auth/login`, {
                identifier: identifier,
                password: Password,
                type: Type,
            })
            return response.data
        },
        registerStep1: async (payload: RegisterPayload) => {
            const response = await $yapperApi.post(`${API_URL}/auth/signup/step1`, {
                name: payload.Name,
                email: payload.Email,
                birth_date: payload.Birth_date,
                captcha_token: payload.Captcha_token,
            })
            return response.data
        },
        registerStep2: async (payload: verifyAccountPayload) => {
            const response = await $yapperApi.post(`${API_URL}/auth/signup/step2`, {
                email: payload.Email,
                token: payload.token,
            })
            return response.data
        },
        registerStep3: async (payload: finalizeRegisterPayload) => {
            const response = await $yapperApi.post(
                `${API_URL}/auth/signup/step3`,
                {
                    email: payload.Email,
                    password: payload.Password,
                    username: payload.Username,
                    language: payload.Language,
                },
                { withCredentials: true },
            )
            return response.data
        },
        resendOTP: async (Email: string) => {
            const response = await $yapperApi.post(`${API_URL}/auth/resend-otp`, {
                email: Email,
            })
            return response.data
        },
        forgotPassword: async (identifier: string) => {
            const response = await $yapperApi.post(`${API_URL}/auth/forget-password`, {
                identifier: identifier,
            })
            return response.data
        },
        verifyForgotPasswordOTP: async (identifier: string, otp: string) => {
            const response = await $yapperApi.post(`${API_URL}/auth/password/verify-otp`, {
                identifier: identifier,
                token: otp,
            })
            return response.data
        },
        resetPassword: async (identifier: string, newPassword: string, reset_token: string) => {
            const response = await $yapperApi.post(`${API_URL}/auth/reset-password`, {
                identifier: identifier,
                new_password: newPassword,
                reset_token: reset_token,
            })
            return response.data
        },
        OAuthCompleteStep1: async (OAuth_session_token: string, Birth_date: string) => {
            const response = await $yapperApi.post(
                `${API_URL}/auth/oauth/complete/step1`,
                {
                    oauth_session_token: OAuth_session_token,
                    birth_date: Birth_date,
                },
                { withCredentials: true },
            )
            return response.data
        },
        OAuthCompleteStep2: async (OAuth_session_token: string, Username: string) => {
            const response = await $yapperApi.post(
                `${API_URL}/auth/oauth/complete/step2`,
                {
                    oauth_session_token: OAuth_session_token,
                    username: Username,
                },
                { withCredentials: true },
            )
            return response.data
        },
        getUserData: async () => {
            const response = await $yapperApi.get(`${API_URL}/users/me`, { withCredentials: true })
            return response.data
        },
        logout: async () => {
            const response = await $yapperApi.post(
                `${API_URL}/auth/logout`,
                {},
                { withCredentials: true },
            )
            return response.data
        },
        GetAccessToken: async () => {
            const response = await $yapperApi.post(
                `${API_URL}/auth/refresh`,
                {},
                { withCredentials: true },
            )
            return response.data
        },
        ExchangeToken: async (exchange_token: string) => {
            const response = await $yapperApi.post(
                `${API_URL}/auth/exchange-token`,
                {
                    exchange_token: exchange_token,
                },
                { withCredentials: true },
            )
            return response.data
        },
        updateProfilePicture: async (profilePicture: File) => {
            const formData = new FormData()
            formData.append('file', profilePicture)
            const response = await $yapperApi.post(`${API_URL}/users/me/upload-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            })
            return response.data
        },
        updateUsername: async (username: string) => {
            const response = await $yapperApi.post(
                `${API_URL}/auth/update-username`,
                {
                    username: username,
                },
                { withCredentials: true },
            )
            return response.data
        },
        updateLanguage: async (language: string) => {
            const response = await $yapperApi.patch(
                `${API_URL}/users/me/change-language`,
                {
                    language: language,
                },
                { withCredentials: true },
            )
            return response.data
        },
        getInterests: async () => {
            const response = await $yapperApi.get(`${API_URL}/category`, { withCredentials: true })
            return response.data
        },
        updateInterests: async (categoryIds: number[]) => {
            const response = await $yapperApi.post(
                `${API_URL}/users/me/interests`,
                {
                    category_ids: categoryIds,
                },
                { withCredentials: true },
            )
            return response.data
        },
        updateProfile: async (image_url: string) => {
            console.log('inside updateProfile service')
            console.log('Updating profile with image_url:', image_url)
            const response = await $yapperApi.patch(
                `${API_URL}/users/me`,
                {
                    avatar_url: image_url,
                },
                { withCredentials: true },
            )
            return response.data
        },
    }
}

import axios from 'axios'
import { useNuxtApp } from 'nuxt/app'
import type {
    MutedAndBlockedListsApiResponse,
    ChangePasswordResponse,
    DeleteAccountResponse,
    ConfirmPasswordResponse,
    UpdateUsernameResponse,
    UsernameRecommendationsResponse,
    SendEmailOTPResponse,
    VerifyEmailOTPResponse,
} from '../types/settings'
export const settingsService = {
    async getMuted(cursor?: string): Promise<MutedAndBlockedListsApiResponse> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<MutedAndBlockedListsApiResponse>('/users/me/muted', {
                params: cursor ? { cursor } : {},
            })
            if (!response.data || !response.data.data || !response.data.data.data) {
                throw new Error('Muted users not found')
            }
            const myData = response.data.data.data
            console.log('Muted users', myData)
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('Muted users not found')
                }
            }
            throw new Error('Something went wrong')
        }
    },
    async getBlocked(cursor?: string): Promise<MutedAndBlockedListsApiResponse> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<MutedAndBlockedListsApiResponse>(
                '/users/me/blocked',
                {
                    params: cursor ? { cursor } : {},
                },
            )
            if (!response.data || !response.data.data) {
                throw new Error('Blocked users not found')
            }
            const myData = response.data.data
            console.log('Blocked users', myData)
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('Blocked users not found')
                }
            }
            throw new Error('Something went wrong')
        }
    },
    async changeLanguage(lang: 'en' | 'ar'): Promise<string> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.patch('/users/me/change-language', {
                language: lang,
            })

            return response.data?.message
        } catch (error: unknown) {
            if (axios.isAxiosError<{ error?: { message: string } }>(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                }
            }
            throw new Error('Something went wrong')
        }
    },
    async changePassword(
        oldPassword: string,
        newPassword: string,
    ): Promise<ChangePasswordResponse> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.post<ChangePasswordResponse>('/auth/change-password', {
                old_password: oldPassword,
                new_password: newPassword,
            })
            console.log('change password response', response.data)
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error(error.response.data?.message || 'Wrong password')
                } else if (error.response?.status === 400) {
                    throw new Error(error.response.data?.message || 'Invalid password format')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                }
            }
            throw new Error('Failed to change password. Please try again.')
        }
    },
    async deleteAccount(): Promise<DeleteAccountResponse> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.delete<DeleteAccountResponse>('/users/me/delete-account')
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                }
            }
            throw new Error('Failed to delete account. Please try again.')
        }
    },
    async confirmPassword(password: string): Promise<ConfirmPasswordResponse> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.post<ConfirmPasswordResponse>('/auth/confirm-password', {
                password,
            })
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status
                if (status === 403) throw new Error('WRONG_PASSWORD')
                if (status === 409) throw new Error('NO_PASSWORD_SET')
                if (status === 404) throw new Error('USER_NOT_FOUND')
            }
            throw new Error('UNKNOWN')
        }
    },
    async updateUsername(username: string): Promise<UpdateUsernameResponse> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.post<UpdateUsernameResponse>('/auth/update-username', {
                username,
            })
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 409) {
                    throw new Error('Username is already taken')
                } else if (error.response?.status === 400) {
                    throw new Error(error.response.data?.message || 'Invalid username format')
                }
            }
            throw new Error('Failed to update username. Please try again.')
        }
    },

    async getUsernameRecommendations(): Promise<UsernameRecommendationsResponse> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.get<UsernameRecommendationsResponse>(
                '/users/me/username-recommendations',
            )
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                }
            }
            throw new Error('Failed to get username recommendations. Please try again.')
        }
    },

    async sendEmailOTP(newEmail: string): Promise<SendEmailOTPResponse> {
        const { $axios } = useNuxtApp()
        console.log('newEmail in service: ', newEmail)
        try {
            const response = await $axios.post<SendEmailOTPResponse>('/auth/update-email', {
                new_email: newEmail,
            })

            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const backendMessage = error.response?.data?.message || error.response?.data?.error

                if (backendMessage) {
                    throw new Error(backendMessage)
                }
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                } else if (error.response?.status === 400) {
                    throw new Error('Email already exists')
                } else if (error.response?.status === 500) {
                    throw new Error('Failed to send OTP email')
                }
            }
            throw new Error('Failed to send verification code. Please try again.')
        }
    },

    async verifyEmailOTP(newEmail: string, otp: string): Promise<VerifyEmailOTPResponse> {
        const { $axios } = useNuxtApp()
        try {
            const response = await $axios.post<VerifyEmailOTPResponse>(
                '/auth/update-email/verify',
                {
                    new_email: newEmail,
                    otp,
                },
            )

            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const backendMessage = error.response?.data?.message || error.response?.data?.error

                if (backendMessage) {
                    throw new Error(backendMessage)
                }
                if (error.response?.status === 400) {
                    throw new Error('Invalid or expired OTP')
                } else if (error.response?.status === 401) {
                    throw new Error('Invalid or expired token')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                }
            }
            throw new Error('Failed to verify email. Please try again.')
        }
    },
}

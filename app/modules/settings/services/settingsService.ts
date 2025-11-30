import axios from 'axios'
import { useNuxtApp } from 'nuxt/app'
import type { MutedAndBlockedListsApiResponse, ChangePasswordResponse, DeleteAccountResponse, ConfirmPasswordResponse } from '../types/settings'
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
                console.log('dsdlfkjsijgks', error.response?.data.message)
                if (error.response?.status === 401) {
                    const message = error.response.data?.message || ''
                    if (
                        message.includes(
                            'User registered with social login. Please use social login to access your account',
                        )
                    ) {
                        console.log('lsfjjskfherror')
                        throw new Error('NO_PASSWORD_SET')
                    }
                    throw new Error('Wrong password')
                } else if (error.response?.status === 404) {
                    throw new Error('User not found')
                }
            }
            throw new Error('Failed to confirm password. Please try again.')
        }
    },
}

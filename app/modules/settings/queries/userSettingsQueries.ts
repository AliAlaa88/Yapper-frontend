import { useMutation, useInfiniteQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import { useI18n } from 'vue-i18n'

export function userSettingsQueries() {
    const { $settingsService } = useNuxtApp()
    const { locale } = useI18n()

    const myMutedUsersQuery = useInfiniteQuery({
        queryKey: ['muted-users'],
        queryFn: async ({pageParam}) => {
            console.log('fetching muted users with cursor:', pageParam)
            const result =  await $settingsService.getMuted(pageParam)
            console.log('query result:', result)
            return result
        },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.data.pagination.has_more ?
                lastPage.data.pagination.next_cursor : undefined
        },
    })
    const myBlockedUsersQuery = useInfiniteQuery({
        queryKey: ['blocked-users'],
        queryFn:
            async ({ pageParam }) => {
                console.log('fetching blocked users with cursor:', pageParam)
                const result = await $settingsService.getBlocked(pageParam)
                console.log('query result:', result)
                return result
            },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            console.log('has_more', lastPage.data.pagination.has_more)
            return lastPage.data.pagination.has_more
                ? lastPage.data.pagination.next_cursor
                : undefined
        },
    })

    const useChangeLanguage = useMutation({
        mutationFn: ({ language }: { language: 'en' | 'ar' }) => $settingsService.changeLanguage(language),
        onSuccess: (data, variables) => {
            locale.value = variables.language
            console.log('Language changed successfully:', data)
        },
        onError: (error: Error) => {
            console.error('Failed to change language:', error)
        },
    })

    const useChangePassword = useMutation({
        mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
            $settingsService.changePassword(oldPassword, newPassword),
        onSuccess: (data) => {
            console.log('Password changed successfully:', data)
        },
        onError: (error: Error) => {
            console.error('Failed to change password:', error.message)
        },
    })

    const useConfirmPassword = useMutation({
        mutationFn: ({ password }: { password: string }) =>
            $settingsService.confirmPassword(password),
        onSuccess: (data) => {
            console.log('Password confirmed:', data)
        },
        onError: (error: Error) => {
            console.error('Failed to confirm password:', error.message)
        },
    })

    const useDeleteAccount = useMutation({
        mutationFn: () => $settingsService.deleteAccount(),
        onSuccess: (data) => {
            console.log('Account deleted successfully:', data)
            if (import.meta.client) {
                const accessToken = useCookie('access_token')
                accessToken.value = null

                setTimeout(() => {
                    window.location.href = '/auth/'
                }, 1000)
            }
        },
        onError: (error: Error) => {
            console.error('Failed to delete account:', error.message)
        },
    })
    return {
        myMutedUsersQuery,
        myBlockedUsersQuery,
        useChangeLanguage,
        useChangePassword,
        useConfirmPassword,
        useDeleteAccount,
    }
}

import { useQuery, useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import type { OtherUser } from '~/modules/profile/types/user'

export function userSettingsQueries() {
    const { $settingsService } = useNuxtApp()
    const { locale } = useI18n()

    const myMutedUsersQuery = useQuery<OtherUser[]>({
        queryKey: ['myMutedUsers'],
        queryFn: async () => {
            console.log('Querying muted users...')
            const res = await $settingsService.getMuted()
            console.log('Muted query result:', res)
            return res
        },
    })
    const myBlockedUsersQuery = useQuery<OtherUser[]>({
        queryKey: ['myBlockedUsers'],
        queryFn: () => $settingsService.getBlocked(),
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

    return {
        myMutedUsersQuery,
        myBlockedUsersQuery,
        useChangeLanguage,
    }
}

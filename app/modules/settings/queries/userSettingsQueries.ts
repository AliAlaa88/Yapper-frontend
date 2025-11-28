import { useQuery, useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import type { OtherUser } from '~/modules/profile/types/user'
import { cacheInvalidation } from '~/modules/Common/queries/cacheInvalidation'

export function userSettingsQueries() {
    const { $settingsService, $queryClient } = useNuxtApp()
    const { locale } = useI18n()

    const myMutedUsersQuery = useQuery<OtherUser[]>({
        queryKey: ['myMutedUsers'],
        queryFn: async () => {
            const res = await $settingsService.getMuted()
            return res
        },
    })
    const myBlockedUsersQuery = useQuery<OtherUser[]>({
        queryKey: ['myBlockedUsers'],
        queryFn: () => $settingsService.getBlocked(),
    })

    const useChangeLanguage = useMutation({
        mutationFn: ({ language }: { language: 'en' | 'ar' }) =>
            $settingsService.changeLanguage(language),
        onSuccess: (data, variables) => {
            locale.value = variables.language
            console.log('Language changed successfully:', data)
            // Invalidate me query to reflect language change
            $queryClient.invalidateQueries({ queryKey: ['me'] })
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

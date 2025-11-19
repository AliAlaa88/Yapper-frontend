import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { OtherUser } from '~/modules/profile/types/user'

export function userSettingsQueries() {
    const { $settingsService } = useNuxtApp()

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

    return {
        myMutedUsersQuery,
        myBlockedUsersQuery,
    }
}

import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { OtherUser } from '../types/user'

export function useOtherUserQuery(username: string) {
    const { $userInfoService } = useNuxtApp()

    const userQuery = useQuery<OtherUser>({
        queryKey: ['user', username],
        queryFn: () => $userInfoService.getUserInfoByUsername(username),
        enabled: !!username,
    })

    return userQuery
}

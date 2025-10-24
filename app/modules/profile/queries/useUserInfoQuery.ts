import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import type { UserAction } from '../types/user'

export function useUserInfoQuery(username: string) {
    const { $userInfoService } = useNuxtApp()
    return useQuery<UserAction>({
        queryKey: ['user', username],
        queryFn: () => $userInfoService.getUserInfoByUsername(username),
        enabled: !!username,
    })
}

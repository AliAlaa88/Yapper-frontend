import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import type { User } from '../types/user'

export function useUserInfoQuery(username: string) {
    const { $userInfoService } = useNuxtApp()
    return useQuery<User>({
        queryKey: ['user', username],
        queryFn: () => $userInfoService.getUserInfoByUsername(username),
        enabled: !!username,
    })
}

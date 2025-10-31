import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { OtherUser, Me } from '../types/user'

export function useUserInfoQuery(username: string) {
    const { $userInfoService } = useNuxtApp()

    const userQuery = useQuery<OtherUser>({
        queryKey: ['user', username],
        queryFn: () => $userInfoService.getUserInfoByUsername(username),
        enabled: !!username,
    })

    const myQuery = useQuery<Me>({
        queryKey: ['me'],
        queryFn: () => $userInfoService.getMe(),
    })

    return {
        userQuery,
        myQuery,
    }
}

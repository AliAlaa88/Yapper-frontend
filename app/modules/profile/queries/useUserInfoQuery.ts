import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { UserAction, User } from '../types/user'

export function useUserInfoQuery(username: string) {
    const { $userInfoService } = useNuxtApp()
    const userQuery = useQuery<UserAction>({
        queryKey: ['user', username],
        queryFn: () => $userInfoService.getUserInfoByUsername(username),
        enabled: !!username,
    })

    const myQuery = useQuery<User>({
        queryKey: ['me'],
        queryFn: () => $userInfoService.getMe(),
    })

    return {
        userQuery,
        myQuery,
    }
}

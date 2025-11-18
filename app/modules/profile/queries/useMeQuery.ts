import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Me } from '../types/user'

export function useMeQuery() {
    const { $userInfoService } = useNuxtApp()

    const meQuery = useQuery<Me>({
        queryKey: ['me'],
        queryFn: () => $userInfoService.getMe(),
    })

    return meQuery
}

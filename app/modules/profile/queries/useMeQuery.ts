import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { Me } from '../types/user'
import { type Ref, ref } from 'vue'

export function useMeQuery(enabled: Ref<boolean> = ref(true)) {
    const { $userInfoService } = useNuxtApp()

    const meQuery = useQuery<Me>({
        queryKey: ['me'],
        queryFn: () => $userInfoService.getMe(),
        enabled,
        refetchOnWindowFocus: true,
        staleTime: 0,
        retry: 1,
    })

    return meQuery
}

import { useQuery } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'
import type { OtherUser } from '../types/user'
import { type Ref, unref, computed } from 'vue'

export function useOtherUserQuery(username: Ref<string> | string, enabled: Ref<boolean> = computed(() => !!unref(username))) {
    const { $userInfoService } = useNuxtApp()

    const userQuery = useQuery<OtherUser>({
        queryKey: ['user', username],
        queryFn: () => $userInfoService.getUserInfoByUsername(unref(username)),
        enabled,
    })

    return userQuery
}

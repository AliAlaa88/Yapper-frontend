import { computed, type Ref } from 'vue'
import { useGenericInfiniteQuery } from '~/modules/Common/composables/useGenericInfiniteQuery'
import type { FollowUser, FollowUsersPage } from '../types/user'

export function useFollowersInfiniteQuery(userId: Ref<string>, mutual: boolean) {
    const { $userInfoService } = useNuxtApp()

    return useGenericInfiniteQuery<FollowUsersPage, FollowUser>({
        queryKey: computed(() => ['followers', userId.value, mutual] as const),
        queryFn: ({ pageParam }) =>
            ($userInfoService as any).getFollowers(userId.value, mutual, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        getPageData: (page) => page.data,
        enabled: computed(() => !!userId.value),
    })
}

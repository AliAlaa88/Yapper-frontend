import { computed, type Ref } from 'vue'
import { useGenericInfiniteQuery } from '~/modules/Common/composables/useGenericInfiniteQuery'
import type { FollowUser, FollowUsersPage } from '../types/user'

export function useFollowingInfiniteQuery(userId: Ref<string>) {
    const { $userInfoService } = useNuxtApp()

    return useGenericInfiniteQuery<FollowUsersPage, FollowUser>({
        queryKey: computed(() => ['following', userId.value] as const),
        queryFn: ({ pageParam }) =>
            ($userInfoService as any).getFollowing(userId.value, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        getPageData: (page) => page.data,
        enabled: computed(() => !!userId.value),
    })
}

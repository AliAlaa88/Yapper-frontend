import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import type { FollowUser } from '../types/user'

export const useFollowListsQuery = (userId: Ref<string>) => {
    const { $userInfoService } = useNuxtApp()

    const followersQuery = useQuery<FollowUser[], Error>({
        queryKey: ['followers', userId] as const,
        queryFn: () => $userInfoService.getFollowers(userId.value),
        enabled: computed(() => !!userId.value),
    })

    const followingQuery = useQuery<FollowUser[], Error>({
        queryKey: ['following', userId] as const,
        queryFn: () => $userInfoService.getFollowing(userId.value),
        enabled: computed(() => !!userId.value),
    })

    return {
        followersQuery,
        followingQuery,
    }
}

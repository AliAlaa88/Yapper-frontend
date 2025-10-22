import { useUserActionsQuery } from '~/modules/profile/queries/useUserActionsQuery'

export function useUserInfo(userId: string) {

    const { userQuery } = useUserActionsQuery(userId)

    const user = userQuery.data
    const isFollower = computed(() => user.value?.is_follower ?? false)
    const isFollowing = computed(() => user.value?.is_following ?? false)
    const isBlocked = computed(() => user.value?.is_blocked ?? false)
    const isMuted = computed(() => user.value?.is_muted ?? false)
    const username = computed(() => user.value?.username ?? '')

    return {
        isFollower,
        isFollowing,
        isBlocked,
        isMuted,
        username,
    }
}

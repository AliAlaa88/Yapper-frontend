import { useUserActionsQuery } from '../queries/useUserActionsQuery'
import { computed, ref } from 'vue'
export function useUserInfo(
    userId: Ref<string | undefined>,
    userName: Ref<string | undefined> = ref(undefined),
    meId: Ref<string | undefined> = ref(undefined),
    enabled: Ref<boolean> = ref(true),
) {
    const { userQuery } = useUserActionsQuery(userId, userName, meId, enabled)

    const user = userQuery.data
    const id = computed(() => user.value?.user_id ?? '')
    const username = computed(() => user.value?.username ?? '')
    const isFollower = computed(() => user.value?.is_follower ?? false)
    const isFollowing = computed(() => user.value?.is_following ?? false)
    const isBlocked = computed(() => user.value?.is_blocked ?? false)
    const isMuted = computed(() => user.value?.is_muted ?? false)
    const name = computed(() => user.value?.name ?? '')
    const bio = computed(() => user.value?.bio ?? '')
    const avatarUrl = computed(() => user.value?.avatar_url ?? '')
    const followersCount = computed(() => user.value?.followers_count ?? '')
    const followingCount = computed(() => user.value?.following_count ?? '')
    const coverUrl = computed(() => user.value?.cover_url ?? '')

    return {
        id,
        isFollower,
        isFollowing,
        isBlocked,
        isMuted,
        username,
        name,
        bio,
        avatarUrl,
        followersCount,
        followingCount,
        coverUrl,
    }
}

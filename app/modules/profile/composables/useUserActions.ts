import { useUserActionsQuery } from '../queries/useUserActionsQuery'
import { ref } from 'vue'

export function useUserActions(
    userId: Ref<string | undefined>,
    targetUsername?: Ref<string | undefined>,
    currentUserId?: Ref<string | undefined>,
    enabled: Ref<boolean> = ref(true),
) {
    const {
        unfollowMutation,
        blockMutation,
        unblockMutation,
        muteMutation,
        unmuteMutation,
        removeFollowerMutation,
        followMutation,
    } = useUserActionsQuery(userId, targetUsername, currentUserId, enabled)

    const isUnfollowLoading = computed(() => unfollowMutation.isPending.value)
    const isBlockLoading = computed(() => blockMutation.isPending.value)
    const isUnblockLoading = computed(() => unblockMutation.isPending.value)
    const isMuteLoading = computed(() => muteMutation.isPending.value)
    const isUnmuteLoading = computed(() => unmuteMutation.isPending.value)
    const isRemoveFollowerLoading = computed(() => removeFollowerMutation.isPending.value)
    const isFollowLoading = computed(() => followMutation.isPending.value)

    async function handleUnmute() {
        console.log('unmute user')
        await unmuteMutation.mutateAsync()
    }

    async function handleMute() {
        console.log('mute user')
        await muteMutation.mutateAsync()
    }

    async function handleBlock() {
        console.log('block user')
        await blockMutation.mutateAsync()
        console.log('after block user')
    }

    async function handleUnblock() {
        console.log('unblock user')
        await unblockMutation.mutateAsync()
    }

    async function handleRemoveFollower() {
        console.log('remove this follower')
        await removeFollowerMutation.mutateAsync()
    }

    async function handleUnfollow() {
        console.log('unfollow')
        await unfollowMutation.mutateAsync()
    }

    async function handleFollow() {
        console.log('follow')
        await followMutation.mutateAsync()
    }

    return {
        handleUnmute,
        handleMute,
        handleBlock,
        handleUnblock,
        handleRemoveFollower,
        handleUnfollow,
        handleFollow,
        isUnfollowLoading,
        isBlockLoading,
        isUnblockLoading,
        isMuteLoading,
        isUnmuteLoading,
        isRemoveFollowerLoading,
        isFollowLoading,
    }
}

import { useUserActionsQuery } from '../queries/useUserActionsQuery'
// import { ref, computed } from 'vue'

export function useUserActions(
    userId: Ref<string | undefined>,
    targetUsername?: Ref<string | undefined>,
    currentUserId?: Ref<string | undefined>
) {
    const {
        unfollowMutation,
        blockMutation,
        unblockMutation,
        muteMutation,
        unmuteMutation,
        removeFollowerMutation,
        followMutation,
    } = useUserActionsQuery(userId, targetUsername, currentUserId)

    const isUnfollowLoading = computed(() => unfollowMutation.isPending.value)
    const isBlockLoading = computed(() => blockMutation.isPending.value)
    const isUnblockLoading = computed(() => unblockMutation.isPending.value)
    const isMuteLoading = computed(() => muteMutation.isPending.value)
    const isUnmuteLoading = computed(() => unmuteMutation.isPending.value)
    const isRemoveFollowerLoading = computed(() => removeFollowerMutation.isPending.value)
    const isFollowLoading = computed(() => followMutation.isPending.value)

    // const isActionPending = computed(
    //     () =>
    //         unfollowMutation.isPending.value ||
    //         blockMutation.isPending.value ||
    //         unblockMutation.isPending.value ||
    //         muteMutation.isPending.value ||
    //         unmuteMutation.isPending.value ||
    //         removeFollowerMutation.isPending.value ||
    //         followMutation.isPending.value,
    // )
    // const actionLock = ref(false)
    // const lastActionTime = ref(0)
    // const MIN_ACTION_INTERVAL = 1200

    // async function handleAction(action: () => Promise<unknown>) {
    //     const now = Date.now()
    //     if (actionLock.value) {
    //         console.log('Action blocked: lock active')
    //         return
    //     }

    //     if (isActionPending.value) {
    //         console.log('Action blocked: mutation pending')
    //         return
    //     }

    //     if (now - lastActionTime.value < MIN_ACTION_INTERVAL) {
    //         console.log(`Action blocked: ${MIN_ACTION_INTERVAL}ms cooldown`)
    //         return
    //     }

    //     actionLock.value = true
    //     lastActionTime.value = now

    //     try {
    //         await action()
    //         await new Promise((resolve) => setTimeout(resolve, 300))
    //     } catch (error) {
    //         if (error instanceof Error && error.message.includes('Already')) {
    //             console.log('Action already completed:', error.message)
    //             await new Promise((resolve) => setTimeout(resolve, 200))
    //         } else {
    //             throw error
    //         }
    //     } finally {
    //         actionLock.value = false
    //     }
    // }

    async function handleUnmute() {
        console.log('unmute user')
        // await handleAction(() => unmuteMutation.mutateAsync())
        await unmuteMutation.mutateAsync()
    }

    async function handleMute() {
        console.log('mute user')
        await muteMutation.mutateAsync()
        // await handleAction(() => muteMutation.mutateAsync())
    }

    async function handleBlock() {
        console.log('block user')
        // await handleAction(() => blockMutation.mutateAsync())
        await blockMutation.mutateAsync()
        console.log('after block user')
    }

    async function handleUnblock() {
        console.log('unblock user')
        await unblockMutation.mutateAsync()
        // await handleAction(() => unblockMutation.mutateAsync())
    }

    async function handleRemoveFollower() {
        console.log('remove this follower')
        await removeFollowerMutation.mutateAsync()
        // await handleAction(() => removeFollowerMutation.mutateAsync())
    }

    async function handleUnfollow() {
        console.log('unfollow')
        await unfollowMutation.mutateAsync()
        // await handleAction(() => unfollowMutation.mutateAsync())
    }

    async function handleFollow() {
        console.log('follow')
        await followMutation.mutateAsync()
        // await handleAction(() => followMutation.mutateAsync())
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

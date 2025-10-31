import { useUserActionsQuery } from '~/modules/profile/queries/useUserActionsQuery'

export function useUserActions(userId: Ref<string | undefined>) {
    const {
        unfollowMutation,
        blockMutation,
        unblockMutation,
        muteMutation,
        unmuteMutation,
        removeFollowerMutation,
        followMutation,
    } = useUserActionsQuery(userId)

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
    }
}

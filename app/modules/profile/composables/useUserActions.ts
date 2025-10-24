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

    function handleUnmute() {
        console.log('unmute user')
        unmuteMutation.mutate()
    }
    function handleMute() {
        console.log('mute user')
        muteMutation.mutate()
    }
    function handleBlock() {
        console.log('block user')
        blockMutation.mutate()
        console.log('after block user')
    }
    function handleUnblock() {
        console.log('unblock user')
        unblockMutation.mutate()
    }
    function handleRemoveFollower() {
        console.log('remove this follower')
        removeFollowerMutation.mutate()
    }

    function handleUnfollow() {
        console.log('unfollow')
        unfollowMutation.mutate()
    }

    function handleFollow() {
        console.log('follow')
        followMutation.mutate()
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

import { useUserActionsQuery } from '~/modules/profile/queries/useUserActionsQuery'


export function useUserActions(userId: string) {
    const { blockMutation, unblockMutation, muteMutation, unmuteMutation, removeFollowerMutation } =
        useUserActionsQuery(userId)

    function handleUnmute() {
        console.log('mute user')
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

    return {
        handleUnmute,
        handleMute,
        handleBlock,
        handleUnblock,
        handleRemoveFollower,
    }
}

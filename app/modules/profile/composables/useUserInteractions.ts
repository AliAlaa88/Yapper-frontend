import { useUserActions } from './useUserActions'
import type { useConfirmation } from './useConfirmation'
import type { useSnackbar } from './useSnackbar'
import { useUserInfo } from './useUserInfo'


export function useUserInteractions(userId: Ref<string | undefined>) {
    const { showSnackbar, handleShowSnackbar } = inject('snackbar') as ReturnType<
        typeof useSnackbar
    >
    const { showConfirmation, handleShowConfirmation } = inject('confirmation') as ReturnType<
        typeof useConfirmation
    >
    const { id, username } = useUserInfo(userId)
    const {
        handleUnfollow,
        handleUnmute,
        handleMute,
        handleBlock,
        handleUnblock,
        handleRemoveFollower,
        handleFollow,
    } = useUserActions(id)

    function handleBlockWithConfirmation(showList?: Ref<boolean>) {
        showConfirmation.value = true
        if (showList) showList.value = false
        function handleClick() {
            handleBlock()
            handleShowSnackbar('Successfully blocked.', '', 'Unblock', handleUnblock)
        }
        handleShowConfirmation(
            'Block',
            'Block',
            'bg-red-500',
            'text-white',
            'hover:bg-red-500/85',
            `They will be able to see your public posts,
            but will no longer be able to engage with them.
            @${username.value} will also not be able to follow or message you,
            and you will not see notifications from them. `,
            handleClick,
            username.value,
        )
    }

    function handleUnfollowWithConfirmation() {
        showConfirmation.value = true
        handleShowConfirmation(
            'Unfollow',
            'Unfollow',
            'bg-[#ebf1f1]',
            'text-black',
            'hover:bg-gray-200/90',
            'Their posts will no longer show up in your Following timeline. You can still view their profile, unless their posts are protected.',
            handleUnfollow,
            username.value,
        )
    }

    function handleFollowAction() {
        handleFollow()
    }

    function handleMuteWithSnackbar(showList?: Ref<boolean>) {
        console.log('hagarrrr')
        handleMute()
        showSnackbar.value = true
        if (showList) showList.value = false
        handleShowSnackbar(' has been muted.', username.value, 'Undo', handleUnmuteWithSnackbar)
        console.log('snack', showSnackbar.value)
    }

    function handleRemoveFollowerWithConfirmation(showList?: Ref<boolean>) {
        showConfirmation.value = true
        if (showList) showList.value = false
        function handleClick() {
            handleRemoveFollower()
            handleShowSnackbar(' is no longer following you.', username.value)
        }
        handleShowConfirmation(
            'Remove',
            'Remove this follower',
            'bg-red-500',
            'text-white',
            'hover:bg-red-500/85',
            `@${username.value} will be removed from
            your followers and won’t be notified by Yappper.
            They can follow you again in the future. `,
            handleClick,
        )
    }

    function handleUnblockWithConfirmation(showList?: Ref<boolean>) {
        showConfirmation.value = true
        if(showList) showList.value = false
        handleShowConfirmation(
            'Unblock',
            'Unblock',
            'bg-[#ebf1f1]',
            'text-black',
            'hover:bg-gray-200/90',
            'They will be able to follow you and engage with your public posts.',
            handleUnblock,
            username.value,
        )
    }

    function handleUnmuteWithConfirmation() {
        showConfirmation.value = true
        handleShowConfirmation(
            'UnMute',
            'UnMute',
            'bg-[#ebf1f1]',
            'text-black',
            'hover:bg-gray-200/90',
            'Posts from this account will now be allowed in your Home timeline. ',
            handleUnmuteWithSnackbar,
            username.value,
        )
    }

    function handleUnmuteWithSnackbar(showList?: Ref<boolean>) {
        console.log('ununun')
        handleUnmute()
        if (showList) showList.value = false
        handleShowSnackbar(' has been unmuted.', username.value)
    }

    return {
        handleBlockWithConfirmation,
        handleMuteWithSnackbar,
        handleRemoveFollowerWithConfirmation,
        handleUnblockWithConfirmation,
        handleUnmuteWithConfirmation,
        handleUnmuteWithSnackbar,
        handleUnfollowWithConfirmation,
        handleFollowAction,
    }
}

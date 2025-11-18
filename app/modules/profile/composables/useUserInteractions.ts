import { useUserActions } from './useUserActions'
import type { useConfirmation } from './useConfirmation'
import type { useSnackbar } from './useSnackbar'
import { useUserInfo } from './useUserInfo'
import { inject } from 'vue'

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
        isUnfollowLoading,
        isBlockLoading,
        isUnblockLoading,
        isMuteLoading,
        isUnmuteLoading,
        isRemoveFollowerLoading,
        isFollowLoading,
    } = useUserActions(id)

    function handleBlockWithConfirmation(showList?: Ref<boolean>) {
        showConfirmation.value = true
        if (showList) showList.value = false
        async function handleClick() {
            try {
                await handleBlock()
                handleShowSnackbar('Successfully blocked.', '', 'Unblock', handleUnblock)
            } catch (error) {
                console.error('failed to block user: ', error)
            }
        }
        handleShowConfirmation(
            'Block',
            'Block',
            'bg-red',
            'text-primary',
            'hover:opacity-90',
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
            'bg-alternate',
            'text-alternate',
            'hover:opacity-90',
            'Their posts will no longer show up in your Following timeline. You can still view their profile, unless their posts are protected.',
            handleUnfollow,
            username.value,
        )
    }

    async function handleFollowAction() {
        try {
            await handleFollow()
        } catch (error) {
            console.error('Failed to follow:', error)
        }
    }

    async function handleMuteWithSnackbar(showList?: Ref<boolean>) {
        try {
            await handleMute()
            showSnackbar.value = true
            handleShowSnackbar(' has been muted.', username.value, 'Undo', handleUnmuteWithSnackbar)
        } catch (error) {
            console.error('failed to mute: ', error)
        }
        if (showList) showList.value = false
    }

    function handleRemoveFollowerWithConfirmation(showList?: Ref<boolean>) {
        showConfirmation.value = true
        if (showList) showList.value = false
        async function handleClick() {
            try {
                await handleRemoveFollower()
                handleShowSnackbar(' is no longer following you.', username.value)
            } catch (error) {
                console.error('failed to remove follower: ', error)
            }
        }
        handleShowConfirmation(
            'Remove',
            'Remove this follower',
            'bg-red',
            'text-primary',
            'hover:opacity-90',
            `@${username.value} will be removed from
            your followers and won’t be notified by Yappper.
            They can follow you again in the future. `,
            handleClick,
        )
    }

    function handleUnblockWithConfirmation(showList?: Ref<boolean>) {
        showConfirmation.value = true
        if (showList) showList.value = false
        handleShowConfirmation(
            'Unblock',
            'Unblock',
            'bg-alternate',
            'text-alternate',
            'hover:opacity-90',
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
            'bg-alternate',
            'text-alternate',
            'hover:opacity-90',
            'Posts from this account will now be allowed in your Home timeline. ',
            handleUnmuteWithSnackbar,
            username.value,
        )
    }

    async function handleUnmuteWithSnackbar(showList?: Ref<boolean>) {
        try {
            await handleUnmute()
            showSnackbar.value = true
            handleShowSnackbar(' has been unmuted.', username.value)
        } catch (error) {
            console.error('failed to unmute: ', error)
        }
        if (showList) showList.value = false
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
        isUnfollowLoading,
        isBlockLoading,
        isUnblockLoading,
        isMuteLoading,
        isUnmuteLoading,
        isRemoveFollowerLoading,
        isFollowLoading,
    }
}

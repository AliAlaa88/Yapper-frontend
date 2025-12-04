import { useUserActions } from './useUserActions'
import type { useConfirmation } from './useConfirmation'
import type { useSnackbar } from './useSnackbar'
import { useUserInfo } from './useUserInfo'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUserInteractions(userId: Ref<string | undefined>, enabled: Ref<boolean> = ref(true)) {
    const { showSnackbar, handleShowSnackbar } = inject('snackbar') as ReturnType<
        typeof useSnackbar
    >
    const { showConfirmation, handleShowConfirmation } = inject('confirmation') as ReturnType<
        typeof useConfirmation
    >
    const { id, username } = useUserInfo(userId, enabled)
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
    } = useUserActions(id, enabled)
    const { t } = useI18n()

    function handleBlockWithConfirmation(showList?: Ref<boolean>, onSuccess?: () => void) {
        showConfirmation.value = true
        if (showList) showList.value = false
        async function handleClick() {
            try {
                await handleBlock()
                handleShowSnackbar(
                    t('profile.actions.block.snackbar'),
                    '',
                    t('profile.actions.block.undoButton'),
                    handleUnblock,
                )
                // Call the success callback after the action completes
                if (onSuccess) onSuccess()
            } catch (error) {
                console.error('failed to block user: ', error)
            }
        }
        handleShowConfirmation(
            t('profile.actions.block.title'),
            t('profile.actions.block.button'),
            'bg-red',
            'text-primary',
            'hover:opacity-90',
            t('profile.actions.block.description', { username: '@' + username.value }),
            handleClick,
            username.value,
        )
    }

    function handleUnfollowWithConfirmation() {
        showConfirmation.value = true
        handleShowConfirmation(
            t('profile.actions.unfollow.title'),
            t('profile.actions.unfollow.button'),
            'bg-alternate',
            'text-alternate',
            'hover:opacity-90',
            t('profile.actions.unfollow.description'),
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
            handleShowSnackbar(
                t('profile.actions.mute.snackbar', { username: '@' + username.value }),
                '',
                t('profile.actions.mute.undoButton'),
                handleUnmuteWithSnackbar,
            )
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
                handleShowSnackbar(
                    t('profile.actions.removeFollower.snackbar', { username: '@' + username.value }),
                )
            } catch (error) {
                console.error('failed to remove follower: ', error)
            }
        }
        handleShowConfirmation(
            t('profile.actions.removeFollower.title'),
            t('profile.actions.removeFollower.button'),
            'bg-red',
            'text-primary',
            'hover:opacity-90',
            t('profile.actions.removeFollower.description', { username: '@' + username.value }),
            handleClick,
        )
    }

    function handleUnblockWithConfirmation(showList?: Ref<boolean>, onSuccess?: () => void) {
        showConfirmation.value = true
        if (showList) showList.value = false
        async function handleClick() {
            try {
                await handleUnblock()
                // Call the success callback after the action completes
                if (onSuccess) onSuccess()
            } catch (error) {
                console.error('failed to unblock user: ', error)
            }
        }
        handleShowConfirmation(
            t('profile.actions.unblock.title'),
            t('profile.actions.unblock.button'),
            'bg-alternate',
            'text-alternate',
            'hover:opacity-90',
            t('profile.actions.unblock.description'),
            handleClick,
            username.value,
        )
    }

    function handleUnmuteWithConfirmation() {
        showConfirmation.value = true
        handleShowConfirmation(
            t('profile.actions.unmute.title'),
            t('profile.actions.unmute.button'),
            'bg-alternate',
            'text-alternate',
            'hover:opacity-90',
            t('profile.actions.unmute.description'),
            handleUnmuteWithSnackbar,
            username.value,
        )
    }

    async function handleUnmuteWithSnackbar(showList?: Ref<boolean>) {
        try {
            await handleUnmute()
            showSnackbar.value = true
            handleShowSnackbar(t('profile.actions.unmute.snackbar', { username: '@' + username.value }))
        } catch (error) {
            console.error('failed to unmute: ', error)
        }
        if (showList) showList.value = false
    }

    async function handleFolloweWithSnackbar(showList?: Ref<boolean>) {
        try {
            await handleFollow()
            showSnackbar.value = true
            handleShowSnackbar(t('profile.actions.follow.snackbar', { username: '@' + username.value }))
        } catch (error) {
            console.error('failed to follow: ', error)
        }
        if (showList) showList.value = false
    }

    async function handleUnfollowWithSnackbar(showList?: Ref<boolean>) {
        try {
            await handleUnfollow()
            showSnackbar.value = true
            handleShowSnackbar(t('profile.actions.unfollow.snackbar', { username: '@' + username.value }))
        } catch (error) {
            console.error('failed to unfollow: ', error)
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
        handleFolloweWithSnackbar,
        handleUnfollowWithSnackbar,
        isUnfollowLoading,
        isBlockLoading,
        isUnblockLoading,
        isMuteLoading,
        isUnmuteLoading,
        isRemoveFollowerLoading,
        isFollowLoading,
    }
}

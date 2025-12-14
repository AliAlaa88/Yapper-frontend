import { cacheInvalidation } from '~/modules/Common/queries/cacheInvalidation'
import { useUserActions } from './useUserActions'
import type { useConfirmation } from './useConfirmation'
import type { useSnackbar } from './useSnackbar'
import { useUserInfo } from './useUserInfo'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { queryKeys } from '~/modules/Common/queries/queryKeys'

export function useUserInteractions(userId: Ref<string | undefined>, userName: Ref<string | undefined>, meId: Ref<string | undefined>, enabled: Ref<boolean> = ref(true)) {
    const { $queryClient } = useNuxtApp()
    const { showSnackbar, handleShowSnackbar } = inject('snackbar') as ReturnType<
        typeof useSnackbar
    >
    const { showConfirmation, handleShowConfirmation } = inject('confirmation') as ReturnType<
        typeof useConfirmation
    >
    const { id, username } = useUserInfo(userId, userName, meId, enabled)
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
    } = useUserActions(id, username, meId, enabled)
    const { t } = useI18n()

    function handleBlockWithConfirmation(showList?: Ref<boolean>, onSuccess?: () => void) {
        showConfirmation.value = true
        if (showList) showList.value = false
        async function handleClick() {
            try {
                await handleBlock()
                $queryClient.invalidateQueries({ queryKey: queryKeys.settings.blockedUsers() })
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

    async function handleBlockWithSnackbar() {
        try {
            await handleBlock()
            if (userId.value)
                cacheInvalidation.toggleBlockedInCache($queryClient, userId.value, true)
            showSnackbar.value = true
            handleShowSnackbar(t('profile.actions.block.snackbar'), '')
        } catch (error) {
            console.error('failed to block: ', error)
        }
    }

    async function handleUnblockWithSnackbar() {
        try {
            await handleUnblock()
            if (userId.value)
                cacheInvalidation.toggleBlockedInCache($queryClient, userId.value, false)
            showSnackbar.value = true
            handleShowSnackbar(t('profile.actions.unblock.snackbar'), '')
        } catch (error) {
            console.error('failed to unblock: ', error)
        }
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

    async function handleMuteWithSnackbarWithAction(showList?: Ref<boolean>) {
        try {
            await handleMute()
            $queryClient.invalidateQueries({ queryKey: queryKeys.settings.mutedUsers() })
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

    async function handleMuteWithSnackbar(showList?: Ref<boolean>) {
        try {
            await handleMute()
            if(userId.value) cacheInvalidation.toggleMutedInCache($queryClient, userId.value, true)
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
                    t('profile.actions.removeFollower.snackbar', {
                        username: '@' + username.value,
                    }),
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
                $queryClient.invalidateQueries({ queryKey: queryKeys.settings.blockedUsers() })
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

    async function handleUnmuteWithSnackbar(fromList: boolean = false, showList?: Ref<boolean>) {
        try {
            await handleUnmute()
            if (fromList && userId.value)
                cacheInvalidation.toggleMutedInCache($queryClient, userId.value, false)
            else $queryClient.invalidateQueries({ queryKey: queryKeys.settings.mutedUsers() })
            showSnackbar.value = true
            handleShowSnackbar(
                t('profile.actions.unmute.snackbar', { username: '@' + username.value }),
            )
        } catch (error) {
            console.error('failed to unmute: ', error)
        }
        if (showList) showList.value = false
    }

    async function handleFolloweWithSnackbar(showList?: Ref<boolean>) {
        try {
            await handleFollow()
            showSnackbar.value = true
            handleShowSnackbar(
                t('profile.actions.follow.snackbar', { username: '@' + username.value }),
            )
        } catch (error) {
            console.error('failed to follow: ', error)
        }
        if (showList) showList.value = false
    }

    async function handleUnfollowWithSnackbar(showList?: Ref<boolean>) {
        try {
            await handleUnfollow()
            showSnackbar.value = true
            handleShowSnackbar(
                t('profile.actions.unfollow.snackbar', { username: '@' + username.value }),
            )
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
        handleBlockWithSnackbar,
        handleUnblockWithSnackbar,
        handleMuteWithSnackbarWithAction,
        isUnfollowLoading,
        isBlockLoading,
        isUnblockLoading,
        isMuteLoading,
        isUnmuteLoading,
        isRemoveFollowerLoading,
        isFollowLoading,
    }
}

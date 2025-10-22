import type { useSnackbar } from './useSnackbar'
import { useUserActions } from './useUserActions'
import { useUserInfo } from './useUserInfo'

export function useUserInteractions(userId: string) {
    const { handleUnmute, handleMute, handleBlock, handleUnblock, handleRemoveFollower } =
        useUserActions(userId)
    const { showSnackbar, handleShowSnackbar } = inject('snackbar') as ReturnType<
        typeof useSnackbar
    >
    const { isMuted, username } = useUserInfo(userId)
    const showConfirm = ref(false)
    const showList = ref(false)
    const confirmData = reactive({
        username: '',
        header: '',
        bgColor: '',
        text: '',
        action: '',
        hover: '',
        message: '',
    })

    function handleShowConfirmation(action: string) {
        showConfirm.value = true
        if (action === 'remove') {
            confirmData.username = ''
            confirmData.header = 'Remove this follower'
            confirmData.bgColor = 'bg-red-500'
            confirmData.text = 'text-white'
            confirmData.action = 'Remove'
            confirmData.hover = 'hover:bg-red-500/85'
            confirmData.message = `@${username} will be removed from
            your followers and won’t be notified by Yappper.
            They can follow you again in the future. `
        } else if (action === 'unblock') {
            confirmData.username = username.value
            confirmData.header = 'Unblock'
            confirmData.bgColor = 'bg-[#ebf1f1]'
            confirmData.text = 'text-black'
            confirmData.action = 'Unblock'
            confirmData.hover = 'hover:bg-gray-200/90'
            confirmData.message =
                'They will be able to follow you and engage with your public posts.'
        } else if (action === 'block') {
            confirmData.username = username.value
            confirmData.header = 'Block'
            confirmData.bgColor = 'bg-red-500'
            confirmData.text = 'text-white'
            confirmData.action = 'Block'
            confirmData.hover = 'hover:bg-red-500/85'
            confirmData.message = `They will be able to see your public posts,
            but will no longer be able to engage with them.
            @${username} will also not be able to follow or message you,
            and you will not see notifications from them. `
        }
    }

    function handleConfirm() {
        if (confirmData.action === 'Remove') {
            handleRemoveFollower()
            showSnackbar.value = true
            console.log('snack', showSnackbar.value)
            handleShowSnackbar(' is no longer following you.', username.value)
            showConfirm.value = false
            showList.value = false
        } else if (confirmData.action === 'Unblock') {
            handleUnblock()
            showConfirm.value = false
            showList.value = false
        } else if (confirmData.action === 'Block') {
            handleBlock()
            showSnackbar.value = true
            console.log('snack', showSnackbar.value)
            handleShowSnackbar('Successfully blocked.','', 'Unblock', handleUnblock)
            showConfirm.value = false
            showList.value = false
        }
    }

    function handleCancel() {
        showConfirm.value = false
        showList.value = false
    }

    function handleMuteAndUnmute() {
        if (isMuted.value) {
            handleUnmute()
            showSnackbar.value = true
            handleShowSnackbar(' has been unmuted.', username.value)
            console.log('snack', showSnackbar.value)
            showList.value = false
        } else {
            handleMute()
            showSnackbar.value = true
            handleShowSnackbar(' has been muted.', username.value, 'Undo', handleUnmute)
            console.log('snack', showSnackbar.value)
            showList.value = false
        }
    }

    function handleShowList() {
        showList.value = true
    }

    return {
        showList,
        confirmData,
        showConfirm,
        handleCancel,
        handleConfirm,
        handleShowConfirmation,
        handleMuteAndUnmute,
        handleShowList,
    }
}

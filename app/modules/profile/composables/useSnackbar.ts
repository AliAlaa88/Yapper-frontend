import { ref } from 'vue'

export function useSnackbar() {
    const showSnackbar = ref(false)
    const snackbar = ref({
        username: '',
        message: '',
        action: '',
        handleClick: null as null | (() => void),
    })

    function handleShowSnackbar(
        message: string,
        username?: string,
        action?: string,
        handleClick?: () => void,
    ) {
        showSnackbar.value = true
        snackbar.value.username = username ?? ''
        snackbar.value.message = message
        snackbar.value.action = action ?? ''
        snackbar.value.handleClick = handleClick ?? null
        setTimeout(() => (showSnackbar.value = false), 4000)
    }


    return {
        showSnackbar,
        snackbar,
        handleShowSnackbar,
    }
}

import { ref, reactive } from 'vue'

export function useSnackbar() {
    const showSnackbar = ref(false)
    const snackbar = reactive({
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
        snackbar.username = username ?? ''
        snackbar.message = message
        snackbar.action = action ?? ''
        snackbar.handleClick = handleClick ?? null
        setTimeout(() => (showSnackbar.value = false), 4000)
    }


    return {
        showSnackbar,
        snackbar,
        handleShowSnackbar,
    }
}

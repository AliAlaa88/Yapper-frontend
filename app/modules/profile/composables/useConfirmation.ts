import { ref } from 'vue'

export function useConfirmation() {
    const showConfirmation = ref(false)
    const confirmData = ref({
        username: '',
        header: '',
        bgColor: '',
        text: '',
        action: '',
        hover: '',
        message: '',
        handleClick: null as null | (() => void),
    })

    function handleShowConfirmation(
        action: string,
        header: string,
        bg: string,
        text: string,
        hover: string,
        message: string,
        handleClick: () => void,
        username?: string,
    ) {
        showConfirmation.value = true
        confirmData.value.username = username ?? ''
        confirmData.value.header = header
        confirmData.value.bgColor = bg
        confirmData.value.text = text
        confirmData.value.action = action
        confirmData.value.hover = hover
        confirmData.value.message = message
        confirmData.value.handleClick = handleClick ?? null
    }

    return {
        showConfirmation,
        confirmData,
        handleShowConfirmation,
    }
}

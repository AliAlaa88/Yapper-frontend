import { userSettingsQueries } from '../queries/userSettingsQueries'
import { usePasswordConfirmationStore } from '../stores/usePasswordConfirmationStore'

export function usePasswordProtection() {
    const confirmPasswordStore = usePasswordConfirmationStore()
    const showPasswordConfirmation = ref(false)
    const isProtectedContentVisible = ref(false)

    const { useConfirmPassword } = userSettingsQueries()

    const checkPasswordConfirmation = () => {
        const isValid = confirmPasswordStore.checkSession()

        if (isValid) {
            isProtectedContentVisible.value = true
            return true
        } else {
            showPasswordConfirmation.value = true
            isProtectedContentVisible.value = false
            return false
        }
    }

    const handlePasswordConfirmation = async (password: string) => {
        try {
            await useConfirmPassword.mutateAsync({ password })
            confirmPasswordStore.confirmPassword()
            isProtectedContentVisible.value = true
            showPasswordConfirmation.value = false

            checkPasswordConfirmation()
            return true
        } catch (error: unknown) {
            console.log('error during confirmation', (error as Error).message)
            throw error
        }
    }

    const invalidateOnPasswordChange = () => {
        confirmPasswordStore.requireReconfirmation()
        isProtectedContentVisible.value = false
    }

    watch(
        () => confirmPasswordStore.isSessionValid,
        (valid) => {
            isProtectedContentVisible.value = valid
            if (!valid) {
                showPasswordConfirmation.value = true
            } else {
                showPasswordConfirmation.value = false
            }
        },
        { immediate: true },
    )

    return {
        checkPasswordConfirmation,
        handlePasswordConfirmation,
        invalidateOnPasswordChange,
        isConfirmingPassword: useConfirmPassword.isPending,
        showPasswordConfirmation,
        isProtectedContentVisible,
    }
}

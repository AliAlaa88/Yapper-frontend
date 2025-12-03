<template>
    <DetailedPanel title="Change your password">
        <form @submit.prevent="handleSubmit">
            <div class="relative w-full border-b border-primary space-y-4">
                <div class="px-4 py-3">
                    <input
                        v-model="currentPassword"
                        type="password"
                        placeholder="Current password"
                        :disabled="useChangePassword.isPending.value"
                        class="w-full border border-primary py-3 px-3
                        transition text-muted bg-transparent focus:outline-none rounded-md
                        focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    >
                    <NuxtLink
                        id="settings-forgot-password"
                        to="/auth/forgot-password"
                        class="mt-3 pl-1 text-accent hover:underline">
                        Forgot Password?
                    </NuxtLink>
                </div>
                <div class="w-full border-t border-b border-primary px-4 py-3 mb-2 space-y-4">
                    <div>
                        <input
                            v-model="newPassword"
                            type="password"
                            placeholder="New password"
                            :disabled="useChangePassword.isPending.value"
                            class="w-full border border-primary py-3 px-3
                            transition text-muted bg-transparent focus:outline-none rounded-md
                            focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            minlength="8"
                        >
                        <p v-if="newPassword && !isPasswordStrong" class="text-red text-xs mt-1 pl-1">
                            Password must be at least 8 characters with uppercase, lowercase, number, and special character
                        </p>
                    </div>

                    <div>
                        <input
                            v-model="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            :disabled="useChangePassword.isPending.value"
                            class="w-full border border-primary py-3 px-3
                            transition text-muted bg-transparent focus:outline-none rounded-md
                            focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                        >
                        <p v-if="confirmPassword && !passwordsMatch" class="text-red text-xs mt-1 pl-1">
                            Passwords do not match
                        </p>
                    </div>
                </div>
                <div v-if="useChangePassword.isError.value" class="px-4 pb-3">
                    <p class="text-red text-sm">{{ useChangePassword.error.value?.message }}</p>
                </div>
            </div>

            <div class="px-4 py-4 flex justify-end">
                <Button
                    type="submit"
                    :disabled="!isFormValid || useChangePassword.isPending.value"
                    :is-loading="useChangePassword.isPending.value"
                    loading-text="Saving..."
                    button-text="Save"
                    button-class="bg-accent text-primary font-medium py-2 px-6 rounded-3xl
                    hover:bg-accent-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </form>
    </DetailedPanel>
</template>

<script setup lang="ts">
import Button from '~/modules/Common/components/Button/Button.vue'
import DetailedPanel from './DetailedPanel.vue'
import { userSettingsQueries } from '../queries/userSettingsQueries'
import type { useSnackbar } from '../../profile/composables/useSnackbar'

const { showSnackbar, handleShowSnackbar } = inject('snackbar') as ReturnType<
    typeof useSnackbar
>

const { useChangePassword } = userSettingsQueries()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const isPasswordStrong = computed(() => {
    if (!newPassword.value) return true

    const hasUpperCase = /[A-Z]/.test(newPassword.value)
    const hasLowerCase = /[a-z]/.test(newPassword.value)
    const hasNumber = /\d/.test(newPassword.value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword.value)
    const isLongEnough = newPassword.value.length >= 8

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough
})

const passwordsMatch = computed(() => {
    if (!confirmPassword.value) return true
    return newPassword.value === confirmPassword.value
})

const isFormValid = computed(() => {
    return (
        currentPassword.value.length > 0 &&
        newPassword.value.length >= 8 &&
        confirmPassword.value.length > 0 &&
        passwordsMatch.value &&
        isPasswordStrong.value
    )
})

const handleSubmit = async () => {
    if (!isFormValid.value) return

    try {
        await useChangePassword.mutateAsync({
            oldPassword: currentPassword.value,
            newPassword: newPassword.value,
        })
        showSnackbar.value = true
        handleShowSnackbar(
            'Your password has been successfully updated.',
        )
        setTimeout(() => {
            currentPassword.value = ''
            newPassword.value = ''
            confirmPassword.value = ''
            useChangePassword.reset()
        }, 2000)
    } catch (err) {
        console.error('Password change failed:', err)
    }
}

watch([currentPassword, newPassword, confirmPassword], () => {
    if (useChangePassword.isSuccess.value || useChangePassword.isError.value) {
        useChangePassword.reset()
    }
})
</script>

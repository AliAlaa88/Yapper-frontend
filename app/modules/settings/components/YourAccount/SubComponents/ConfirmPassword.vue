<template>
    <div
        v-if="isShow"
        class="my-7">
        <div class="px-6 pt-2 pb-3 space-y-4 border-b border-primary">
            <h2 class="text-xl font-bold text-primary">
                Confirm your password
            </h2>
            <p class="text-[13px] text-muted mt-1">
                Please enter your password in order to get this.
            </p>
        </div>
        <form @submit.prevent="handleConfirm">
            <div class="relative w-full space-y-4">
                <div class="px-4 py-3">
                    <input
                        id="confirm-password-input"
                        v-model="password"
                        type="password"
                        placeholder="password"
                        :disabled="isLoading"
                        class="w-full py-3 px-3
                            transition text-muted border bg-transparent focus:outline-none rounded-md
                            disabled:opacity-50 focus:ring-2
                            disabled:cursor-not-allowed"
                        :class="{
                            'border-primary focus:ring-accent' : !errorMessage && !showNoPasswordWarning,
                            'border-red-500 focus:ring-red-500' : errorMessage || showNoPasswordWarning
                        }"
                        required
                        autofocus>
                    <NuxtLink
                        id="settings-link-forgot-password1"
                        to="/auth/forgot-password"
                        class="mt-3 pl-1 text-accent hover:underline">
                        Forgot Password?
                    </NuxtLink>
                    <p v-if="errorMessage" class="text-red pl-1 text-sm font-medium">
                        {{ errorMessage }}
                    </p>
                </div>
            </div>

            <div v-if="showNoPasswordWarning" class="bg-red-500/10 border border-red-500/20 mx-4 rounded-lg p-4">
                <p class="text-red dark:text-red-400 text-sm font-medium mb-2">
                    No password set
                </p>
                <p class="text-muted text-sm mb-3">
                    Your account doesn't have a password set. This usually happens when you
                    signed up using a social provider (Google, Github).
                </p>
                <NuxtLink id="settings-link-forgot-password2" to="/auth/forgot-password" class="text-accent hover:underline text-sm font-medium">
                    Set up a password →
                </NuxtLink>
            </div>

            <div class="px-4 py-4 flex justify-end">
                <Button
                    id="confirm-password-button"
                    type="submit"
                    :disabled="!password || showNoPasswordWarning || errorMessage.includes('incorrect')"
                    :is-loading="isLoading"
                    button-text="Confirm"
                    button-class="bg-accent text-primary font-medium py-2 px-6 rounded-3xl
                        hover:bg-accent-dark transition disabled:opacity-50
                        disabled:cursor-not-allowed" />
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import Button from '~/modules/Common/components/Button/Button.vue'
import { usePasswordProtection } from '../../../composables/usePasswordProtection'

const props = defineProps<{
    isShow: boolean
    isLoading: boolean
}>()

const { handlePasswordConfirmation } = usePasswordProtection()

const password = ref('')
const showNoPasswordWarning = ref(false)
const errorMessage = ref('')

const handleConfirm = async () => {
    if (!password.value) return
    try {
        await handlePasswordConfirmation(password.value)
    } catch (err: unknown) {
        console.log('error in confirming password', err)
        if (err instanceof Error) {
            if (err.message === 'NO_PASSWORD_SET') {
                showNoPasswordWarning.value = true
            } else if (err.message === 'WRONG_PASSWORD') {
                errorMessage.value = 'The password you entered was incorrect.'
            }
        }
    }
}

watch(() => props.isShow, (isShow) => {
    if (isShow) {
        password.value = ''
        showNoPasswordWarning.value = false
    }
})

watch(password, () => {
    errorMessage.value = ''
    showNoPasswordWarning.value = false
})
</script>

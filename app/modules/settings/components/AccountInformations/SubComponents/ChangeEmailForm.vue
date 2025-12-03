<template>
    <Popup
        :is-open="true"
        :has-close-button="true"
        content-class="max-w-lg sm:max-w-xl w-full"
        header-class="absolute top-4 left-4 z-10 bg-transparent p-0"
        slot-class="p-8 sm:p-10 md:p-14 lg:p-20"
        @close="handleClose"
    >
        <Logo
            img-class="relative z-10 w-8 lg:w-10 mb-3"
            div-class="flex justify-center mb-6"
        />

        <h2 class="text-3xl font-bold mb-3">Change email</h2>
        <p class="text-muted mb-9 text-xs">
            {{`Your current email is. What whould you like to update it to? Your email is not displayed in your public profile on Yapper.`}}
        </p>

        <form @submit.prevent="handleNext">
            <input
                id="input-new-email"
                v-model="newEmail"
                type="email"
                placeholder="Email address"
                :disabled="sendEmailOTPMutation.isPending.value"
                required
                class="w-full bg-primary text-primary border border-primary rounded-md px-4 py-2
                focus:outline-none focus:border-2 mb-4 shadow-sm transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
                :class="[
                    (!isValidEmail && newEmail !== '') || sendEmailOTPMutation.isError.value ? 'focus:border-red' :
                    'focus:border-accent'
                ]" >

            <p v-if="errorMessage || (!isValidEmail && newEmail !== '')" class="text-red text-sm mb-4">
                {{ !isValidEmail ? 'Please enter a valid email.' : errorMessage }}
            </p>
            <div class="pt-8">
                <Button
                    v-if="!isValidEmail"
                    :is-loading="sendEmailOTPMutation.isPending.value"
                    button-class="w-full flex-1 bg-transparent border border-primary text-primary py-3 rounded-full
                    hover:bg-hover transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    button-text="Cancel"
                    @click="handleClose"
                />
                <Button
                    v-if="isValidEmail"
                    type="submit"
                    :is-loading="sendEmailOTPMutation.isPending.value"
                    button-class="w-full flex-1 bg-alternate text-alternate py-3 rounded-full
                    hover:bg-hover-alternate transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    button-text="Next"
                />
            </div>
        </form>
    </Popup>
    <VerifyEmailOTP
        v-if="showOTPModal"
        :is-open="showOTPModal"
        :new-email="newEmail"
        @close="handleCloseOTP"
        @verified="handleEmailVerified"
    />
</template>

<script setup lang="ts">
import Logo from '~/modules/Common/components/Logo'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Button from '~/modules/Common/components/Button/Button.vue'
import VerifyEmailOTP from '~/modules/settings/components/AccountInformations/SubComponents/VerifyEmailOTP.vue'
import { userSettingsQueries } from '../../../queries/userSettingsQueries'
import { useRouter } from 'vue-router'

const router = useRouter()
const errorMessage = ref('')
const newEmail = ref('')
const showOTPModal = ref(false)

const { sendEmailOTPMutation } = userSettingsQueries()

const isValidEmail = computed(() => {
    if (!newEmail.value) return false

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(newEmail.value)
})

const handleNext = async () => {
    if(!isValidEmail.value) return
    errorMessage.value = ''
    try {
        console.log('Sending email OTP to:', newEmail.value)
        await sendEmailOTPMutation.mutateAsync({ newEmail: newEmail.value })
        showOTPModal.value = true
    } catch (error: unknown) {
        interface AxiosLikeError {
            response?: { data?: { message?: string } }
        }
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as AxiosLikeError
            errorMessage.value = axiosError.response?.data?.message || 'An error occurred. Please try again.'
        } else if (error instanceof Error) {
            errorMessage.value = error.message
        } else {
            errorMessage.value = 'An error occurred. Please try again.'
        }
    }
}

const handleClose = () => {
    newEmail.value = ''
    errorMessage.value = ''
    router.push('/settings/email')
}

const handleCloseOTP = () => {
    showOTPModal.value = false
}

const handleEmailVerified = () => {
    showOTPModal.value = false
    window.location.href = '/auth/login'
}

watch(sendEmailOTPMutation.error, (error) => {
    if (error) {
        errorMessage.value = error.message
    }
})
</script>

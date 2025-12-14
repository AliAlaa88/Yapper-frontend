<template>
    <Popup
        :is-open="isOpen"
        :has-close-button="false"
        content-class="max-w-lg sm:max-w-xl w-full"
        header-class="absolute top-4 left-4 z-10 bg-transparent p-0"
        slot-class="p-8 sm:p-10 md:p-14 lg:p-20"
        @close="handleClose"
    >
        <!-- <BackButton @close="handleClose" /> -->
        <Logo
            img-class="relative z-10 w-8 lg:w-10 mb-3"
            div-class="flex justify-center mb-6"
        />

        <h2 class="text-3xl font-bold mb-3">{{ $t('settings.accountInfo.we_sent_code') }}</h2>
        <p class="text-muted mb-9 text-xs">
            {{ $t('settings.accountInfo.enter_code_message') }}
        </p>

        <form @submit.prevent="handleVerify">
            <input
                id="input-otp"
                v-model="otp"
                type="text"
                maxlength="6"
                :placeholder="$t('settings.accountInfo.verification_code')"
                :disabled="verifyEmailOTPMutation.isPending.value"
                required
                autofocus
                class="w-full bg-primary text-primary border border-primary rounded-md px-4 py-2
                focus:outline-none focus:border-accent mb-4 shadow-sm transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed" >

            <Button
                id="reset-otp-button"
                button-class="text-accent text-sm hover:underline mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                :button-text="$t('settings.accountInfo.didnt_receive')"
                @click="handleResend"
            />
            <p v-if="errorMessage" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>
            <div class="pt-8">
                <Button
                    id="verify-otp-button"
                    type="submit"
                    :is-loading="verifyEmailOTPMutation.isPending.value"
                    :disabled="otp.length === 0"
                    button-class="w-full flex-1 bg-alternate text-alternate py-3 rounded-full
                    hover:bg-hover-alternate transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    :button-text="$t('settings.accountInfo.verify')"
                />
            </div>
        </form>
    </Popup>
</template>

<script setup lang="ts">
import Logo from '~/modules/Common/components/Logo'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Button from '~/modules/Common/components/Button/Button.vue'
import { userSettingsQueries } from '../../../queries/userSettingsQueries'

const props = defineProps<{
    isOpen: boolean
    newEmail: string
}>()

const otp = ref('')
const errorMessage = ref('')

const emit = defineEmits<{
    close: []
    verified: []
}>()

const { verifyEmailOTPMutation, sendEmailOTPMutation } = userSettingsQueries()

const handleVerify = async () => {
    errorMessage.value = ''

    try {
        await verifyEmailOTPMutation.mutateAsync({
            newEmail: props.newEmail,
            otp: otp.value,
        })
        emit('verified')
    } catch (error: unknown) {
        if (error instanceof Error) {
            errorMessage.value = error.message
        } else {
            errorMessage.value = String(error) || 'An error occurred. Please try again.'
        }
    }
}

const handleResend = async () => {
    errorMessage.value = ''
    try {
        await sendEmailOTPMutation.mutateAsync({ newEmail: props.newEmail })
    } catch (error: unknown) {
        if (error instanceof Error) {
            errorMessage.value = error.message
        } else {
            errorMessage.value = String(error) || 'An error occurred. Please try again.'
        }
    }
}

const handleClose = () => {
    otp.value = ''
    errorMessage.value = ''
    verifyEmailOTPMutation.reset()
    emit('close')
}

watch(otp, () => {
    if (errorMessage.value) {
        errorMessage.value = ''
    }
})

</script>

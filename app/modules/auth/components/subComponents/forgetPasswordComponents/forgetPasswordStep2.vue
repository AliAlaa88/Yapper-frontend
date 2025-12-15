<template>
    <Popup
        :is-open="true"
        :has-close-button="false"
        :has-back-button="true"
        content-class="max-w-lg sm:max-w-xl w-full"
        header-class=""
        slot-class="p-8 sm:p-10 md:p-14 lg:p-20"
        @close="$emit('close')"
        @back="$emit('back')"
    >
        <!-- Back Button -->

        <!-- Logo -->
        <Logo img-class="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

        <!-- Title -->
        <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">
            {{ $t('auth.forgotPassword.step2Title') }}
        </h2>
        <p class="text-muted mb-6">{{ $t('auth.forgotPassword.step2Info') }}</p>

        <!-- OTP Input -->
        <form @submit.prevent="onNext">
            <div class="mb-4">
                <input
                    id="input-otp-forgot-password-s2"
                    v-model="otp"
                    type="text"
                    :placeholder="$t('auth.verifyOtp.otpPlaceholder')"
                    maxlength="6"
                    :class="[
                        'w-full bg-primary text-primary border border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors text-center text-2xl tracking-widest shadow-sm',
                        otpError ? 'border-red focus:border-red' : '',
                    ]"
                    @input="handleOtpInput"
                    @blur="validateOtpField"
                >
                <p v-if="otpError" class="text-red text-xs mt-1 text-center">{{ otpError }}</p>
            </div>

            <!-- Error Message -->
            <p
                v-if="errorMessage"
                id="error-message-forgot-password-s2"
                class="text-red text-sm mb-4"
            >
                {{ errorMessage }}
            </p>

            <!-- Next Button -->
            <Button
                id="button-next-forgot-password-s2"
                button-class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold rounded-full py-2 transition mb-3 duration-200"
                :loading-text="t('auth.common.loading')"
                :is-loading="loading"
                type="submit"
            >
                {{ $t('auth.common.next') }}
            </Button>
        </form>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVerifyForgotPasswordOTPQuery } from '../../../queries/useForgetPasswordQuery'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import { validateOtp } from '../../../utils/validators'
import Button from '~/modules/Common/components/Button/Button.vue'

const { locale, t } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const otp = defineModel<string>('otp', { default: '' })

const errorMessage = ref('')
const otpError = ref('')
const loading = ref(false)

const props = defineProps<{
    identifier: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'back'): void
    (e: 'next', reset_token: string): void
}>()

const verifyOTPMutation = useVerifyForgotPasswordOTPQuery(
    (data: any) => {
        errorMessage.value = ''
        loading.value = false
        emit('next', data.data.reset_token)
    },
    (error: any) => {
        console.error('Verify OTP Error:', error)
        const errorMsg = error?.response?.data?.message || 'An error occurred. Please try again.'
        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
        loading.value = false
    },
)

const handleOtpInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    // Allow only alphanumeric characters and limit to 6 characters
    otp.value = target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)
    otpError.value = ''
    errorMessage.value = ''
}

const validateOtpField = () => {
    const result = validateOtp(otp.value)
    otpError.value = result.valid ? '' : result.messageKey ? t(result.messageKey) : ''
    return result.valid
}

const onNext = () => {
    if (!validateOtpField()) {
        return
    }
    errorMessage.value = '' // Clear previous errors
    loading.value = true
    verifyOTPMutation.mutate({ identifier: props.identifier, token: otp.value })
}
</script>

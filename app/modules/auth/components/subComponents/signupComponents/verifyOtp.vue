<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="false"
        @back="$emit('close')"
        :hasBackButton="true"
        container-class="bg-auth-popup"
        contentClass="max-w-lg sm:max-w-xl w-full"
        headerClass=""
        slotClass="p-8 sm:p-10 md:p-14 lg:p-20"
    >
        <!-- Back Button -->

        <!-- Logo -->
        <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.verifyOtp.title') }}</h2>
            <p class="text-muted mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.verifyOtp.info') }}</p>

            <!-- OTP Input -->
            <form @submit.prevent="onNext">
            <div class="mb-4">
                <input
                    id="input-otp-signup-s2"
                    type="text"
                    :placeholder="$t('auth.verifyOtp.otpPlaceholder')"
                    v-model="otp"
                    maxlength="6"
                    @input="handleOtpInput"
                    @blur="validateOtpField"
                    :class="[
                        'w-full bg-primary text-primary border border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors text-center text-2xl tracking-widest shadow-sm',
                        otpError ? 'border-red focus:border-red' : ''
                    ]"
                />
                <p v-if="otpError" class="text-red text-xs mt-1 text-center">{{ otpError }}</p>
            </div>

            <!-- Error Message -->
            <p v-if="errorMessage" id="error-message-signup-s2" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>

            <!-- Next Button -->
            <Button
                id="button-next-signup-s2"
                buttonClass="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold rounded-full py-2 transition mb-3"
                :loading-text="t('auth.common.loading')"
                :is-loading="loading"
                type="submit"
            >
                {{ $t('auth.common.next') }}
            </Button>
            </form>
            <p class="text-center text-primary text-sm">
                {{ $t('auth.verifyOtp.resendPrompt') }}
                <Button
                    id="button-resend-code-signup-s2"
                    class="text-blue hover:underline font-semibold transition duration-200"
                    @click="onResendCode"
                >
                    {{ $t('auth.common.resendCode') }}
                </Button>
            </p>
            <div class="mt-4">
                <p
                    v-if="resendCodeSuccess"
                    id="success-message-resend-signup-s2"
                    class="text-green text-sm text-center"
                >
                    {{ resendCodeSuccess }}
                </p>
                <p
                    v-if="resendCodeFailure"
                    id="error-message-resend-signup-s2"
                    class="text-red text-sm text-center"
                >
                    {{ resendCodeFailure }}
                </p>
            </div>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegisterS2Query, useResendOTPQuery } from '../../../queries/useRegisterQuery'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import { validateOtp } from '../../../utils/validators'
import Button from '~/modules/Common/components/Button/Button.vue'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const otpError = ref('')

// Use v-model for otp
const otp = defineModel<string>('otp', { default: '' })

const errorMessage = ref('')
const resendCodeSuccess = ref('')
const resendCodeFailure = ref('')
const loading = ref(false)

const props = defineProps<{
    Email: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'next', recommendations: string[]): void
}>()

const registerMutation = useRegisterS2Query(
    (Data: any) => {
        // Safely extract recommendations from various possible shapes
        const rec = Data?.data?.recommendations ?? []
        const recommendations = Array.isArray(rec) ? rec : []
        errorMessage.value = ''
        loading.value = false
        emit('next', recommendations)
    },
    (error: any) => {
        console.error('Registration Step 2 Error:', error)

        // Extract error message from backend response
        const errorMsg = error?.response?.data?.message || 'Invalid OTP. Please try again.'

        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
        loading.value = false
    },
)

const resendOTPMutation = useResendOTPQuery(
    (data) => {
        resendCodeSuccess.value = 'OTP has been resent successfully.'
        resendCodeFailure.value = ''
    },
    (error: any) => {
        console.error('Resend OTP Error:', error.message)
        const errorMsg = error?.response?.data?.message || error.message
        resendCodeSuccess.value = ''
        if (Array.isArray(errorMsg)) resendCodeFailure.value = errorMsg[0]
        else resendCodeFailure.value = errorMsg
    },
)

const handleOtpInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    // Only digits, chars
    otp.value = target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)
    otpError.value = ''
    errorMessage.value = ''
}

const { t } = useI18n()

const validateOtpField = () => {
    const result = validateOtp(otp.value)
    otpError.value = result.valid ? '' : (result.messageKey ? t(result.messageKey) : '')
    return result.valid
}

const onNext = () => {
    // Validate before submitting
    if (!validateOtpField()) {
        return
    }
    errorMessage.value = '' // Clear previous errors
    loading.value = true
    registerMutation.mutate({ token: otp.value, Email: props.Email })
}

const onResendCode = () => {
    resendOTPMutation.mutate(props.Email)
}
</script>

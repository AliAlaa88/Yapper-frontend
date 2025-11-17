<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4"
    >
        <div
            class="bg-primary text-primary rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center"
        >
            <!-- Back Button -->
            <backButton @close="$emit('close')" />
            <!-- Logo -->
            <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.verifyOtp.title') }}</h2>
            <p class="text-muted mb-6">{{ $t('auth.verifyOtp.info') }}</p>

            <!-- OTP Input -->
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
                        'w-full bg-transparent border rounded-md px-4 py-2 focus:outline-none transition-colors text-center text-2xl tracking-widest',
                        otpError ? 'border-red focus:border-red' : 'border-primary focus:border-primary'
                    ]"
                />
                <p v-if="otpError" class="text-red text-xs mt-1 text-center">{{ otpError }}</p>
            </div>

            <!-- Error Message -->
            <p v-if="errorMessage" id="error-message-signup-s2" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>

            <!-- Next Button -->
            <button
                id="button-next-signup-s2"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </button>

            <p class="text-center text-primary text-sm">
                {{ $t('auth.verifyOtp.resendPrompt') }}
                <button
                    id="button-resend-code-signup-s2"
                    class="text-blue hover:underline font-semibold cursor-pointer transition duration-200"
                    @click="onResendCode"
                >
                    {{ $t('auth.common.resendCode') }}
                </button>
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRegisterS2Query, useResendOTPQuery } from '../../../queries/useRegisterQuery'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'
import { validateOtp } from '../../../utils/validators'

const otp = ref('')
const errorMessage = ref('')
const otpError = ref('')

const resendCodeSuccess = ref('')
const resendCodeFailure = ref('')

const props = defineProps<{
    Email: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'next', recommendations: string[]): void
}>()

const registerMutation = useRegisterS2Query(
    (Data: any) => {
        console.log('Registration Step 2 Success:', Data)
        // Safely extract recommendations from various possible shapes
        const rec = Data?.data?.recommendations ?? []
        const recommendations = Array.isArray(rec) ? rec : []
        errorMessage.value = ''
        emit('next', recommendations)
    },
    (error: any) => {
        console.error('Registration Step 2 Error:', error)

        // Extract error message from backend response
        const errorMsg = error?.response?.data?.message || 'Invalid OTP. Please try again.'

        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
    },
)

const resendOTPMutation = useResendOTPQuery(
    (data) => {
        console.log('Resend OTP Success:', data)
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
    // Only allow digits
    otp.value = target.value.replace(/\D/g, '').slice(0, 6)
    otpError.value = ''
    errorMessage.value = ''
}

const validateOtpField = () => {
    const result = validateOtp(otp.value)
    otpError.value = result.valid ? '' : result.message || ''
    return result.valid
}

const onNext = () => {
    // Validate before submitting
    if (!validateOtpField()) {
        return
    }
    errorMessage.value = '' // Clear previous errors
    console.log('Next clicked:', otp.value)
    registerMutation.mutate({ token: otp.value, Email: props.Email })
}

const onResendCode = () => {
    console.log('Resend code clicked')
    resendOTPMutation.mutate(props.Email)
}
</script>

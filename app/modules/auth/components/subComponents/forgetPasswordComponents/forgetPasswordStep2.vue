<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-primary/60 backdrop-blur-sm p-4"
    >
        <div
            class="bg-primary text-primary rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center"
        >
            <!-- Close Button -->
            <closeButton @close="$emit('close')" />

            <!-- Back Button -->
            <backButton @close="$emit('back')" />

            <!-- Logo -->
            <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.forgotPassword.step2Title') }}</h2>
            <p class="text-muted mb-6">{{ $t('auth.forgotPassword.step2Info') }}</p>

            <!-- OTP Input -->
            <div class="mb-4">
                <input
                    id="input-otp-forgot-password-s2"
                    type="text"
                    :placeholder="$t('auth.verifyOtp.otpPlaceholder')"
                    v-model="otp"
                    maxlength="6"
                    @input="handleOtpInput"
                    @blur="validateOtpField"
                    :class="[
                        'w-full bg-primary text-primary border rounded-md px-4 py-2 focus:outline-none transition-colors text-center text-2xl tracking-widest',
                        otpError ? 'border-red focus:border-red' : 'border-primary focus:border-blue'
                    ]"
                />
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
            <button
                id="button-next-forgot-password-s2"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3 duration-200"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVerifyForgotPasswordOTPQuery } from '../../../queries/useForgetPasswordQuery'
import closeButton from '../closeButton.vue'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'
import { validateOtp } from '../../../utils/validators'

// Use v-model for otp
const otp = defineModel<string>('otp', { default: '' })

const errorMessage = ref('')
const otpError = ref('')

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
        console.log('Verify OTP Success:', data)
        errorMessage.value = ''
        emit('next', data.data.resetToken)
    },
    (error: any) => {
        console.error('Verify OTP Error:', error)
        const errorMsg = error?.response?.data?.message || 'An error occurred. Please try again.'
        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
    },
)

const handleOtpInput = (event: Event) => {
    const target = event.target as HTMLInputElement
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
    if (!validateOtpField()) {
        return
    }
    errorMessage.value = '' // Clear previous errors
    verifyOTPMutation.mutate({ identifier: props.identifier, token: otp.value })
}
</script>

<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4"
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
            <h2 class="text-3xl font-bold text-left mb-6">
                We sent you a code to reset your password
            </h2>
            <p class="text-muted mb-6">Please enter the 6-digit code sent to your email address.</p>

            <!-- OTP Input -->
            <input
                id="input-otp-forgot-password-s2"
                type="text"
                placeholder="Enter OTP"
                v-model="otp"
                class="w-full bg-transparent border border-primary rounded-md px-4 py-2 focus:outline-none focus:border-primary mb-4"
            />

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
                Next
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

// Use v-model for otp
const otp = defineModel<string>('otp', { default: '' })

const errorMessage = ref('')

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

const onNext = () => {
    errorMessage.value = '' // Clear previous errors
    verifyOTPMutation.mutate({ identifier: props.identifier, token: otp.value })
}
</script>

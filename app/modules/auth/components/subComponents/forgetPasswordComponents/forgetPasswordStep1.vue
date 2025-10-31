<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4"
    >
        <div
            class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 relative flex flex-col justify-center"
        >
            <!-- Close Button -->
            <closeButton @close="$emit('close')" />

            <!-- Logo -->
            <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" divClass="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold text-left mb-6">Find your X account</h2>
            <!-- Description -->
            <p class="text-gray-400 mb-6">
                Enter the email, phone number, or username associated with your account to change
                your password.
            </p>

            <!-- Input -->
            <input
                id="input-identifier-forgot-password-s1"
                type="text"
                placeholder="Phone, email, or username"
                v-model="identifier"
                class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
            />

            <!-- Error Message -->
            <p
                v-if="errorMessage"
                id="error-message-forgot-password-s1"
                class="text-red-500 text-sm mb-4"
            >
                {{ errorMessage }}
            </p>

            <!-- Next Button -->
            <button
                id="button-next-forgot-password-s1"
                class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
                @click="onNext"
            >
                Next
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Logo from '~/modules/Common/components/Logo'
import { useForgotPasswordQuery } from '../../../queries/useForgetPasswordQuery'
import closeButton from '../closeButton.vue'

const identifier = ref('')
const errorMessage = ref('')

const emit = defineEmits<{
    (e: 'next', identifier: string): void
    (e: 'close'): void
}>()

const forgotPasswordMutation = useForgotPasswordQuery(
    (data: any) => {
        console.log('Forgot Password Step 1 Success:', data)
        errorMessage.value = ''
        emit('next', identifier.value)
    },
    (error: any) => {
        console.error('Forgot Password Step 1 Error:', error)
        const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            'An unexpected error occurred. Please try again.'
        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
    },
)

const onNext = () => {
    errorMessage.value = '' // Clear previous errors
    forgotPasswordMutation.mutate({ identifier: identifier.value })
}
</script>

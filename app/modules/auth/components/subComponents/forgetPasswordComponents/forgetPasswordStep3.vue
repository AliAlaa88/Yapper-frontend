<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-primary/60 backdrop-blur-sm p-4"
    >
        <div
            class="bg-primary text-primary rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 relative flex flex-col justify-center"
        >
            <!-- Close Button -->
            <closeButton @close="$emit('close')" />

            <!-- Back Button -->
            <backButton @close="$emit('back')" />

            <!-- Logo -->
            <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" divClass="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.forgotPassword.step3Title') }}</h2>
            <!-- Description -->
            <p class="text-muted mb-6">{{ $t('auth.forgotPassword.step3Info') }}</p>

            <!-- Input -->
            <div class="mb-4">
                <input
                    id="input-password-forgot-password-s3"
                    type="password"
                    :placeholder="$t('auth.forgotPassword.passwordPlaceholder')"
                    v-model="password"
                    @blur="validatePasswordField"
                    @input="clearPasswordError"
                    :class="[
                        'w-full bg-primary text-primary border rounded-md px-4 py-2 focus:outline-none transition-colors',
                        passwordError ? 'border-red focus:border-red' : 'border-primary focus:border-blue'
                    ]"
                />
                <p v-if="passwordError" class="text-red text-xs mt-1">{{ passwordError }}</p>
            </div>

            <div class="mb-4">
                <input
                    id="input-verify-password-forgot-password-s3"
                    type="password"
                    :placeholder="$t('auth.forgotPassword.verifyPasswordPlaceholder')"
                    v-model="verifyPassword"
                    @input="clearMatchError"
                    :class="[
                        'w-full bg-primary text-primary border rounded-md px-4 py-2 focus:outline-none transition-colors',
                        matchError ? 'border-red focus:border-red' : 'border-primary focus:border-blue'
                    ]"
                />
                <p v-if="matchError" class="text-red text-xs mt-1">{{ matchError }}</p>
                <p v-if="!matchError && verifyPassword && password === verifyPassword" class="text-green text-xs mt-1">✓ Passwords match</p>
            </div>

            <!-- Error Message -->
            <p
                v-if="errorMessage"
                id="error-message-forgot-password-s3"
                class="text-red text-sm mb-4"
            >
                {{ errorMessage }}
            </p>

            <!-- Next Button -->
            <button
                id="button-reset-password-forgot-password-s3"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3 duration-200"
                @click="onFinish"
            >
                {{ $t('auth.forgotPassword.resetButton') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useResetPasswordQuery } from '../../../queries/useForgetPasswordQuery'
import closeButton from '../closeButton.vue'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'
import { validatePassword } from '../../../utils/validators'

// Use v-model for password fields
const password = defineModel<string>('password', { default: '' })
const verifyPassword = defineModel<string>('confirmPassword', { default: '' })

const errorMessage = ref('')
const passwordError = ref('')
const matchError = ref('')

const props = defineProps<{
    reset_token: string
    identifier: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'back'): void
    (e: 'finish'): void
}>()

const resetPasswordMutation = useResetPasswordQuery(
    (data: any) => {
        console.log('Reset Password Success:', data)
        errorMessage.value = ''
        emit('finish')
    },
    (error: any) => {
        console.error('Reset Password Error:', error)
        const errorMsg = error?.response?.data?.message || 'An error occurred. Please try again.'
        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
    },
)

const validatePasswordField = () => {
    const result = validatePassword(password.value)
    passwordError.value = result.valid ? '' : result.message || ''
    return result.valid
}

const clearPasswordError = () => {
    passwordError.value = ''
    errorMessage.value = ''
}

const clearMatchError = () => {
    matchError.value = ''
}

const onFinish = () => {
    errorMessage.value = '' // Clear previous errors

    // Validate password strength
    if (!validatePasswordField()) {
        return
    }

    // Check password match
    if (password.value !== verifyPassword.value) {
        matchError.value = 'Passwords do not match.'
        return
    }

    console.log('reset token:', props.reset_token)
    resetPasswordMutation.mutate({
        identifier: props.identifier,
        reset_token: props.reset_token,
        newPassword: password.value,
    })
}
</script>

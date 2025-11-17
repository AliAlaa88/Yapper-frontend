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
            <h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.finalRegister.title') }}</h2>
            <p class="text-muted mb-6">{{ $t('auth.finalRegister.info') }}</p>

            <!-- Error Message -->
            <p v-if="errorMessage" id="error-message-signup-s3" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>

            <!-- Password Input -->
            <div class="mb-4">
                <input
                    id="input-password-signup-s3"
                    type="password"
                    :placeholder="$t('auth.finalRegister.passwordPlaceholder')"
                    v-model="password"
                    @blur="validatePasswordField"
                    @input="clearPasswordError"
                    :class="[
                        'w-full bg-transparent border rounded-md px-4 py-2 focus:outline-none transition-colors',
                        passwordError ? 'border-red focus:border-red' : 'border-primary focus:border-primary'
                    ]"
                />
                <p v-if="passwordError" class="text-red text-xs mt-1">{{ passwordError }}</p>
                <p v-if="!passwordError && password" class="text-green text-xs mt-1">✓ Strong password</p>
            </div>

            <p class="text-muted mb-6">{{ $t('auth.finalRegister.passwordHint') }}</p>

            <!-- Next Button -->
            <button
                id="button-signup-s3"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3 duration-200"
                @click="onNext"
            >
                {{ $t('auth.finalRegister.signUpButton') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRegisterS3Query } from '../../../queries/useRegisterQuery'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'
import { validatePassword } from '../../../utils/validators'

const password = ref('')
const language = ref('en')
const errorMessage = ref('')
const passwordError = ref('')
const props = defineProps<{
    Email: string
    username: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'next'): void
    (e: 'finish'): void
}>()

const registerMutation = useRegisterS3Query(
    (data) => {
        console.log('Registration Step 3 Success:', data)
        errorMessage.value = ''
        emit('finish')
    },
    (error: any) => {
        console.error('Registration Step 3 Error:', error)

        const errorMsg = error?.response?.data?.message || 'Registration failed. Please try again.'

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

const onNext = () => {
    // Validate before submitting
    if (!validatePasswordField()) {
        return
    }
    errorMessage.value = '' // Clear previous errors

    console.log('Next clicked:', props.username, password.value)
    registerMutation.mutate({
        Email: props.Email,
        Username: props.username,
        Password: password.value,
        Language: 'en',
    })
}
</script>

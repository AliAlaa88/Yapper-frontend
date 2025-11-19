<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-alternate/10 backdrop-blur-sm p-4"
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
            <h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.login.title') }}</h2>

            <!-- Email -->
            <input
                id="input-identifier-readonly-login-s2"
                type="text"
                :placeholder="props.identifier"
                :value="props.identifier"
                readonly
                class="w-full bg-primary text-primary border-2 border-primary rounded-md px-4 py-2 focus:outline-none mb-4 opacity-70 shadow-sm"
            />

            <!-- Password -->
            <div class="mb-4">
                <input
                    id="input-password-login-s2"
                    type="password"
                    :placeholder="$t('auth.common.password')"
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

            <!-- Error Message -->
            <p v-if="errorMessage" id="error-message-login-s2" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>

            <!-- Forgot password -->
            <div
                id="link-forgot-password-login-s2"
                class="text-blue hover:underline font-semibold cursor-pointer transition duration-200 mb-6 text-left"
                @click="onForgotPassword"
            >
                {{ $t('auth.login.forgotPassword') }}
            </div>

            <!-- Login Button -->
            <button
                id="button-login-s2"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3"
                @click="onNext"
            >
                {{ $t('auth.common.signIn') }}
            </button>

            <p class="text-center text-primary text-sm">
                {{ $t('auth.login.switchPrompt') }}
                <button
                    id="button-switch-to-signup-login-s2"
                    class="text-blue hover:underline font-semibold cursor-pointer transition duration-200"
                    @click="$emit('switch')"
                >
                    {{ $t('auth.common.signUp') }}
                </button>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Logo from '~/modules/Common/components/Logo'
import { useLoginQuery } from '../../../queries/useLoginQuery'
import { useUserStore } from '~/modules/auth/stores/userStore'
import closeButton from '../closeButton.vue'
import { validatePassword } from '../../../utils/validators'

const errorMessage = ref('')
const passwordError = ref('')
const password = ref('')
const props = defineProps<{
    identifier: string
    type: string
}>()

const emit = defineEmits<{
    (e: 'finish'): void
    (e: 'back'): void
    (e: 'close'): void
    (e: 'switch'): void
}>()

const loginMutation = useLoginQuery(
    (data: any) => {
        console.log('Login Success:', data.data)
        const userStore = useUserStore()
        userStore.setAuth(data.data)
        errorMessage.value = ''
        emit('finish')
    },
    (error: any) => {
        console.error('Login Error:', error)
        // Extract error message from backend response or network error
        const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            'Invalid credentials. Please try again.'
        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
        useUserStore().logout()
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
    const type = props.type

    loginMutation.mutate({
        identifier: props.identifier,
        Password: password.value,
        Type: type,
    })
}

const onForgotPassword = () => {
    console.log('Forgot password clicked')
    window.location.href = '/auth/forgot-password'
}
</script>

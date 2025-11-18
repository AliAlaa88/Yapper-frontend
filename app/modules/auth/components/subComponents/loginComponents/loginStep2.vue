<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4"
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
            <h2 class="text-3xl font-bold text-left mb-6">Sign in to X</h2>

            <!-- Email -->
            <input
                id="input-identifier-readonly-login-s2"
                type="text"
                placeholder="{{ props.identifier }}"
                :value="props.identifier"
                readonly
                class="w-full bg-transparent border border-primary rounded-md px-4 py-2 focus:outline-none mb-4"
            />

            <!-- Password -->
            <input
                id="input-password-login-s2"
                type="password"
                placeholder="Password"
                v-model="password"
                class="w-full bg-transparent border border-primary rounded-md px-4 py-2 focus:outline-none focus:border-primary mb-4"
            />

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
                Forgot password?
            </div>

            <!-- Login Button -->
            <button
                id="button-login-s2"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3"
                @click="onNext"
            >
                Login
            </button>

            <p class="text-center text-primary text-sm">
                Don't have an account?
                <button
                    id="button-switch-to-signup-login-s2"
                    class="text-blue hover:underline font-semibold cursor-pointer transition duration-200"
                    @click="$emit('switch')"
                >
                    Sign up
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
import backButton from '../backButton.vue'

// Use v-model for password
const password = defineModel<string>('password', { default: '' })

const errorMessage = ref('')

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

const onNext = () => {
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

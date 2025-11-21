<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="false"
        contentClass="max-w-lg sm:max-w-xl w-full"
        headerClass=""
        slotClass="p-8 sm:p-10 md:p-14 lg:p-20"
    >
        <!-- Back Button -->
        <backButton @close="$emit('back')" />

        <!-- Logo -->
        <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.login.title') }}</h2>

            <!-- Email -->
            <form @submit.prevent="onNext">
            <input
                id="input-identifier-readonly-login-s2"
                type="text"
                :placeholder="props.identifier"
                :value="props.identifier"
                readonly
                class="w-full bg-primary text-primary border-2 border-alternate focus:border-blue rounded-md px-4 py-2 focus:outline-none mb-4 opacity-70 shadow-sm"
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
                        'w-full bg-primary text-primary border-2 border-alternate rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors shadow-sm',
                        passwordError ? 'border-red focus:border-red' : ''
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
                type="submit"
            >
                {{ $t('auth.common.signIn') }}
            </button>
            </form>
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
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Logo from '~/modules/Common/components/Logo'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import backButton from '../backButton.vue'
import { useLoginQuery } from '../../../queries/useLoginQuery'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { validatePassword } from '../../../utils/validators'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

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

const { t } = useI18n()

const validatePasswordField = () => {
    const result = validatePassword(password.value)
    passwordError.value = result.valid ? '' : (result.messageKey ? t(result.messageKey) : '')
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

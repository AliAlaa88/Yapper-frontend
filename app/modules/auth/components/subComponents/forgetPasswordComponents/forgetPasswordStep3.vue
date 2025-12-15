<template>
    <Popup
        :is-open="true"
        :has-close-button="false"
        :has-back-button="true"
        content-class="max-w-lg sm:max-w-xl w-full"
        header-class=""
        slot-class="p-8 sm:p-10 md:p-14 lg:p-20"
        @close="$emit('close')"
        @back="$emit('back')"
    >
        <!-- Back Button -->

        <!-- Logo -->
        <Logo img-class="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

        <!-- Title -->
        <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">
            {{ $t('auth.forgotPassword.step3Title') }}
        </h2>
        <!-- Description -->
        <p class="text-muted mb-6">{{ $t('auth.forgotPassword.step3Info') }}</p>

        <!-- Input -->
        <form @submit.prevent="onFinish">
            <div class="mb-4">
                <input
                    id="input-password-forgot-password-s3"
                    v-model="password"
                    type="password"
                    :placeholder="$t('auth.forgotPassword.passwordPlaceholder')"
                    :class="[
                        'w-full bg-primary text-primary border border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors shadow-sm',
                        passwordError ? 'border-red focus:border-red' : '',
                    ]"
                    @blur="validatePasswordField"
                >
                <p v-if="passwordError" class="text-red text-xs mt-1">{{ passwordError }}</p>
            </div>

            <div class="mb-4">
                <input
                    id="input-verify-password-forgot-password-s3"
                    v-model="verifyPassword"
                    type="password"
                    :placeholder="$t('auth.forgotPassword.verifyPasswordPlaceholder')"
                    :class="[
                        'w-full bg-primary text-primary border border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors shadow-sm',
                        matchError ? 'border-red focus:border-red' : '',
                    ]"
                >
                <p v-if="matchError" class="text-red text-xs mt-1">{{ matchError }}</p>
                <p
                    v-if="!matchError && verifyPassword && password === verifyPassword"
                    class="text-green text-xs mt-1"
                >
                    ✓ Passwords match
                </p>
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
            <Button
                id="button-reset-password-forgot-password-s3"
                button-class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold rounded-full py-2 transition mb-3 duration-200"
                :loading-text="t('auth.common.loading')"
                :is-loading="loading"
                type="submit"
            >
                {{ $t('auth.forgotPassword.resetButton') }}
            </Button>
        </form>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResetPasswordQuery } from '../../../queries/useForgetPasswordQuery'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import { validatePassword } from '../../../utils/validators'
import Button from '~/modules/Common/components/Button/Button.vue'

const { locale, t } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

// Use v-model for password fields
const password = defineModel<string>('password', { default: '' })
const verifyPassword = defineModel<string>('confirmPassword', { default: '' })

const errorMessage = ref('')
const passwordError = ref('')
const matchError = ref('')
const loading = ref(false)

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
        errorMessage.value = ''
        loading.value = false
        emit('finish')
    },
    (error: any) => {
        console.error('Reset Password Error:', error)
        const errorMsg = error?.response?.data?.message || 'An error occurred. Please try again.'
        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
        loading.value = false
    },
)

const validatePasswordField = () => {
    const result = validatePassword(password.value)
    passwordError.value = result.valid ? '' : result.messageKey ? t(result.messageKey) : ''
    return result.valid
}

const clearPasswordError = () => {
    passwordError.value = ''
    errorMessage.value = ''
}

const clearMatchError = () => {
    matchError.value = ''
}

const validatePasswordMatch = (pwd: string, confirmPwd: string) => {
    if (!confirmPwd) return ''
    return pwd === confirmPwd ? '' : 'Passwords do not match.'
}

watch([password, verifyPassword], ([pwd, confirmPwd]) => {
    matchError.value = validatePasswordMatch(pwd, confirmPwd)
})

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

    loading.value = true
    resetPasswordMutation.mutate({
        identifier: props.identifier,
        reset_token: props.reset_token,
        newPassword: password.value,
    })
}
</script>

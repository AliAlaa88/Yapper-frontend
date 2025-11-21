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
        <backButton @close="$emit('close')" />

        <!-- Logo -->
        <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.finalRegister.title') }}</h2>
            <p class="text-muted mb-6">{{ $t('auth.finalRegister.info') }}</p>

            <!-- Error Message -->
            <p v-if="errorMessage" id="error-message-signup-s3" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>

            <!-- Password Input -->
            <form @submit.prevent="onNext">
            <div class="mb-4">
                <input
                    id="input-password-signup-s3"
                    type="password"
                    :placeholder="$t('auth.finalRegister.passwordPlaceholder')"
                    v-model="password"
                    @blur="validatePasswordField"
                    @input="clearPasswordError"
                    :class="[
                        'w-full bg-primary text-primary border-2 border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors shadow-sm',
                        passwordError ? 'border-red focus:border-red' : ''
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
                type="submit"
            >
                {{ $t('auth.finalRegister.signUpButton') }}
            </button>
            </form>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegisterS3Query } from '../../../queries/useRegisterQuery'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'
import { validatePassword } from '../../../utils/validators'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

// Use v-model for password and language
const password = defineModel<string>('password', { default: '' })
const language = defineModel<string>('language', { default: 'en' })

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

    registerMutation.mutate({
        Email: props.Email,
        Username: props.username,
        Password: password.value,
        Language: 'en',
    })
}
</script>

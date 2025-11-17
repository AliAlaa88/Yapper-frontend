<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4"
    >
        <div
            class="bg-primary text-primary rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center"
        >
            <!-- Close Button -->
            <closeButton @close="$emit('close')" />

            <!-- Logo -->
            <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.login.title') }}</h2>

            <!--OAuth Buttons-->
            <OAuth />

            <!-- OR Divider -->
            <div class="flex items-center my-4 w-full">
                <div class="flex-1 h-px bg-primary"></div>
                <span class="px-3 text-primary text-sm">{{ $t('auth.common.or') }}</span>
                <div class="flex-1 h-px bg-primary"></div>
            </div>

            <!-- Input -->
            <div class="mb-4">
                <input
                    id="input-identifier-login"
                    type="text"
                    :placeholder="$t('auth.login.identifierPlaceholder')"
                    v-model="identifier"
                    @blur="validateIdentifierField"
                    @input="clearValidationError"
                    :class="[
                        'w-full bg-transparent border rounded-md px-4 py-2 focus:outline-none transition-colors',
                        validationError ? 'border-red focus:border-red' : 'border-primary focus:border-primary'
                    ]"
                />
                <p v-if="validationError" class="text-red text-xs mt-1">{{ validationError }}</p>
            </div>
            <p v-if="errorMessage" id="error-message-login-s1" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>
            <!-- Next Button -->
            <button
                id="button-next-login-s1"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </button>

            <!-- Forgot password -->
            <button
                id="button-forgot-password-login"
                class="w-full border border-primary bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-6"
                @click="onForgotPassword"
            >
                {{ $t('auth.login.forgotPassword') }}
            </button>

            <p class="text-center text-primary text-sm">
                {{ $t('auth.login.switchPrompt') }}
                <button
                    id="button-switch-to-signup"
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
import logo from '~/modules/Common/components/Logo'
import OAuth from '../OAuth.vue'
import { useCheckIdentifierAvailabilityQuery } from '~/modules/auth/queries/useLoginQuery'
import closeButton from '../closeButton.vue'
import { validateIdentifier } from '../../../utils/validators'

const identifier = ref('')
const errorMessage = ref('')
const validationError = ref('')

const emit = defineEmits<{
    (e: 'next', identifier: string, identifierType: string): void
    (e: 'close'): void
    (e: 'switch'): void
}>()

const checkMutation = useCheckIdentifierAvailabilityQuery(
    (data: any) => {
        console.log('Identifier exists. Proceeding to next step.')
        const Type = data?.data?.identifier_type
        errorMessage.value = ''
        emit('next', identifier.value, Type)
    },
    (error: any) => {
        console.log('Identifier does not exist or error occurred:', error)

        // Extract error message from response
        const errorMsg =
            error?.response?.data?.message ||
            'Identifier does not exist or error occurred. Please try again.'
        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
    },
)

const validateIdentifierField = () => {
    const result = validateIdentifier(identifier.value)
    validationError.value = result.valid ? '' : result.message || ''
    return result.valid
}

const clearValidationError = () => {
    validationError.value = ''
    errorMessage.value = ''
}

const onNext = () => {
    // Validate before submitting
    if (!validateIdentifierField()) {
        return
    }
    errorMessage.value = '' // Clear previous errors
    checkMutation.mutate(identifier.value)
}

const onForgotPassword = () => {
    console.log('Forgot password clicked')
    window.location.href = '/auth/forgot-password'
}
</script>

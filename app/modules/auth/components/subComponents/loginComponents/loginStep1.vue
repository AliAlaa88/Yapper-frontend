<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="true"
        contentClass="sm:max-w-xl w-full"
        container-class="bg-auth-popup"
        :headerClass="isArabic ? 'absolute top-4 right-4 z-10 bg-transparent p-0' : 'absolute top-4 left-4 z-10 bg-transparent p-0'"
        slotClass="py-8 md:min-w-lg px-12 md:px-16 lg:px-20"
    >
        <!-- Logo -->
        <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.login.title') }}</h2>

            <!--OAuth Buttons-->
            <OAuth />

            <!-- OR Divider -->
            <div class="flex items-center my-4 w-full">
                <div class="flex-1 h-px border-t border-primary"></div>
                <span class="px-3 text-muted text-sm">{{ $t('auth.common.or') }}</span>
                <div class="flex-1 h-px border-t border-primary"></div>
            </div>

            <!-- Input -->
            <form @submit.prevent="onNext">
            <div class="mb-4">
                <input
                    id="input-identifier-login"
                    type="text"
                    :placeholder="$t('auth.login.identifierPlaceholder')"
                    v-model="identifier"
                    @blur="validateIdentifierField"
                    @input="clearValidationError"
                    :class="[
                        'w-full bg-primary text-primary border border-alternate rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors shadow-sm',
                        validationError ? 'border-red focus:border-red' : ''
                    ]"
                />
                <p v-if="validationError" class="text-red text-xs mt-1">{{ validationError }}</p>
            </div>
            <p v-if="errorMessage" id="error-message-login-s1" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>
            <!-- Next Button -->
            <Button
                id="button-next-login-s1"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold rounded-full py-2 transition mb-3"
                type="submit"
                :is-loading="loading"
                :loading-text="t('auth.common.loading')"
            >
                {{ $t('auth.common.next') }}
            </Button>
            </form>
            <!-- Forgot password -->
            <Button
                id="button-forgot-password-login"
                class="w-full border border-alternate text-primary hover:bg-hover font-semibold rounded-full py-2 transition mb-6 hover:border-blue"
                @click="onForgotPassword"
                :is-loading="loading"
                :loading-text="t('auth.common.loading')"
            >
                {{ $t('auth.login.forgotPassword') }}
            </Button>

            <p class="text-center text-primary text-sm">
                {{ $t('auth.login.switchPrompt') }}
                <Button
                    id="button-switch-to-signup"
                    buttonClass="text-accent hover:underline font-semibold transition duration-200"
                    @click="$emit('switch')"
                >
                    {{ $t('auth.common.signUp') }}
                </Button>
            </p>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import logo from '~/modules/Common/components/Logo'
import OAuth from '../OAuth.vue'
import { useCheckIdentifierAvailabilityQuery } from '~/modules/auth/queries/useLoginQuery'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import { validateIdentifier } from '../../../utils/validators'
import Button from '~/modules/Common/components/ui/Button.vue'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

// Use v-model for identifier
const identifier = defineModel<string>('identifier', { default: '' })
const loading = ref(false)
const errorMessage = ref('')
const validationError = ref('')

const emit = defineEmits<{
    (e: 'next', identifier: string, identifierType: string): void
    (e: 'close'): void
    (e: 'switch'): void
}>()

const checkMutation = useCheckIdentifierAvailabilityQuery(
    (data: any) => {
        const Type = data?.data?.identifier_type
        errorMessage.value = ''
        loading.value = false
        emit('next', identifier.value, Type)
    },
    (error: any) => {

        // Extract error message from response
        const errorMsg =
            error?.response?.data?.message ||
            'Identifier does not exist or error occurred. Please try again.'
        if (Array.isArray(errorMsg)) errorMessage.value = errorMsg[0]
        else errorMessage.value = errorMsg
        loading.value = false
    },
)

const { t } = useI18n()

const validateIdentifierField = () => {
    const result = validateIdentifier(identifier.value)
    validationError.value = result.valid ? '' : (result.messageKey ? t(result.messageKey) : '')
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
    loading.value = true
    checkMutation.mutate(identifier.value)
}

const onForgotPassword = () => {
    window.location.href = '/auth/forgot-password'
}
</script>

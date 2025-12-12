<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="true"
        contentClass="max-w-lg sm:max-w-xl w-full"
        :headerClass="isArabic ? 'absolute top-4 right-4 z-10 bg-transparent p-0' : 'absolute top-4 left-4 z-10 bg-transparent p-0'"
        slotClass="p-8 sm:p-10 md:p-14 lg:p-20"
    >
        <!-- Logo -->
        <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" divClass="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.forgotPassword.step1Title') }}</h2>
            <!-- Description -->
            <p class="text-muted mb-6">{{ $t('auth.forgotPassword.step1Info') }}</p>

            <!-- Input -->
            <form @submit.prevent="onNext">
            <input
                id="input-identifier-forgot-password-s1"
                type="text"
                :placeholder="$t('auth.forgotPassword.identifierPlaceholder')"
                v-model="identifier"
                class="w-full bg-primary text-primary border border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue mb-4 shadow-sm transition-colors"
            />

            <!-- Error Message -->
            <p
                v-if="errorMessage"
                id="error-message-forgot-password-s1"
                class="text-red text-sm mb-4"
            >
                {{ errorMessage }}
            </p>

            <!-- Next Button -->
            <Button
                id="button-next-forgot-password-s1"
                buttonClass="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold rounded-full py-2 transition mb-3 duration-200"
                :loading-text="$t('auth.common.loading')"
                :is-loading="loading"
                type="submit"
            >
                {{ $t('auth.common.next') }}
            </Button>
            </form>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Logo from '~/modules/Common/components/Logo'
import { useForgotPasswordQuery } from '../../../queries/useForgetPasswordQuery'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Button from '~/modules/Common/components/Button/Button.vue'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

// Use v-model for identifier
const identifier = defineModel<string>('identifier', { default: '' })

const errorMessage = ref('')
const loading = ref(false)

const emit = defineEmits<{
    (e: 'next', identifier: string): void
    (e: 'close'): void
}>()

const config = useRuntimeConfig()
const forgotPasswordMutation = useForgotPasswordQuery(
    (data: any) => {
        errorMessage.value = ''
        loading.value = false
        if (config.public.env === 'development')
            console.log('Forgot Password Step 1 Success:', data)
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
        loading.value = false
    },
)

const onNext = () => {
    errorMessage.value = '' // Clear previous errors
    loading.value = true
    forgotPasswordMutation.mutate({ identifier: identifier.value })
}
</script>

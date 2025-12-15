<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="true"
        container-class="bg-auth-popup"
        contentClass="max-w-lg sm:max-w-xl w-full"
        :headerClass="isArabic ? 'absolute top-4 right-4 z-10 bg-transparent p-0' : 'absolute top-4 left-4 z-10 bg-transparent p-0'"
        slotClass="p-8 sm:p-10 md:p-14 lg:p-20"
    >
        <!-- Logo -->
        <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" divClass="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.oauth.dobTitle') }}</h2>
            <!-- Description -->
            <p class="text-muted mb-6">{{ $t('auth.oauth.dobInfo') }}</p>

            <!-- Date of Birth Dropdowns -->
             <form @submit.prevent="onNext">
            <div class="flex gap-3 mb-4">
                <!-- Month -->
                <div class="flex-1 relative">
                    <select
                        id="select-month-oauth-s1"
                        v-model="month"
                        class="w-full bg-primary text-primary border border-primary rounded-md px-4 py-3 focus:outline-none focus:border-accent appearance-none shadow-sm transition-colors cursor-pointer"
                    >
                        <option value="" disabled selected>{{ $t('auth.oauth.month') }}</option>
                        <option v-for="m in months" :key="m.value" :value="m.value">
                            {{ m.label }}
                        </option>
                    </select>
                    <span
                        class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-muted"
                        :class="isArabic ? 'left-3' : 'right-3'"
                        >▼</span
                    >
                </div>

                <!-- Day -->
                <div class="flex-1 relative">
                    <select
                        id="select-day-oauth-s1"
                        v-model="day"
                        class="w-full bg-primary text-primary border border-primary rounded-md px-4 py-3 focus:outline-none focus:border-accent appearance-none shadow-sm transition-colors cursor-pointer"
                    >
                        <option value="" disabled selected>{{ $t('auth.oauth.day') }}</option>
                        <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
                    </select>
                    <span
                        class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-muted"
                        :class="isArabic ? 'left-3' : 'right-3'"
                        >▼</span
                    >
                </div>

                <!-- Year -->
                <div class="flex-1 relative">
                    <select
                        id="select-year-oauth-s1"
                        v-model="year"
                        class="w-full bg-primary text-primary border border-primary rounded-md px-4 py-3 focus:outline-none focus:border-accent appearance-none shadow-sm transition-colors cursor-pointer"
                    >
                        <option value="" disabled selected>{{ $t('auth.oauth.year') }}</option>
                        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                    </select>
                    <span
                        class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-muted"
                        :class="isArabic ? 'left-3' : 'right-3'"
                        >▼</span
                    >
                </div>
            </div>

            <!-- Error Message -->
            <p v-if="errorMessage" id="error-message-oauth-s1" class="text-red text-sm mb-4">
                {{ errorMessage }}
            </p>

            <p class="text-muted text-xs mb-4">
                {{ $t('auth.oauth.termsText') }}
            </p>

            <!-- Next Button -->
            <Button
                id="button-signup-oauth-s1"
                buttonClass="w-full bg-alternate text-alternate font-semibold rounded-full py-2 hover:bg-hover-alternate transition mb-3 duration-200"
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
import { useOAuthCompleteStep1Query } from '~/modules/auth/queries/useOAuthQuery'
import { useOAuthCompleteStep2Query } from '~/modules/auth/queries/useOAuthQuery'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Button from '~/modules/Common/components/Button/Button.vue'
import { useUserStore } from '~/modules/auth/stores/userStore';
import { validateDateOfBirth } from '../../../utils/validators'
import { y } from 'happy-dom/lib/PropertySymbol.js'
const userStore = useUserStore()
const { locale, t } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const month = ref('')
const day = ref('')
const year = ref('')
const errorMessage = ref('')
const recommendations = ref<string[]>([])
const loading = ref(false)
// Month options
const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
]

// Day options (1-31)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

// Year options (current year down to 120 years ago)
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 120 }, (_, i) => currentYear - i)

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'finish', Recommendations: string[]): void
}>()

const props = defineProps<{
    OAuth_session_token: string
}>()

const oauthCompleteStep1Mutation = useOAuthCompleteStep1Query(
    (data: any) => {
        errorMessage.value = ''
        recommendations.value = data?.data?.usernames || []

        oauthCompleteStep2Mutation.mutate({
            OAuth_session_token: props.OAuth_session_token,
            Username: recommendations.value[0] || '',
        })
    },
    (error: any) => {
        console.error('OAuth Step 1 Complete Error:', error)
        const apiMessage = error?.response?.data?.message
        
        // If API returns a string message, use it directly (don't translate backend errors)
        if (apiMessage) {
            errorMessage.value = apiMessage
        } else {
            errorMessage.value = t('messages.error')
        }
        loading.value = false
    },
)

const oauthCompleteStep2Mutation = useOAuthCompleteStep2Query(
    (data: any) => {
        userStore.setAuth(data.data)
        errorMessage.value = ''
        loading.value = false
        emit('finish', recommendations.value)
    },
    (error: any) => {
        console.error('OAuth Step 2 Complete Error:', error)
        errorMessage.value =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'An unexpected error occurred. Please try again.'
        loading.value = false
    },
)

const onNext = async () => {
    errorMessage.value = ''
    const dateOfBirth =
        month.value && day.value && year.value
            ? `${year.value}-${month.value.padStart(2, '0')}-${day.value.toString().padStart(2, '0')}`
            : ''
    const validation = validateDateOfBirth(year.value, month.value, day.value)
    if (!validation.valid) {
        errorMessage.value = validation.messageKey ? t(validation.messageKey) : t('auth.validation.dobInvalid')
        return
    }
    if (!month.value || !day.value || !year.value) {
        errorMessage.value = t('auth.validation.dobRequired')
        return
    }

    loading.value = true
    oauthCompleteStep1Mutation.mutate({
        OAuth_session_token: props.OAuth_session_token,
        Birth_date: dateOfBirth,
    })
}
</script>

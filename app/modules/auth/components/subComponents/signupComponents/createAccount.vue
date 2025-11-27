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
        <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold mb-6 text-primary" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.signup.title') }}</h2>

            <!-- Name Input -->
        <form @submit.prevent="onNext">
            <div class="mb-4">
                <input
                    id="input-name-signup-s1"
                    type="text"
                    :placeholder="$t('auth.signup.namePlaceholder')"
                    v-model="name"
                    @blur="validateNameField"
                    @input="clearNameError"
                    :class="[
                        'w-full bg-primary text-primary border-2 border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors shadow-sm',
                        nameError ? 'border-red focus:border-red' : ''
                    ]"
                />
                <p v-if="nameError" class="text-red text-xs mt-1">{{ nameError }}</p>
            </div>

            <!-- Email Input -->
            <div class="mb-4">
                <input
                    id="input-email-signup-s1"
                    type="email"
                    :placeholder="$t('auth.signup.emailPlaceholder')"
                    v-model="email"
                    @blur="validateEmailField"
                    @input="clearEmailError"
                    :class="[
                        'w-full bg-primary text-primary border-2 border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors shadow-sm',
                        emailError ? 'border-red focus:border-red' : ''
                    ]"
                />
                <p v-if="emailError" class="text-red text-xs mt-1">{{ emailError }}</p>
            </div>
            <h3 class="text-l font-bold" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.signup.dobTitle') }}</h3>
            <p class="text-primary mb-4 text-sm">{{ $t('auth.signup.dobInfo') }}</p>
            <p v-if="dobError" class="text-red text-xs mb-2">{{ dobError }}</p>
            <!-- Date of Birth Dropdowns -->
            <div class="flex gap-3 mb-4">
                <!-- Month -->
                <div class="flex-1 relative">
                    <select
                        id="select-month-signup-s1"
                        v-model="month"
                        class="w-full bg-primary text-primary cursor-pointer border-2 border-primary rounded-md px-4 py-3 focus:outline-none focus:border-blue appearance-none shadow-sm transition-colors"
                    >
                        <option value="" disabled selected>{{ $t('auth.signup.month') }}</option>
                        <option v-for="m in months" :key="m.value" :value="m.value">
                            {{ m.label }}
                        </option>
                    </select>
                    <span
                        class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-primary"
                        :class="isArabic ? 'left-3' : 'right-3'"
                        >▼</span
                    >
                </div>

                <!-- Day -->
                <div class="flex-1 relative">
                    <select
                        id="select-day-signup-s1"
                        v-model="day"
                        class="w-full bg-primary text-primary cursor-pointer border-2 border-primary rounded-md px-4 py-3 focus:outline-none focus:border-blue appearance-none shadow-sm transition-colors"
                    >
                        <option value="" disabled selected>{{ $t('auth.signup.day') }}</option>
                        <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
                    </select>
                    <span
                        class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-primary"
                        :class="isArabic ? 'left-3' : 'right-3'"
                        >▼</span
                    >
                </div>

                <!-- Year -->
                <div class="flex-1 relative">
                    <select
                        id="select-year-signup-s1"
                        v-model="year"
                        class="w-full bg-primary text-primary cursor-pointer border-2 border-primary rounded-md px-4 py-3 focus:outline-none focus:border-blue appearance-none shadow-sm transition-colors"
                    >
                        <option value="" disabled selected>{{ $t('auth.signup.year') }}</option>
                        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                    </select>
                    <span
                        class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-primary"
                        :class="isArabic ? 'left-3' : 'right-3'"
                        >▼</span
                    >
                </div>
            </div>
            <!-- Next Button -->
            <button
                id="button-next-signup-s1"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3"
                type="submit"
            >
                {{ $t('auth.common.next') }}
            </button>
            </form>
            <!-- reCAPTCHA -->
            <div class="flex justify-center mt-4">
                <Recaptcha
                    ref="recaptchaRef"
                    class="w-fit cursor-pointer"
                    @verified="onRecaptchaVerified"
                    @error="onCaptchaError"
                />
            </div>
            <h3 id="error-message-signup-s1" class="text-red text-sm mt-2" v-if="error">
                {{ error }}
            </h3>
            <h3 class="text-green text-sm mt-2" v-if="success">{{ success }}</h3>
    </Popup>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Logo from '~/modules/Common/components/Logo'
import Recaptcha from '../recaptcha.vue'
import { useRegisterS1Query } from '../../../queries/useRegisterQuery'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import { validateName, validateEmail, validateDateOfBirth } from '../../../utils/validators'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const name = defineModel<string>('name', { default: '' })
const email = defineModel<string>('email', { default: '' })
const month = defineModel<string>('month', { default: '' })
const day = defineModel<string>('day', { default: '' })
const year = defineModel<string>('year', { default: '' })

const error = ref('')
const success = ref('')
const nameError = ref('')
const emailError = ref('')
const dobError = ref('')

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

// Recaptcha token
const recaptchaRef = ref<{ run: () => Promise<void> } | null>(null)
const recaptcha = ref('')
const onRecaptchaVerified = (token: string) => {
    recaptcha.value = token
}
const onCaptchaError = () => {
}
const registerMutation = useRegisterS1Query(
    (data) => {
        success.value = 'Registration successful! Please verify your email.'
        error.value = ''
        emit('next', email.value)
    },
    (err: any) => {
        const errorMsg =
            err?.response?.data?.message || err?.message || 'Registration failed. Please try again.'
        if (Array.isArray(errorMsg)) error.value = errorMsg[0]
        else error.value = errorMsg
        success.value = ''
    },
)
const emit = defineEmits<{
    (e: 'next', email: string): void
    (e: 'close'): void
}>()

const { t } = useI18n()

// Validation functions
const validateNameField = () => {
    const result = validateName(name.value)
    nameError.value = result.valid ? '' : (result.messageKey ? t(result.messageKey) : '')
    return result.valid
}

const validateEmailField = () => {
    const result = validateEmail(email.value)
    emailError.value = result.valid ? '' : (result.messageKey ? t(result.messageKey) : '')
    return result.valid
}

const validateDobField = () => {
    const result = validateDateOfBirth(year.value, month.value, day.value)
    dobError.value = result.valid ? '' : (result.messageKey ? t(result.messageKey) : '')
    return result.valid
}

const clearNameError = () => {
    nameError.value = ''
}

const clearEmailError = () => {
    emailError.value = ''
    error.value = ''
}

// Watch for DOB changes to clear error
watch([month, day, year], () => {
    if (dobError.value) {
        dobError.value = ''
    }
})

watch(recaptcha, (newVal) => {
    if (newVal && error.value === 'Please complete the reCAPTCHA.') {
        error.value = ''
    }
})

watch(email,()=>{
 error.value=''   
})

const onNext = async () => {
    // Validate all fields
    const isNameValid = validateNameField()
    const isEmailValid = validateEmailField()
    const isDobValid = validateDobField()

    if (!isNameValid || !isEmailValid || !isDobValid) {
        error.value = 'Please fix the errors above'
        return
    }
    // Combine date values if needed
    const dateOfBirth =
        month.value && day.value && year.value
            ? `${year.value}-${month.value.padStart(2, '0')}-${day.value.toString().padStart(2, '0')}`
            : ''

    if (!recaptcha.value) {
        error.value = 'Please complete the reCAPTCHA.'
        await recaptchaRef.value?.run()
    } else {
        error.value = '' // Clear previous errors
        success.value = ''

        registerMutation.mutate({
            Name: name.value,
            Email: email.value,
            Birth_date: dateOfBirth,
            Captcha_token: recaptcha.value,
        })
    }
}
</script>

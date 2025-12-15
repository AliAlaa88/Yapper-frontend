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
            {{ $t('auth.language.title') }}
        </h2>
        <p class="text-muted mb-6">{{ $t('auth.language.info') }}</p>

        <!-- Language List -->
        <div class="mb-6">
            <button
                v-for="lang in languages"
                :id="`button-language-${lang.code}`"
                :key="lang.code"
                :class="[
                    'w-full text-left px-4 py-3 rounded-lg transition duration-200 flex items-center justify-between',
                    selectedLanguage === lang.code
                        ? 'bg-alternate text-alternate'
                        : 'text-primary hover:bg-hover',
                ]"
                @click="selectLanguage(lang.code)"
            >
                <span>{{ lang.name }} ({{ lang.nativeName }})</span>
                <svg
                    v-if="selectedLanguage === lang.code"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
        </div>

        <!-- Next Button -->
        <Button
            id="button-next-language"
            :disabled="!selectedLanguage"
            button-class="w-full font-semibold rounded-full py-2 transition mb-3"
            :class="[
                selectedLanguage
                    ? 'bg-alternate hover:bg-hover-alternate text-alternate'
                    : 'bg-alternate text-alternate',
            ]"
            :loading-text="$t('auth.common.loading')"
            :is-loading="loading"
            @click="onNext"
        >
            {{ $t('auth.common.next') }}
        </Button>

        <!-- Skip Button -->
        <Button
            id="button-skip-language"
            class="w-full text-primary hover:text-blue transition duration-200"
            @click="onSkip"
        >
            {{ $t('auth.common.skip') }}
        </Button>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'

import { useUpdateLanguageMutation } from '../../../queries/useCompleteProfileQuery'
import { LOCALE_COOKIE_KEY } from '~/modules/Common/constants/localStorageConstants'
import Button from '~/modules/Common/components/Button/Button.vue'

const { locale, setLocale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const errorMessage = ref('')
const isSubmitting = ref(false)
const loading = ref(false)

interface Language {
    code: string
    name: string
    nativeName: string
}

const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
]

// Use v-model for selected language
const selectedLanguage = defineModel<string | null>('selectedLanguage', { default: null })

const emit = defineEmits<{
    (e: 'next', language: string): void
    (e: 'skip'): void
    (e: 'back'): void
    (e: 'close'): void
}>()

const selectLanguage = (code: string) => {
    selectedLanguage.value = code
}

const config = useRuntimeConfig()

function setCookie(name: string, value: string, days = 365) {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const languageMutation = useUpdateLanguageMutation(
    (data) => {
        isSubmitting.value = false
        loading.value = false
        errorMessage.value = ''
        // Update locale cookie
        const newLocale = selectedLanguage.value || 'en'
        setLocale(newLocale)
        if (config.public.env === 'development')
            console.log('Setting locale cookie to:', selectedLanguage.value)
        setCookie(LOCALE_COOKIE_KEY, selectedLanguage.value || 'en')
        emit('next', selectedLanguage.value!)
    },
    (error) => {
        console.error('Language update error:', error)
        isSubmitting.value = false
        loading.value = false
        const errorMsg =
            error?.response?.data?.message || error?.message || 'Failed to update language'
        errorMessage.value = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
    },
)

const onNext = () => {
    if (selectedLanguage.value && !isSubmitting.value) {
        isSubmitting.value = true
        loading.value = true
        languageMutation.mutate({ language: selectedLanguage.value })
    }
}

const onSkip = () => {
    emit('skip')
}
</script>

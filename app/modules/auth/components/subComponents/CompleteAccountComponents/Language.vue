<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="false"
        @back="$emit('back')"
        :hasBackButton="true"
        contentClass="max-w-lg sm:max-w-xl w-full"
        headerClass=""
        slotClass="pt-4 px-8 pb-8 sm:pt-6 sm:px-10 sm:pb-10"
    >
        <!-- Logo at top -->
        <div class="flex justify-center mb-6">
            <Logo imgClass="w-8 lg:w-10" />
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold mb-2" :class="isArabic ? 'text-right' : 'text-left'">
            {{ $t('auth.language.title') }}
        </h2>
        <p class="text-muted text-sm mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.language.info') }}</p>

        <!-- Language List -->
        <div class="mb-6">
            <div
                v-for="lang in displayedLanguages"
                :key="lang.code"
                :id="`button-language-${lang.code}`"
                class="flex items-center justify-between py-4 border-b border-primary cursor-pointer"
                @click="selectLanguage(lang.code)"
            >
                <span class="text-primary">{{ lang.nativeName }} - {{ lang.name }}</span>
                <div 
                    class="w-5 h-5 border-2 rounded flex items-center justify-center transition"
                    :class="selectedLanguage === lang.code ? 'bg-blue border-blue' : 'border-muted'"
                >
                    <svg
                        v-if="selectedLanguage === lang.code"
                        class="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </div>
            <!-- Show More button -->
            <button
                v-if="!showAllLanguages && languages.length > languagesToShow"
                @click="showAllLanguages = true"
                class="mt-4 text-blue hover:text-blue-light transition duration-200 text-sm w-full text-center"
            >
                {{ $t('auth.language.showMore') || 'Show more' }}
            </button>
        </div>

        <!-- Next Button -->
        <Button
            id="button-next-language"
            :disabled="!selectedLanguage"
            buttonClass="w-full font-semibold rounded-full py-3 transition"
            :class="[
                selectedLanguage
                    ? 'bg-alternate hover:bg-hover-alternate text-alternate'
                    : 'bg-muted text-muted opacity-50 cursor-not-allowed',
            ]"
            :loading-text="$t('auth.common.loading')"
            :is-loading="loading"
            @click="onNext"
        >
            {{ $t('auth.common.next') }}
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
const showAllLanguages = ref(false)
const languagesToShow = 2

interface Language {
    code: string
    name: string
    nativeName: string
}

const languages: Language[] = [
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'en', name: 'English', nativeName: 'English' },
]

const displayedLanguages = computed(() => {
    if (showAllLanguages.value) {
        return languages
    }
    return languages.slice(0, languagesToShow)
})

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

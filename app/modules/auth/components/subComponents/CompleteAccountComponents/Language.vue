<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-alternate/10 backdrop-blur-sm p-4"
    >
        <div
            class="bg-primary text-primary rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center"
        >
            <!-- Close Button -->
            <closeButton @close="$emit('close')" />

            <!-- Logo -->
            <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Back Button -->
            <backButton @close="$emit('back')" />

            <!-- Title -->
            <h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.language.title') }}</h2>
            <p class="text-muted mb-6">{{ $t('auth.language.info') }}</p>

            <!-- Language List -->
            <div class="mb-6">
                <button
                    v-for="lang in languages"
                    :key="lang.code"
                    :id="`button-language-${lang.code}`"
                    :class="[
                        'w-full text-left px-4 py-3 rounded-lg transition duration-200 flex items-center justify-between',
                        selectedLanguage === lang.code ? 'bg-alternate text-alternate' : 'text-primary hover:bg-hover',
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
            <button
                id="button-next-language"
                :disabled="!selectedLanguage"
                :class="[
                    'w-full font-semibold rounded-full py-2 transition mb-3',
                    selectedLanguage
                        ? 'bg-alternate hover:bg-hover-alternate text-alternate  cursor-pointer'
                        : 'bg-alternate text-alternate cursor-not-allowed',
                ]"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </button>

            <!-- Skip Button -->
            <button
                id="button-skip-language"
                class="w-full text-primary hover:text-blue transition duration-200"
                @click="onSkip"
            >
                {{ $t('auth.common.skip') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import closeButton from '../closeButton.vue'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'

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

const onNext = () => {
    if (selectedLanguage.value) {
        emit('next', selectedLanguage.value)
    }
}

const onSkip = () => {
    emit('skip')
}
</script>

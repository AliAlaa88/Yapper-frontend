<template>
    <DetailedPanel :title="$t('settings.accountInfo.languages')">
        <div class="w-full text-primary">
            <div class="relative w-full pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{ $t('settings.languages.manage_desc') }}
                </p>
            </div>
        </div>
        <button
            id="language-button"
            class="w-full block relative px-5 py-3 rounded hover:bg-hover
            transition-colors text-primary"
            @click="isOpen = true">
            <div class="flex justify-between items-center">
                <div class="flex flex-col items-start">
                    <span class="block text-[15px] text-primary">
                        {{ $t('settings.languages.appsAndLanguage') }}
                    </span>
                    <p class="text-muted text-[13px]">
                        English and Arabic
                    </p>
                </div>
                <component
                    :is="locale === 'ar' ? ChevronLeft : ChevronRight"
                    class="opacity-40 group-hover:text-white absolute transition-colors"
                    :class="locale === 'ar' ? 'left-3' : 'right-3'" />
            </div>
        </button>
    </DetailedPanel>
    <LanguageSelector :is-open="isOpen" :handle-close="handleClose" />
</template>

<script setup lang="ts">
import DetailedPanel from '../DetailedPanel.vue'
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { ref } from 'vue'
import LanguageSelector from './SubComponents/LanguageSelector.vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const isOpen = ref(false)
const handleClose = () => {
    isOpen.value = false
}
</script>

<template>
    <Popup :is-open="isOpen" @close="handleClose">
        <h2 class="text-4xl font-bold px-12 mb-2 mt-7">
            {{ t('settings.languages.selectAppLanguage') }}
        </h2>
        <p class="text-muted text-sm px-12">
            {{ t('settings.languages.selectAppLanguage_desc') }}
        </p>

        <div class="mt-8 px-12 space-y-4">
            <button
                id="english-button"
                class="w-full flex justify-between items-center px-1 py-2 text-primary rounded"
                @click="selected = 'en'"
            >
                <div class="font-semibold">English – English</div>
                <CheckCircle2 v-if="selected === 'en'" class="text-accent" :size="20" />
                <Circle v-else class="opacity-40" :size="20" />
            </button>

            <button
                id="arabic-button"
                class="w-full flex justify-between items-center px-1 py-2 text-primary rounded"
                @click="selected = 'ar'"
            >
                <div class="font-semibold">Arabic – العربية</div>
                <CheckCircle2 v-if="selected === 'ar'" class="text-accent" :size="20" />
                <Circle v-else class="opacity-40" :size="20" />
            </button>
            <Button
                id="next-button"
                button-class="w-full cursor-pointer bg-alternate text-alternate
                font-semibold mt-60 mb-4 py-3 rounded-full"
                :is-loading="useChangeLanguage.isPending.value"
                @click="handleConfirm"
            >
                {{ $t('settings.languages.next') }}
            </Button>
        </div>
    </Popup>
</template>

<script setup lang="ts">
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import { Circle, CheckCircle2 } from 'lucide-vue-next'
import Button from '~/modules/Common/components/ui/Button.vue'
import { userSettingsQueries } from '../queries/userSettingsQueries'
import { useI18n } from 'vue-i18n'
import { LOCALE_COOKIE_KEY } from '~/modules/Common/constants/localStorageConstants'
const { t, locale } = useI18n()


const { useChangeLanguage } = userSettingsQueries()
const selected = ref<'en' | 'ar'>((locale.value as 'en' | 'ar') || 'en')

const props = defineProps<{
    isOpen: boolean
    handleClose: () => void
}>()

function setCookie(name: string, value: string, days = 365) {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const handleConfirm = () => {
    props.handleClose()
    useChangeLanguage.mutate({ language: selected.value })

    setCookie(LOCALE_COOKIE_KEY, selected.value)
    window.location.reload()
}
</script>

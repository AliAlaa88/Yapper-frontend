<template>
    <button
        class="bg-alternate text-alternate px-4 py-2 rounded-md absolute top-2 left-2 flex items-center gap-2 z-100"
        @click="handleOnClick"
    >
        {{ locale === 'ar' ? 'English' : 'العربية' }}
    </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const LOCALE_COOKIE_KEY = 'i18n_redirected'
const { locale } = useI18n()

function setCookie(name: string, value: string, days = 365) {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

function handleOnClick() {
    const newLocale = locale.value === 'en' ? 'ar' : 'en'
    setCookie(LOCALE_COOKIE_KEY, newLocale)
    window.location.reload()
}
</script>

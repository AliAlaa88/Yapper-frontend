<template>
    <div :dir="currentDirection" :lang="currentLocale" class="bg-x-bg-dark">
        <LanguageButton />
        <NuxtLayout class="w-full">
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import LanguageButton from './modules/Common/components/LanguageButton/LanguageButton.vue'
const { locale, locales } = useI18n()

const currentLocale = computed(() => locale.value)
const currentDirection = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir || 'ltr'
})
</script>

<template>
    <div :dir="currentDirection" :lang="currentLocale" class="bg-primary">
        <!-- Hany comment those because the reponsive app bar in the mobile view un comment them if you as a test -->
        <!-- <LanguageButton /> -->
        <!-- <StyleButton /> -->
        <NuxtLayout class="w-full">
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import LanguageButton from './modules/Common/components/LanguageButton/LanguageButton.vue'
import StyleButton from '~/modules/Common/components/StyleButton/StyleButton.vue'

const { locale, locales } = useI18n()

const currentLocale = computed(() => locale.value)
const currentDirection = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir || 'ltr'
})
</script>

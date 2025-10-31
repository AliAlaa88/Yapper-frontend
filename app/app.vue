<template>
    <div :dir="currentDirection" :lang="currentLocale" class="bg-x-bg-dark">
        <NuxtLayout class="w-full">
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
// import 'vue-gif-emoji-picker/dist/style.css'
const { locale, locales } = useI18n()

const currentLocale = computed(() => locale.value)
const currentDirection = computed(() => {
    const currentLocaleObj = locales.value.find((l: any) => l.code === locale.value)
    return currentLocaleObj?.dir || 'ltr'
})
</script>

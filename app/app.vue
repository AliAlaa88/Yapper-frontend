<template>
    <div :dir="currentDirection" :lang="currentLocale" class="bg-x-bg-dark">
        <NuxtLayout class="w-full">
            <NuxtPage />
        </NuxtLayout>
    </div>   
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()

const currentLocale = computed(() => locale.value)
const currentDirection = computed(() => {
    const currentLocaleObj = locales.value.find((l: any) => l.code === locale.value)
    return currentLocaleObj?.dir || 'ltr'
})
</script>

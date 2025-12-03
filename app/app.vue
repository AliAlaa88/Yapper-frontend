<template>
    <div :dir="currentDirection" :lang="currentLocale" class="bg-primary min-h-screen">
        <!-- Hany comment those because the reponsive app bar in the mobile view un comment them if you as a test -->
        <!-- <LanguageButton /> -->
        <!-- <StyleButton /> -->
        <NuxtLayout class="w-full">
            <NuxtPage />
        </NuxtLayout>
    </div>
    <VueQueryDevtools />
</template>

<script setup lang="ts">
// import LanguageButton from './modules/Common/components/LanguageButton/LanguageButton.vue'
// import StyleButton from '~/modules/Common/components/StyleButton/StyleButton.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'

const userStore = useUserStore()
const { $socketService, $chatSocketService } = useNuxtApp()

onMounted(() => {
    if (userStore.isLoggedIn) {
        $socketService.connect()
        $chatSocketService.initializeListeners()
        console.log('socket connected on app mount')
    }
})

watch(
    () => userStore.isLoggedIn,
    (newVal) => {
        if (newVal) {
            $socketService.connect()
            $chatSocketService.initializeListeners()
            console.log('socket connected on watch')
        } else {
            $chatSocketService.removeListeners()
            $chatSocketService.reset()
            $socketService.disconnect()
            console.log('socket disconnected on watch')
        }
    },
)

const { locale, locales } = useI18n()

const currentLocale = computed(() => locale.value)
const currentDirection = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir || 'ltr'
})
</script>

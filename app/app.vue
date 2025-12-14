<template>
    <div :dir="currentDirection" :lang="currentLocale" class="bg-primary min-h-screen">
        <!-- Hany comment those because the reponsive app bar in the mobile view un comment them if you as a test -->
        <!-- <LanguageButton /> -->
        <!-- <StyleButton /> -->
        <NuxtLayout class="w-full">
            <NuxtPage />
        </NuxtLayout>
    </div>
    <VueQueryDevtools v-if="config.public.env === 'development'" />
</template>

<script setup lang="ts">
// import LanguageButton from './modules/Common/components/LanguageButton/LanguageButton.vue'
// import StyleButton from '~/modules/Common/components/StyleButton/StyleButton.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useRuntimeConfig } from '#app'
const userStore = useUserStore()
const { $socketService, $chatSocketService, $notificationsSocketService } = useNuxtApp()
const socketsInitialized = ref(false)
const isInitializing = ref(false)
const config = useRuntimeConfig()

onMounted(async () => {
    if (userStore.isLoggedIn && !socketsInitialized.value && !isInitializing.value) {
        await initializeSockets()
    }
})

watch(
    () => userStore.getAccessToken(),
    async (newVal) => {
        console.log('access token changed in app', newVal)

        if (newVal && !socketsInitialized.value && !isInitializing.value) {
            await initializeSockets()
        } else if (!newVal && socketsInitialized.value) {
            cleanupSockets()
        }
    },
)

const initializeSockets = async () => {
    if (isInitializing.value) {
        if (config.public.env === 'development') {
            console.log('[App.vue] Socket initialization already in progress, skipping')
        }
        return
    }

    if (socketsInitialized.value) {
        if (config.public.env === 'development') {
            console.log('[App.vue] Sockets already initialized, skipping')
        }
        return
    }

    const token = userStore.getAccessToken()
    if (!token) {
        if (config.public.env === 'development') {
            console.log('[App.vue] No access token available, skipping socket initialization')
        }
        return
    }

    isInitializing.value = true

    try {
        console.log('[App.vue] Initializing sockets')
        console.log('[App.vue] Access token:', token ? 'present' : 'missing')

        $socketService.connect()

        $chatSocketService.initializeListeners()
        $notificationsSocketService.initializeListeners()

        socketsInitialized.value = true

        if (config.public.env === 'development') {
            console.log('[App.vue] Socket initialization started successfully')
        }
    } catch (error) {
        console.error('[App.vue] Error during socket initialization:', error)
        socketsInitialized.value = false // reset to allow retry
    } finally {
        isInitializing.value = false
    }
}

const cleanupSockets = () => {
    try {
        $chatSocketService.removeListeners()
        $notificationsSocketService.removeListeners()
        $chatSocketService.reset()
        $socketService.disconnect()
        socketsInitialized.value = false
        isInitializing.value = false
        if (config.public.env === 'development') {
            console.log('[App.vue] Sockets cleaned up')
        }
    } catch (error) {
        console.error('[App.vue] Error during socket cleanup:', error)
    }
}

if (import.meta.client) {
    const handleVisibilityChange = async () => {
        if (document.visibilityState === 'visible' && userStore.isLoggedIn) {
            const isConnected = $socketService.isConnected()
            if (!isConnected && !isInitializing.value) {
                if (config.public.env === 'development') {
                    console.log(
                        '[App.vue] Page visible but socket not connected, reinitializing...',
                    )
                }
                socketsInitialized.value = false // reset to allow reinitialization
                await initializeSockets()
            }
        }
    }

    onMounted(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        cleanupSockets()
    })
}

const { t, locale, locales } = useI18n()

const currentLocale = computed(() => locale.value)
const currentDirection = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir || 'ltr'
})

useHead({
    htmlAttrs: {
        lang: currentLocale.value,
        dir: currentDirection.value,
    },
    titleTemplate: (titleChunk) => {
        return titleChunk ? titleChunk : t('seo.default.title')
    },
})
</script>

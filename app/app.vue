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
const { $socketService, $chatSocketService, $notificationsSocketService } = useNuxtApp()
const socketsInitialized = ref(false)

onMounted(async () => {
    if (userStore.isLoggedIn && !socketsInitialized.value) {
        await initializeSockets()
    }
})

watch(
    () => userStore.isLoggedIn,
    async (newVal) => {
        if (newVal && !socketsInitialized.value) {
            await initializeSockets()
        } else if (!newVal && socketsInitialized.value) {
            cleanupSockets()
        }
    },
)

const initializeSockets = async () => {
    if (socketsInitialized.value) {
        console.log('Sockets already initialized, skipping')
        return
    }

    // try {
    $chatSocketService.initializeListeners()
    $notificationsSocketService.initializeListeners()
    $socketService.connect()
    socketsInitialized.value = true
    //     const connected = $socketService.isConnected()

    //     if (!connected) {
    //         console.error('Socket connection timeout')
    //         return
    //     }
    //     console.log('Socket connected successfully')
    // } catch {
    //     console.log('Error during socket initialization')
    // }

}

// const waitForSocketConnection = (timeout: number = 1000): Promise<boolean> => {
//     return new Promise((resolve) => {
//         const startTime = Date.now()

//         const checkConnection = () => {
//             const isConnected = $socketService.isConnected()
//             const elapsed = Date.now() - startTime

//             console.log(`[App.vue] Connection check: ${isConnected}`)

//             if (isConnected) {
//                 resolve(true)
//             } else if (elapsed >= timeout) {
//                 console.error(`[App.vue] Connection timeout after ${timeout}ms`)
//                 resolve(false)
//             } else {
//                 // Check again in 100ms
//                 setTimeout(checkConnection, 100)
//             }
//         }

//         checkConnection()
//     })
// }

const cleanupSockets = () => {
    try {
        $chatSocketService.removeListeners()
        $notificationsSocketService.removeListeners()
        $chatSocketService.reset()
        $socketService.disconnect()
        socketsInitialized.value = false
    } catch (error) {
        console.error('Error during socket cleanup:', error)
    }

}

if (import.meta.client) {
    const handleVisibilityChange = async () => {
        if (document.visibilityState === 'visible' && userStore.isLoggedIn) {
            const isConnected = $socketService.isConnected()
            if (!isConnected && !socketsInitialized.value) {
                await initializeSockets()  // reconnect
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

// Set default SEO for pages that don't have specific SEO
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

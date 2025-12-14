<template>
    <main class="flex flex-row justify-center container mx-auto relative">
        <!-- Sidebar -->
        <aside
            class="hidden sticky top-0 h-screen sm:flex shrink-0 transition-all duration-300 ease-in-out order-1"
            :style="{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }"
        >
            <Sidebar />
        </aside>

        <!-- Main Content -->
        <div
            class="border-l border-r border-primary w-full md:w-[600px] md:min-w-[600px] md:max-w-[600px] transition-all duration-300 ease-in-out order-2"
        >
            <div v-if="isSidebarVisible && !isSearch" class="sm:hidden block">
                <MobileSidebar />
            </div>
            <slot />
        </div>

        <!-- Banner -->
        <aside class="hidden sticky top-0 h-full xl:flex min-w-0 shrink-0 order-3">
            <Banner />
        </aside>

        <SnackBar />
        <ConfirmationModal />
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Sidebar from '~/modules/TimeLine/components/sidebar/Sidebar.vue'
import MobileSidebar from '~/modules/TimeLine/components/sidebar/MobileSidebar.vue'
import Banner from '~/modules/TimeLine/components/banner/Banner.vue'
import SnackBar from '~/modules/profile/components/ProfileContent/SubComponents/SnackBar.vue'
import ConfirmationModal from '~/modules/profile/components/ProfileHeader/SubComponents/ConfirmtionModal.vue'
import { useProfileProviders } from '~/modules/profile/composables/useProfileProviders'
import { useSidebarState } from '~/modules/TimeLine/composables/useSidebarState'
import { useRoute } from 'vue-router'

useProfileProviders()
const route = useRoute()
const config = useRuntimeConfig()
if (config.public.env === 'development') console.log(route)
const isSidebarVisible = computed(
    () => route.path === '/' || route.path === '/notifications' || route.path === '/explore',
)
const { width } = useWindowSize()
const { locale, locales } = useI18n()
const { sidebarWidth } = useSidebarState()
const isSearch = computed(
    () => route.path.startsWith('/explore') || route.path.startsWith('/search') || route.path.startsWith('/notifications'),
)

const isRTL = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir === 'rtl'
})
</script>

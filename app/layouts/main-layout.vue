<template>
    <main class="flex flex-row container mx-auto max-w-[1280px] relative">
        <!-- Left Sidebar (LTR) / Right Sidebar (RTL) -->
        <aside
            v-if="!isRTL"
            class="hidden sm:block shrink-0 fixed top-0 h-screen z-5 transition-all duration-300 ease-in-out"
            :style="{ ...leftStyle, width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }"
        >
            <Sidebar />
        </aside>

        <!-- Right Banner (LTR) / Left Banner (RTL) -->
        <aside
            v-if="isRTL"
            class="hidden md:block min-w-0 w-[250px] xl:w-[300px] shrink-0 fixed top-0 h-screen z-5"
            :style="bannerLeftStyle"
        >
            <Banner />
        </aside>

        <!-- Main Content -->
        <div
            :class="[
                'border-l border-r border-primary w-full md:max-w-[600px] transition-all duration-300 ease-in-out',
                isRTL ? 'lg:ml-[250px] xl:ml-[300px]' : 'lg:mr-[250px] xl:mr-[300px]',
            ]"
            :style="contentStyle"
        >
            <div v-if="isHome" class="sm:hidden block">
                <MobileSidebar />
            </div>
            <slot />
        </div>

        <!-- Right Sidebar (RTL) -->
        <aside
            v-if="isRTL"
            class="hidden sm:block shrink-0 fixed top-0 h-screen z-5 transition-all duration-300 ease-in-out"
            :style="{ ...rightStyle, width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }"
        >
            <Sidebar />
        </aside>

        <!-- Right Banner (LTR) -->
        <aside
            v-if="!isRTL"
            class="hidden md:block min-w-0 w-[250px] xl:w-[300px] shrink-0 fixed top-0 h-screen z-5"
            :style="rightStyle"
        >
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
console.log(route)
const isHome = computed(() => route.path === '/')
const { width } = useWindowSize()
const { locale, locales } = useI18n()
const { sidebarWidth } = useSidebarState()

const isRTL = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir === 'rtl'
})

const leftStyle = computed(() => {
    const viewportWidth = width.value
    const containerWidth = Math.min(viewportWidth, 1280)
    const containerLeft = (viewportWidth - containerWidth) / 2

    return {
        left: `${containerLeft}px`,
    }
})

const rightStyle = computed(() => {
    const viewportWidth = width.value
    const containerWidth = Math.min(viewportWidth, 1280)
    const containerLeft = (viewportWidth - containerWidth) / 2

    if (isRTL.value) {
        return {
            right: `${containerLeft}px`,
        }
    } else {
        const rightSidebarLeft = containerLeft + sidebarWidth.value + 600
        return {
            left: `${rightSidebarLeft}px`,
        }
    }
})

const contentStyle = computed(() => {
    if (width.value < 800) {
        return {}
    }

    if (isRTL.value) {
        return {
            marginRight: `${sidebarWidth.value}px`,
        }
    } else {
        return {
            marginLeft: `${sidebarWidth.value}px`,
        }
    }
})

const bannerLeftStyle = computed(() => {
    const viewportWidth = width.value
    const containerWidth = Math.min(viewportWidth, 1280)
    const containerLeft = (viewportWidth - containerWidth) / 2

    return {
        left: `${containerLeft}px`,
    }
})
</script>

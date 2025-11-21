<template>
    <main class="flex flex-row container mx-auto max-w-[1280px] relative">
        <!-- Left Sidebar (LTR) / Right Sidebar (RTL) -->
        <aside
            v-if="!isRTL"
            class="hidden md:block w-[275px] min-w-[275px] shrink-0 fixed top-0 h-screen z-5"
            :style="leftStyle"
        >
            <Sidebar />
        </aside>

        <!-- Right Banner (LTR) / Left Banner (RTL) -->
        <aside
            v-if="isRTL"
            class="hidden lg:block min-w-0 w-[250px] xl:w-[300px] shrink-0 fixed top-0 h-screen z-5"
            :style="bannerLeftStyle"
        >
            <Banner />
        </aside>

        <!-- Main Content -->
        <div
            :class="[
                'border-l border-r border-primary w-full md:max-w-[600px]',
                isRTL
                    ? 'md:mr-[275px] lg:ml-[250px] xl:ml-[300px]'
                    : 'md:ml-[275px] lg:mr-[250px] xl:mr-[300px]',
            ]"
        >
            <div class="md:hidden block">
                <MobileSidebar />
            </div>
            <slot />
        </div>

        <!-- Right Sidebar (RTL) -->
        <aside
            v-if="isRTL"
            class="hidden md:block w-[275px] min-w-[275px] shrink-0 fixed top-0 h-screen z-5"
            :style="rightStyle"
        >
            <Sidebar />
        </aside>

        <!-- Right Banner (LTR) -->
        <aside
            v-if="!isRTL"
            class="hidden lg:block min-w-0 w-[250px] xl:w-[300px] shrink-0 fixed top-0 h-screen z-5"
            :style="rightStyle"
        >
            <Banner />
        </aside>

        <!-- Global Modals -->
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

// Provide snackbar and confirmation globally
useProfileProviders()

const { width } = useWindowSize()
const { locale, locales } = useI18n()

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
        // In RTL, sidebar (275px wide) is on the right edge
        // Position it from the right side - it's wider than banner (250px/300px)
        // The sidebar aligns with the right edge of the container
        return {
            right: `${containerLeft}px`,
        }
    } else {
        // In LTR, right sidebar (banner) starts after: containerLeft + leftSidebar (275px) + content (600px)
        const rightSidebarLeft = containerLeft + 275 + 600
        return {
            left: `${rightSidebarLeft}px`,
        }
    }
})

// Style for RTL banner - positioned to be beside the content
const bannerLeftStyle = computed(() => {
    const viewportWidth = width.value
    const containerWidth = Math.min(viewportWidth, 1280)
    const containerLeft = (viewportWidth - containerWidth) / 2

    // Banner is positioned at containerLeft in RTL
    return {
        left: `${containerLeft}px`,
    }
})
</script>

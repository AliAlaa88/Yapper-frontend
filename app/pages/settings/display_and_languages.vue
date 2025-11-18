<template>
    <CategoryPanel :item="panelItems" />
</template>

<script setup lang="ts">
import CategoryPanel from '~/modules/settings/components/CategoryPanel.vue'
import { Brush, Earth } from 'lucide-vue-next'
definePageMeta({ layout: 'settings' })

const panelItems = {
    title: 'Display and Languages', description: 'Manage how Yapper content is displayed to you.', categories: [
        { label: 'Display', description: 'Manage your font color and background. These settings affect all the Yapper accounts on this browser.', icon: Brush, href: '/settings/display' },
        { label: 'Languages', description: 'Manage which languages are used to personalize your Yapper experience.', icon: Earth, href: '/settings/languages' },
    ],
}
</script>

<template>
    <CategoryPanel :item="panelItems" />
</template>

<script setup lang="ts">
import CategoryPanel from '~/modules/settings/components/CategoryPanel.vue'
import { Brush, Earth } from 'lucide-vue-next'
definePageMeta({ layout: 'settings' })

const panelItems = {
    title: $t('settings.displayAndLanguages'),
    description: $t('settings.displayAndLanguages_desc'),
    categories: [
        {
            label: $t('settings.display'),
            description: $t('settings.display_desc'),
            icon: Brush,
            href: '/settings/display',
        },
        {
            label: $t('settings.languages.title'),
            description: $t('settings.languages.manage_desc'),
            icon: Earth,
            href: '/settings/languages',
        },
    ],
}
</script>

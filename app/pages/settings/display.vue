<template>
    <DisplaySettings />
</template>

<script setup lang="ts">
import DisplaySettings from '~/modules/settings/components/Display/DisplaySettings.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.settingsDisplay.title'),
    description: t('seo.settingsDisplay.description'),
    keywords: t('seo.settingsDisplay.keywords'),
})

definePageMeta({ layout: 'settings' })
</script>

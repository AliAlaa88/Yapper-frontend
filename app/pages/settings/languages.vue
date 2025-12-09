<template>
    <ChangeLanguage />
</template>

<script setup lang="ts">
import ChangeLanguage from '~/modules/settings/components/AccountInformations/ChangeLanguage.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.settingsLanguages.title'),
    description: t('seo.settingsLanguages.description'),
    keywords: t('seo.settingsLanguages.keywords'),
})

definePageMeta({ layout: 'settings' })
</script>

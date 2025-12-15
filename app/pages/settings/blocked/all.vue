<template>
    <BlockedAccounts />
</template>

<script setup lang="ts">
import { useSeo } from '~/modules/Common/composables/useSeo'
import BlockedAccounts from '~/modules/settings/components/MuteAndBlock/SubComponents/BlockedAccounts.vue'

const { t } = useI18n()

useSeo({
    title: t('seo.settingsBlocked.title'),
    description: t('seo.settingsBlocked.description'),
    keywords: t('seo.settingsBlocked.keywords'),
})

definePageMeta({ layout: 'settings' })
</script>

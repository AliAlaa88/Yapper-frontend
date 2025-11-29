<template>
    <BlockedAccounts />
</template>

<script setup lang="ts">
import BlockedAccounts from '~/modules/settings/components/MuteAndBlock/BlockedAccounts.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.settingsBlocked.title'),
    description: t('seo.settingsBlocked.description'),
    keywords: t('seo.settingsBlocked.keywords'),
})

definePageMeta({ layout: 'settings' })

</script>

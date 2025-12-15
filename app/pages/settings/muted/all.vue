<template>
    <MutedAccounts />
</template>

<script setup lang="ts">
import MutedAccounts from '~/modules/settings/components/MuteAndBlock/SubComponents/MutedAccounts.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.settingsMuted.title'),
    description: t('seo.settingsMuted.description'),
    keywords: t('seo.settingsMuted.keywords'),
})

definePageMeta({ layout: 'settings' })

</script>

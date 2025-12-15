<template>
    <ChangePassword />
</template>

<script setup lang="ts">
import ChangePassword from '~/modules/settings/components/YourAccount/ChangePassword.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.settingsPassword.title'),
    description: t('seo.settingsPassword.description'),
    keywords: t('seo.settingsPassword.keywords'),
})

definePageMeta({ layout: 'settings' })
</script>

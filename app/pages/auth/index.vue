<template>
    <homeLogin />
</template>

<script setup lang="ts">
import homeLogin from '../../modules/auth/views/index.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.default.title'),
    description: t('seo.default.description'),
    keywords: t('seo.default.keywords'),
})

definePageMeta({
    middleware: ['auth'],
    requiresAuth: false,
})
</script>

<template>
    <TimelineView />
</template>

<script setup lang="ts">
import TimelineView from '~/modules/TimeLine/views/TimeineView'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.home.title'),
    description: t('seo.home.description'),
    keywords: t('seo.home.keywords'),
})

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>

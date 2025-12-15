<template>
    <SearchResults />
</template>

<script setup lang="ts">
import SearchResults from '~/modules/search/components/SearchResults.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.search.title'),
    description: t('seo.search.description'),
    keywords: t('seo.search.keywords'),
})

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>

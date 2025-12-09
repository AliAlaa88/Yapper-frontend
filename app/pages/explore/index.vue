<template>
    <div class="overflow-x-hidden">
        <ExploreTabs />
        <!-- Default content for explore index -->
        <ForYou />
    </div>
</template>

<script lang="ts" setup>
import ExploreTabs from '~/modules/explore/components/exploreTabs.vue'
import ForYou from '~/modules/explore/components/forYou/index.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'
import { definePageMeta } from '#imports'

const { t } = useI18n()

useSeo({
    title: t('seo.explore.title'),
    description: t('seo.explore.description'),
    keywords: t('seo.explore.keywords'),
})

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})

</script>

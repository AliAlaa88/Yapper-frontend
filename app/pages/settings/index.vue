<template>
    <div class="md:hidden">
        <SidebarCategories />
    </div>
</template>

<script setup lang="ts">
import SidebarCategories from '~/modules/settings/components/SidebarCategories.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.settings.title'),
    description: t('seo.settings.description'),
    keywords: t('seo.settings.keywords'),
})

definePageMeta({ layout: 'settings' })
</script>

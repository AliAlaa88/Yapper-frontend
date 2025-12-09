<template>
    <CategoryPanel :item="panelItems" />
</template>

<script setup lang="ts">
import CategoryPanel from '~/modules/settings/components/CategoryPanel.vue'
import { MegaphoneOff } from 'lucide-vue-next'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.settingsPrivacy.title'),
    description: t('seo.settingsPrivacy.description'),
    keywords: t('seo.settingsPrivacy.keywords'),
})

definePageMeta({ layout: 'settings' })

const panelItems = {
    title: $t('settings.privacyAndSafety'), description: $t('settings.privacyAndSafety_desc'), categories: [
        { label: $t('settings.muteAndBlock'), description: $t('settings.muteAndBlock'), icon: MegaphoneOff , href: '/settings/mute_and_block' },
    ],
}
</script>

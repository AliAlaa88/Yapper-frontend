<template>
    <CategoryPanel :item="panelItems" />
</template>

<script setup lang="ts">
import CategoryPanel from '~/modules/settings/components/CategoryPanel.vue'
import { MegaphoneOff } from 'lucide-vue-next'
definePageMeta({ layout: 'settings' })

const panelItems = {
    title: 'Privacy and Safety', description: 'Manage your privacy and safety settings on Yapper.', categories: [
        { label: 'Mute and block', description: 'Manage the accounts and notifications that you have muted or blocked.', icon: MegaphoneOff , href: '/settings/mute_and_block' },
    ],
}
</script>

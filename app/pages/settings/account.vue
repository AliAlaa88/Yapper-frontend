<template>
    <CategoryPanel :item="panelItems" />
</template>

<script setup lang="ts">
import CategoryPanel from '~/modules/settings/components/CategoryPanel.vue'
import { UserRound, KeyRound, ShieldMinus } from 'lucide-vue-next'
definePageMeta({ layout: 'settings' })

const panelItems = {
    title: 'Your Account', description: 'See information about your account. download an archive of your data, or learn about your account deletion', categories: [
        { label: 'Account information', description: 'See your account information like your username and email address.', icon: UserRound, href: '/settings/your_yapper_data/account' },
        { label: 'Change your password', description: 'Change your password at any time', icon: KeyRound, href: '/settings/password' },
        { label: 'Delete your account', description: 'Find out how you can delete your account', icon: ShieldMinus, href: '/settings/delete' },
    ],
}
</script>

<template>
    <CategoryPanel :item="panelItems" />
</template>

<script setup lang="ts">
import CategoryPanel from '~/modules/settings/components/CategoryPanel.vue'
import { UserRound, KeyRound, ShieldMinus } from 'lucide-vue-next'
definePageMeta({ layout: 'settings' })

const panelItems = {
    title: $t('settings.yourAccount'), description: $t('settings.yourAccount_desc'), categories: [
        { label: $t('settings.accountInformation'), description: $t('settings.accountInformation_desc'), icon: UserRound, href: '/settings/your_yapper_data/account' },
        { label: $t('settings.changePassword'), description: $t('settings.changePassword_desc'), icon: KeyRound, href: '/settings/password' },
        { label: $t('settings.deleteYourAccount'), description: $t('settings.deleteYourAccount_desc'), icon: ShieldMinus, href: '/settings/delete' },
    ],
}
</script>

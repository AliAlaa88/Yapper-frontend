<template>
    <PasswordProtectedContent title="Account Information">
        <AccountInformations />
    </PasswordProtectedContent>
</template>

<script setup lang="ts">
import AccountInformations from '~/modules/settings/components/AccountInformations.vue'
import PasswordProtectedContent from '~/modules/settings/components/PasswordProtectedContent.vue'
definePageMeta({ layout: 'settings' })

</script>

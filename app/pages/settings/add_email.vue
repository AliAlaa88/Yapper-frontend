<template>
    <ChangeEmailForm/>
</template>

<script setup lang="ts">
import ChangeEmailForm from '~/modules/settings/components/AccountInformations/SubComponents/ChangeEmailForm.vue'

definePageMeta({
    requiresAuth: false,
})
</script>

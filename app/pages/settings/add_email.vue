<template>
    <ChangeEmailForm />
</template>

<script setup lang="ts">
import ChangeEmailForm from '~/modules/settings/components/ChangeEmailForm.vue'

definePageMeta({
    requiresAuth: false,
})
</script>

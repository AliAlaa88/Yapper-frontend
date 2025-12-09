<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <ProfileContent />
</template>

<script setup lang="ts">
import ProfileContent from '../../modules/profile/components/ProfileContent/ProfileContent.vue'
import { useProfilePageSeo } from '~/modules/profile/composables/useProfilePageSeo'
useProfilePageSeo('profile')

definePageMeta({
    layout: 'profile',
    middleware: ['auth'],
})
</script>

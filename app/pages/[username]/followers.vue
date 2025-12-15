<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <FollowLists />
</template>

<script setup lang="ts">
import FollowLists from '../../modules/profile/components/FollowLists/FollowLists.vue'
import { useProfilePageSeo } from '~/modules/profile/composables/useProfilePageSeo'
useProfilePageSeo('followers')

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>

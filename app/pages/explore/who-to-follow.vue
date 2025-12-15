<template>
    <whoToFollow />
</template>

<script setup lang="ts">
import whoToFollow from '~/modules/explore/components/whoToFollow/index.vue'

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>

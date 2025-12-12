<template>
    <NotificationsView />
</template>

<script setup lang="ts">
import NotificationsView from '~/modules/notifications/views/NotificationsView.vue'
definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>

<template>
    <TimelineView />
</template>

<script setup lang="ts">
import TimelineView from '~/modules/TimeLine/views/TimeineView'
definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>

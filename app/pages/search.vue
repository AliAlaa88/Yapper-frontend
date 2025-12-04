<template>
        <SearchResults />
</template>

<script setup lang="ts">
import SearchResults from '~/modules/search/components/SearchResults.vue'

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>

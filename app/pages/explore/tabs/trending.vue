<template>
    <div class="overflow-x-hidden h-screen">
        <ExploreTabs />
        <!-- Trending content -->
        <Trending />
    </div>
</template>

<script lang="ts" setup>
import ExploreTabs from '~/modules/explore/components/exploreTabs.vue'
import Trending from '~/modules/explore/components/trending/index.vue'

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>

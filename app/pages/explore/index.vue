<template>
    <div class="overflow-x-hidden">
        <ExploreTabs />
        <!-- Default content for explore index -->
        <ForYou />
    </div>
</template>

<script lang="ts" setup>
import ExploreTabs from '~/modules/explore/components/exploreTabs.vue'
import ForYou from '~/modules/explore/components/forYou/index.vue'
import { definePageMeta } from '#imports'
definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})

</script>
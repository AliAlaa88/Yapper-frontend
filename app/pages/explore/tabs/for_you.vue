<template>
    <div>
        <ExploreTabs />
        <!-- For You content -->
        <ForYou />
    </div>
</template>

<script lang="ts" setup>
import ExploreTabs from '~/modules/explore/components/exploreTabs.vue'
import ForYou from '~/modules/explore/components/forYou/index.vue'

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script> 
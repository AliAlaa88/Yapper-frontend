<template>
    <div>
        <ExploreTabs />
        <!-- Sports content -->
        <Categories category="sports" />
    </div>
</template>

<script lang="ts" setup>
import ExploreTabs from '~/modules/explore/components/exploreTabs.vue'
import Categories from '~/modules/explore/components/categories/index.vue'
import { definePageMeta } from '#imports'
definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script> 
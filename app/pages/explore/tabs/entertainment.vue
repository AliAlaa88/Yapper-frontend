<template>
    <div>
        <ExploreTabs />
        <!-- Entertainment content -->
        <div class="p-4 text-primary">
            <!-- Content will go here -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import ExploreTabs from '~/modules/explore/components/exploreTabs.vue'

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script> 
<template>
    <div>
        <ExploreTabs />
        <!-- Default content for explore index -->
    </div>
</template>

<script lang="ts" setup>
import ExploreTabs from '~/modules/explore/components/exploreTabs.vue'

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})

</script>
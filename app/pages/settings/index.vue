<template>
    <div class="md:hidden">
        <SidebarCategories />
    </div>
</template>

<script setup lang="ts">
import SidebarCategories from '~/modules/settings/components/SidebarCategories.vue'

definePageMeta({ layout: 'settings' })
</script>

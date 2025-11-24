<template>
    <div class="w-full space-y-6 md:space-y-10">
        <DetailedHeader :title="title" />
        <div>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import DetailedHeader from './DetailedHeader.vue'

defineProps<{ title: string }>()
</script>

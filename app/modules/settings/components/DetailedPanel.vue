<template>
    <div>
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

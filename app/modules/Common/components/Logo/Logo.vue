<template>
    <div :class="divClass">
        <img v-if="themecomputed" src="~/assets/images/logo-white.png" alt="X Logo" :class="imgClass" />
        <img v-else src="~/assets/images/logo.png" alt="X Logo" :class="imgClass" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
    imgClass?: string
    divClass?: string
}>()

const themecomputed = computed(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
})
</script>

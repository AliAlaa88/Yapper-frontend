<template>
    <div :class="divClass">
        <component :is="isDark ? LogoWhite : LogoBlack" :img-class="imgClass" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import LogoBlack from './LogoBlack.vue'
import LogoWhite from './LogoWhite.vue'

const isDark = ref(false)
let observer: MutationObserver | null = null

defineProps<{
    imgClass?: string
    divClass?: string
}>()

const updateTheme = () => {
    if (typeof document === 'undefined') return
    isDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
    updateTheme()

    observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    })
})

onUnmounted(() => {
    observer?.disconnect()
})
</script>

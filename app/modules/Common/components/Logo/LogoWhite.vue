<template>
    <img :src="logoWhite" alt="Yapper logo white" :class="imgClass" />
</template>

<script setup lang="ts">
import logoWhite from '~/assets/images/logo-white.png'
defineProps<{
    imgClass: string | undefined
}>()
</script>

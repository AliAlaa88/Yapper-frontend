<template>
    <img :src="logoBlack" alt="Yapper logo black" :class="imgClass" >
</template>

<script setup lang="ts">
import logoBlack from '~/assets/images/logo.png'
defineProps<{
    imgClass: string | undefined
}>()
</script>

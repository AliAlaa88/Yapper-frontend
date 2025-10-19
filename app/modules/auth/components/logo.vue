<template>
  <div :class="divClass">
    <img
      src="../assets/logo-white.png"
      alt="X Logo"
      :class="imgClass"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imgClass?: string
  divClass?: string
}>()
</script>

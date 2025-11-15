<template>
    <homeLogin />
</template>

<script setup lang="ts">
import homeLogin from '../../modules/auth/views/index.vue'
definePageMeta({
    middleware: ['auth'],
    requiresAuth: false,
})
</script>

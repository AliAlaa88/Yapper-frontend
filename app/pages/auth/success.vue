<template>
    <AuthLayout>
        <Success />
    </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '../../modules/auth/views/index.vue'
import Success from '../../modules/auth/components/success.vue'

definePageMeta({
    middleware: ['auth'],
    requiresAuth: false,
})
</script>

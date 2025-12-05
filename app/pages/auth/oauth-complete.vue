<template>
    <AuthLayout>
        <OAuthComplete :exchange_token="exchange_token" />
    </AuthLayout>
</template>

<script setup lang="ts">
import OAuthComplete from '~/modules/auth/components/OAuthComplete.vue'
import AuthLayout from '../../modules/auth/views/index.vue'
import { ref } from 'vue'

const urlParams = new URLSearchParams(window.location.search)
const exchange_token = ref(urlParams.get('exchange_token') || '')

definePageMeta({
    middleware: ['auth'],
    requiresAuth: false,
})
</script>

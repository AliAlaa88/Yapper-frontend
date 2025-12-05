<template>
    <AuthLayout>
        <CreateAccount />
    </AuthLayout>
</template>

<script lang="ts" setup>
import CreateAccount from '../../modules/auth/components/createAccount.vue'
import AuthLayout from '../../modules/auth/views/index.vue'

definePageMeta({
    middleware: ['auth'],
    requiresAuth: false,
})
</script>

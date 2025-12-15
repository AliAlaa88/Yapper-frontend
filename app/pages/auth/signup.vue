<template>
    <AuthLayout>
        <CreateAccount />
    </AuthLayout>
</template>

<script lang="ts" setup>
import CreateAccount from '../../modules/auth/components/createAccount.vue'
import AuthLayout from '../../modules/auth/views/index.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.signup.title'),
    description: t('seo.signup.description'),
    keywords: t('seo.signup.keywords'),
})

definePageMeta({
    middleware: ['auth'],
    requiresAuth: false,
})
</script>

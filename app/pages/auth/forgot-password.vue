<template>
    <forgetPassword @finish="onFinish" />
</template>

<script setup lang="ts">
import forgetPassword from '../../modules/auth/components/forgetPassword.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()

useSeo({
    title: t('seo.forgotPassword.title'),
    description: t('seo.forgotPassword.description'),
    keywords: t('seo.forgotPassword.keywords'),
})

const onFinish = () => {
    navigateTo('/auth/login')
}

definePageMeta({
    requiresAuth: false,
})
</script>

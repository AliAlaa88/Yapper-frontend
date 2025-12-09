<template>
    <AuthLayout>
        <SignInModal @close="goBack" @switch="goToSignup" @finish="goBack" />
    </AuthLayout>
</template>

<script lang="ts" setup>
import SignInModal from '../../modules/auth/components/login.vue'
import AuthLayout from '../../modules/auth/views/index.vue'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()
const router = useRouter()

useSeo({
    title: t('seo.login.title'),
    description: t('seo.login.description'),
    keywords: t('seo.login.keywords'),
})

const goBack = () => {
    router.push('/auth')
}

const goToSignup = () => {
    router.push('/auth/signup')
}

definePageMeta({
    middleware: ['auth'],
    requiresAuth: false,
})
</script>

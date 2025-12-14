<template>
    <AuthLoadingPage v-if="isLoading" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { useGetUserQuery } from '~/modules/auth/queries/useGetuserQuery'
import { useRouter } from 'vue-router'
import { useExchangeTokenQuery } from '~/modules/auth/queries/useOAuthQuery'
import AuthLoadingPage from './AuthLoadingPage.vue'
const router = useRouter()
const userStore = useUserStore()
const urlParams = new URLSearchParams(window.location.search)
const exchange_token = ref(urlParams.get('exchange_token') || '')
const isLoading = ref(true)
const enableUserQuery = ref(false)

const exchangeTokenMutation = useExchangeTokenQuery(
    (data: any) => {
        // Store token temporarily in store (will sync to cookie via watch)
        // Don't call setAuth until we have both token and user
        userStore.setAccessToken(data.access_token)
        enableUserQuery.value = true
    },
    (error: any) => {
        console.error('Exchange Token Error:', error)
        isLoading.value = false
        router.push('/auth')
        userStore.logout()
    },
)

useGetUserQuery(
    enableUserQuery,
    (data) => {
        // Now we have both token (already in store) and user - call setAuth once
        const token = userStore.getAccessToken()
        if (!token) {
            console.error('Token missing when setting auth')
            userStore.logout()
            router.push('/auth')
            return
        }
        userStore.setAuth({
            access_token: token,
            user: data.data,
        })
        isLoading.value = false
        router.push('/')
    },
    (error) => {
        console.error('Failed to fetch user data:', error)
        isLoading.value = false
        userStore.logout()
        router.push('/auth')
    },
)

onMounted(() => {
    if (exchange_token.value) {
        exchangeTokenMutation.mutate({ exchange_token: exchange_token.value })
    } else {
        console.error('No exchange token found')
        isLoading.value = false
        router.push('/auth')
        userStore.logout()
    }
})
</script>

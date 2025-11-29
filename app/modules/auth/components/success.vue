<template>
    <AuthLoadingPage v-if="isLoading" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserStore } from '~/modules/auth/stores/userStore';
import { useGetUserQuery } from '~/modules/auth/queries/useGetuserQuery';
import { useRouter } from 'vue-router';
import { useExchangeTokenQuery } from '~/modules/auth/queries/useOAuthQuery';
import AuthLoadingPage from './AuthLoadingPage.vue';
const router = useRouter();
const userStore = useUserStore();
const urlParams = new URLSearchParams(window.location.search);
const exchange_token = ref(urlParams.get('exchange_token') || '');
const isLoading = ref(true);
const enableUserQuery = ref(false);

const exchangeTokenMutation = useExchangeTokenQuery(
    (data: any) => {
        const token = useCookie('access_token');
        token.value = data.access_token;
        userStore.accessToken = data.access_token;
        enableUserQuery.value = true;
    },
    (error: any) => {
        console.error("Exchange Token Error:", error);
        isLoading.value = false;
        router.push('/auth');
        userStore.logout();
    }
);

useGetUserQuery(
    enableUserQuery,
    (data) => {
        userStore.setAuth({
            access_token: useCookie('access_token').value || '',
            user: data.data
        });
        isLoading.value = false;
        router.push('/');
    },
    (error) => {
        console.error("Failed to fetch user data:", error);
        isLoading.value = false;
        userStore.logout();
        router.push('/auth');
    }
);

onMounted(() => {
    if (exchange_token.value) {
        exchangeTokenMutation.mutate({ exchange_token: exchange_token.value });
    } else {
        console.error("No exchange token found");
        isLoading.value = false;
        router.push('/auth');
        userStore.logout();
    }
});
</script>
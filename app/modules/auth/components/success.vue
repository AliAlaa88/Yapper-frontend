<template>
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-black">
        <div class="text-white text-xl">Loading...</div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '~/modules/auth/stores/userStore';
import { useGetUserQuery } from '~/modules/auth/queries/useGetuserQuery';
import { useRouter } from 'vue-router';
import { useExchangeTokenQuery } from '~/modules/auth/queries/useOAuthQuery';
import Cookies from 'js-cookie';
const router = useRouter();
const userStore = useUserStore();
const urlParams = new URLSearchParams(window.location.search);
const exchange_token = ref(urlParams.get('exchange_token') || '');
const isLoading = ref(true);
const userToken = ref<string>('');
const exchangeTokenMutation = useExchangeTokenQuery(
    (data: any) => {
        console.log("Exchange Token Success:", data);
        userToken.value = data.access_token;
    },
    (error: any) => {
        console.error("Exchange Token Error:", error);
        router.push('/auth');
        userStore.logout();
    },
);
if(exchange_token.value){
    try {
    exchangeTokenMutation.mutate({ exchange_token: exchange_token.value });
        userStore.accessToken = userToken.value;
    if (process.client) {
        console.log("Storing access token in cookies");
        const token = useCookie('access_token')
        token.value=userToken.value;
        await nextTick();
    }
    console.log("Fetching user data with access token", useCookie('access_token').value);
    useGetUserQuery(
        true,
        (data) => {
            console.log("User data fetched successfully:", data);
            userStore.setAuth({
                access_token: userToken.value,
                user: data.data
            });
            isLoading.value = false;
            router.push('/');
        },
        (error) => {
            console.error("Failed to fetch user data:", error);
            isLoading.value = false;
            router.push('/auth');
            userStore.logout();
        }
    );
    } catch (error) {
        console.error("Error decoding exchange token:", error);
    }
}
 else {
    router.push('/auth');
    userStore.logout();
}

</script>
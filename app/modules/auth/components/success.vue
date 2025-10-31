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
const router = useRouter();
const userStore = useUserStore();
const urlParams = new URLSearchParams(window.location.search);
const userToken = ref(urlParams.get('token') || '');
const isLoading = ref(true);
if (userToken.value) {
    userStore.accessToken = userToken.value;
    if (process.client) {
        console.log("Storing access token in localStorage");
        localStorage.setItem('access_token', userToken.value);
    }

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
} else {
    router.push('/auth');
    userStore.logout();
}
</script>
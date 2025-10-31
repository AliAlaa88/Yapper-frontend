<template>
    <div class="min-h-screen flex items-center justify-center bg-black text-white">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">Welcome to Yapper</h1>
            <p class="text-gray-400 mb-6">Redirecting to authentication...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/modules/auth/stores/userStore";
const router = useRouter();
onMounted(() => {
    const userStore = useUserStore();
    const home = "home";
    if (!userStore.isLoggedIn) {
        router.push(`/${home}`);
    } else {
        router.push("/auth");
    }
});
</script>

<template>
    <button
        class="cursor-pointer font-bold text-[15px] leading-[20px] flex items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 bg-transparent border-[0.1px] border-white/40 text-white px-[53px] py-[10px] w-[88px] h-[36px] hover:bg-white/10"
        @click="handleEditProfile"
    >
        Edit profile
    </button>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()

const handleEditProfile = () => {
    router.push(`/profile/${route.params.username}/settings/profile`)
}
</script>

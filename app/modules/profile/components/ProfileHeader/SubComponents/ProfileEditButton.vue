<template>
    <button
        class="cursor-pointer font-bold text-[15px] leading-[20px] flex items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 bg-transparent border-[0.1px] border-primary text-primary px-[12px] py-[6px] h-[40px] hover:bg-hover"
        @click="handleEditProfile"
    >
        {{ $t('profile.editProfile') }}
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

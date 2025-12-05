<template>
    <button
        class="cursor-pointer font-bold text-[15px] leading-5 flex items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 bg-transparent border border-[#536471] text-primary px-4 py-1.5 h-9 hover:bg-[#181818] mb-3"
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
    router.push(`/${route.params.username}/settings/profile`)
}
</script>

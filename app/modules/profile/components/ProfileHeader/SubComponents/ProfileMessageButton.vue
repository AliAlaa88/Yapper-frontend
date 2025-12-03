<template>
    <button
        class="flex h-9 w-9 items-center cursor-pointer justify-center rounded-full border border-[#536471] transition hover:bg-[#181818]"
        @click="goToMessages"
    >
        <Mail :size="18" class="text-primary" />
    </button>
</template>

<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { useProfileStore } from '~/modules/profile/stores/profileStore'

const router = useRouter()
const profileStore = useProfileStore()

function goToMessages() {
    const userId = profileStore.getProfileId()
    if (userId) {
        router.push(`/messages/${userId}`)
    } else {
        router.push('/messages')
    }
}
</script>

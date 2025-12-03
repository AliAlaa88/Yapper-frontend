<template>
    <button
        class="flex h-9 w-9 items-center cursor-pointer justify-center rounded-full border border-[#536471] transition hover:bg-[#181818]"
        :disabled="isLoading"
        @click="goToMessages"
    >
        <Loader2 v-if="isLoading" :size="18" class="text-primary animate-spin" />
        <Mail v-else :size="18" class="text-primary" />
    </button>
</template>

<script setup lang="ts">
import { Mail, Loader2 } from 'lucide-vue-next'
import { useProfileStore } from '~/modules/profile/stores/profileStore'

const router = useRouter()
const profileStore = useProfileStore()
const { $chatService } = useNuxtApp()

const isLoading = ref(false)

async function goToMessages() {
    const userId = profileStore.getProfileId()
    
    if (!userId) {
        router.push('/messages')
        return
    }

    try {
        isLoading.value = true
        const conversation = await $chatService.createConversation(userId)
        router.push(`/messages/${conversation.id}`)
    } catch (error) {
        console.error('Failed to start conversation:', error)
        router.push('/messages')
    } finally {
        isLoading.value = false
    }
}
</script>

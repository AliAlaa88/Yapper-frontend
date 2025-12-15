<template>
    <div
        v-if="isTyping && userName !== currentUserName"
        class="flex items-center gap-2 px-4 py-2 text-secondary"
    >
        <div class="flex items-center gap-1">
            <span
                v-for="i in 3"
                :key="i"
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                :style="{ animationDelay: `${(i - 1) * 150}ms` }"
            />
        </div>
        <span class="text-sm">{{ typingText }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '~/modules/auth/stores/userStore'

const props = defineProps<{
    chatId: string
    userName?: string
}>()

const userStore = useUserStore()
const { $chatSocketService } = useNuxtApp()

const currentUserName = computed(() => userStore.getUser()?.username)
const isTyping = computed(() => $chatSocketService.isUserTypingInChat(props.chatId))

const typingUsers = computed(() => $chatSocketService.getTypingUsersInChat(props.chatId))

const typingText = computed(() => {
    if (props.userName) {
        return `${props.userName} is typing...`
    }
    const count = typingUsers.value.length
    if (count === 1) return 'is typing...'
    if (count > 1) return 'are typing...'
    return 'is typing...'
})
</script>

<style scoped>
@keyframes bounce {
    0%,
    60%,
    100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-4px);
    }
}

.animate-bounce {
    animation: bounce 1s infinite;
}
</style>

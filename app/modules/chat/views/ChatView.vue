<template>
    <div class="flex w-full h-screen border-x border-primary">
        <div
            :class="[
                'shrink-0 h-screen chat-list-width',
                props.chatId ? 'hidden md:block w-full' : 'w-full',
            ]"
        >
            <ChatList
                :selected-chat-id="selectedConversation?.id"
                @select-conversation="handleSelectConversation"
            />
        </div>

        <div class="hidden md:flex flex-1 border-r border-primary w-full h-screen">
            <ChatMessages
                v-if="props.chatId"
                class="w-full h-full"
                :conversation-id="props.chatId"
                :participant="selectedConversation?.participant"
            />
            <div v-else class="flex-1 flex items-center justify-center">
                <div class="text-center p-8 max-w-md">
                    <h2 class="text-3xl font-bold text-primary mb-2">
                        {{ $t('chat.selectMessage') }}
                    </h2>
                    <p class="text-secondary mb-6">
                        {{ $t('chat.selectMessageDescription') }}
                    </p>
                    <button
                        id="btn-new-message-empty-state"
                        class="bg-accent text-primary font-bold rounded-full py-3 px-8 transition-colors cursor-pointer hover:bg-accent/90"
                        @click="openCreateConversation"
                    >
                        {{ $t('chat.newMessage') }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="props.chatId" class="md:hidden flex-1 w-full h-screen">
            <ChatMessages
                class="w-full h-full"
                :conversation-id="props.chatId"
                :participant="selectedConversation?.participant"
            />
        </div>

        <CreateConversation :isOpen="isCreateConversationOpen" @close="closeCreateConversation" />
    </div>

    <SnackBar />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, provide } from 'vue'
import { ChatList } from '../components/ChatList'
import ChatMessages from '../components/ChatMessages/ChatMessages.vue'
import CreateConversation from '../components/CreateConversation/CreateConversation.vue'
import { useGetConversationById } from '../queries/useGetConversation'
import type { Conversation } from '../types'

import SnackBar from '~/modules/profile/components/ProfileContent/SubComponents/SnackBar.vue'
import { useSnackbar } from '~/modules/profile/composables/useSnackbar'

const snackbar = useSnackbar()
provide('snackbar', snackbar)

const router = useRouter()

const props = defineProps<{
    chatId?: string
}>()

const { $chatSocketService, $socketService } = useNuxtApp()

const selectedConversation = ref<Conversation | null>(null)
const isCreateConversationOpen = ref(false)
const isChatSocketConnected = $socketService.connected

const openCreateConversation = () => {
    isCreateConversationOpen.value = true
}

const closeCreateConversation = () => {
    isCreateConversationOpen.value = false
}

const conversationIdForQuery = ref(props.chatId || '')

const { data: conversationByIdData, isLoading: isConversationByIdLoading } =
    useGetConversationById(conversationIdForQuery)

watch(
    () => props.chatId,
    (newChatId) => {
        conversationIdForQuery.value = newChatId || ''
    },
    { immediate: true },
)

watch(
    [conversationByIdData, isChatSocketConnected],
    async ([conversation, isConnected]) => {
        console.log('conversation', conversation)
        console.log('isConnected', isConnected)
        if (props.chatId && conversation && isConnected) {
            selectedConversation.value = conversation
            try {
                await $chatSocketService.enterChat(conversation.id)
            } catch (error) {
                console.error('[ChatView] Failed to join chat from route:', error)
            }
        } else if (!props.chatId) {
            selectedConversation.value = null
        }
    },
    { immediate: true },
)

const handleSelectConversation = async (conversation: Conversation) => {
    selectedConversation.value = conversation

    try {
        await $chatSocketService.enterChat(conversation.id)
    } catch (error) {
        console.error('[ChatView] Failed to join chat:', error)
    }
}

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && selectedConversation.value) {
        selectedConversation.value = null
        $chatSocketService.leaveChat()
        router.push('/messages')
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(async () => {
    window.removeEventListener('keydown', handleEscapeKey)

    try {
        await $chatSocketService.leaveChat()
    } catch (error) {
        console.error('[ChatView] Failed to leave chat:', error)
    }
})
</script>

<style scoped>
.chat-list-width {
    width: 100%;
}

@media (min-width: 768px) {
    .chat-list-width {
        width: 320px;
    }
}

@media (min-width: 1100px) {
    .chat-list-width {
        width: 350px;
    }
}

@media (min-width: 1280px) {
    .chat-list-width {
        width: 380px;
    }
}

@media (min-width: 1536px) {
    .chat-list-width {
        width: 400px;
    }
}
</style>

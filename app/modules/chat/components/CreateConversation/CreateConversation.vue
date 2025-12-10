<template>
    <Popup
        :isOpen="props.isOpen"
        title="Create Conversation"
        content-class="!md:w-[600px] md:max-w-[600px] w-full border-1 border-primary rounded-2xl"
        slot-class="h-[600px]"
        :bgColor="'bg-transparent'"
        @close="emit('close')"
    >
        <div class="flex flex-col h-full w-full">
            <div class="flex flex-col gap-3 px-4 pt-2 pb-3 shrink-0">
                <h1 class="text-lg font-bold text-primary">New Message</h1>
                <input
                    v-model="searchUsernameRef"
                    type="text"
                    placeholder="Search username"
                    class="w-full px-4 py-2.5 rounded-full bg-primary border-2 border-primary focus:border-accent outline-none text-primary text-sm"
                />
            </div>

            <div class="flex-1 min-h-0 overflow-hidden px-4 pb-4">
                <CreateConversationUserList
                    v-if="searchUsername.trim().length > 0"
                    :search-query="searchUsername"
                    @user-selected="handleUserSelected"
                    @close="emit('close')"
                />

                <div v-else class="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquarePlus :size="64" class="mb-3 text-secondary opacity-50" />
                    <h3 class="m-0 mb-2 text-xl font-extrabold text-primary">
                        Start a new conversation
                    </h3>
                    <p class="m-0 max-w-[350px] text-sm leading-5 text-muted">
                        Search for a username to start messaging
                    </p>
                </div>
            </div>
        </div>
    </Popup>
</template>

<script setup lang="ts">
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import { useDebounce } from '~/modules/Common/composables'
import CreateConversationUserList from './SubComponents/CreateConversationUserList.vue'
import { MessageSquarePlus } from 'lucide-vue-next'
import { useAddConversation } from '~/modules/chat/queries/useAddConversation'

const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'conversationCreated'): void
}>()

const searchUsernameRef = ref('')
const searchUsername = useDebounce(searchUsernameRef, 500)
const { mutateAsync: createConversation, isPending: isLoading } = useAddConversation()

const handleUserSelected = async () => {
    emit('close')
}
</script>

<template>
    <Popup
        :is-open="props.isOpen"
        :title="$t('chat.createConversation.title')"
        content-class="!md:w-[600px] md:max-w-[600px] w-full border-1 border-primary rounded-2xl"
        slot-class="h-[600px]"
        :bg-color="'bg-transparent'"
        @close="emit('close')"
    >
        <div class="flex flex-col h-full w-full">
            <div class="flex flex-col gap-3 px-4 pt-2 pb-3 shrink-0">
                <h1 class="text-lg font-bold text-primary">
                    {{ $t('chat.createConversation.newMessage') }}
                </h1>
                <input
                    id="input-search-create-conversation"
                    v-model="searchUsernameRef"
                    type="text"
                    :placeholder="$t('chat.createConversation.searchUsername')"
                    class="w-full px-4 py-2.5 rounded-full bg-primary border-2 border-primary focus:border-accent outline-none text-primary text-sm"
                >
            </div>

            <div class="flex-1 min-h-0 overflow-hidden px-4 pb-4">
                <CreateConversationUserList
                    v-if="searchUsername.trim().length > 0"
                    :search-query="searchUsername"
                    :loading-text="$t('chat.createConversation.loading')"
                    :error-text="$t('chat.createConversation.failedToLoad')"
                    :retry-text="$t('chat.createConversation.tryAgain')"
                    :empty-title="$t('chat.createConversation.noUsersFound')"
                    :empty-description="$t('chat.createConversation.tryDifferentUsername')"
                    @user-selected="handleUserSelected"
                    @close="emit('close')"
                />

                <div v-else class="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquarePlus :size="64" class="mb-3 text-secondary opacity-50" />
                    <h3 class="m-0 mb-2 text-xl font-extrabold text-primary">
                        {{ $t('chat.createConversation.startNewConversation') }}
                    </h3>
                    <p class="m-0 max-w-[350px] text-sm leading-5 text-muted">
                        {{ $t('chat.createConversation.startNewConversationDescription') }}
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

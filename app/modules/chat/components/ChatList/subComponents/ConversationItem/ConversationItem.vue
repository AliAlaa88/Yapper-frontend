<template>
    <div
        class="flex items-center gap-3 p-3 hover:bg-hover cursor-pointer transition-colors duration-200"
        :class="{ 'bg-hover border-r-3 border-accent': isSelected }"
    >
        <div class="shrink-0">
            <img
                v-if="conversation.participant.avatar_url"
                :src="conversation.participant.avatar_url"
                :alt="conversation.participant.username"
                class="w-12 h-12 rounded-full object-cover"
                :onerror="`this.src = 'https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.participant.name)}'`"
            />
            <img
                v-else
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.participant.name)}`"
                :alt="conversation.participant.username"
                class="w-12 h-12 rounded-full object-cover"
                :onerror="`this.src = 'https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.participant.name)}'`"
            />
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
                <div class="flex items-center gap-1 truncate">
                    <span class="font-bold text-primary truncate">{{
                        shorterName(conversation.participant.name)
                    }}</span>
                    <span class="text-secondary text-sm truncate"
                        >@{{ conversation.participant.username }}</span
                    >
                    <span class="text-secondary text-sm">·</span>
                    <span class="text-secondary text-sm">{{
                        formatConversationDate(conversation.last_message?.created_at || '')
                    }}</span>
                </div>
            </div>
            <p
                class="truncate text-sm"
                :class="conversation.unread_count > 0 ? 'font-bold text-primary' : 'text-secondary'"
            >
                {{ lastMessagePreview }}
            </p>
        </div>
        <div
            v-if="conversation.unread_count > 0"
            class="bg-accent text-primary text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center"
        >
            {{ conversation.unread_count }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Conversation, Message } from '~/modules/chat/types'
import { shorterName, formatConversationDate } from '~/utils/helpers'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
    conversation: Conversation
    isSelected?: boolean
}>()

const userStore = useUserStore()
const { t } = useI18n()

const lastMessagePreview = computed(() => {
    const lastMessage = props.conversation?.last_message

    if (!lastMessage) {
        return t('chat.noMessagesYet')
    }

    const hasContent = lastMessage.content && lastMessage.content.trim().length > 0
    const hasImage = lastMessage.image_url && lastMessage.image_url.trim().length > 0
    const hasVoice =
        (lastMessage as any).voice_note_url && (lastMessage as any).voice_note_url.trim().length > 0

    if (hasContent) {
        return lastMessage.content
    }

    if (hasImage) {
        try {
            const currentUser = userStore.getUser()?.user_id
            const senderId = lastMessage.sender_id

            if (!currentUser || !senderId) {
                return t('chat.noMessagesYet')
            }

            const isOwnMessage = currentUser.toString() === senderId.toString()

            if (isOwnMessage) {
                return t('chat.youSentImage')
            } else {
                return t('chat.imageSentToYou')
            }
        } catch (error) {
            console.log('error', error)
            return t('chat.noMessagesYet')
        }
    }

    if (hasVoice) {
        try {
            const currentUser = userStore.getUser()?.user_id
            const senderId = lastMessage.sender_id

            if (!currentUser || !senderId) {
                return t('chat.noMessagesYet')
            }

            const isOwnMessage = currentUser.toString() === senderId.toString()

            if (isOwnMessage) {
                return t('chat.youSentVoice')
            } else {
                return t('chat.voiceSentToYou')
            }
        } catch (error) {
            console.log('error', error)
            return t('chat.noMessagesYet')
        }
    }

    return t('chat.noMessagesYet')
})
</script>

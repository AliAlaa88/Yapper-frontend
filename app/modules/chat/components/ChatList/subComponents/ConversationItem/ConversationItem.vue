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
            />
            <img
                v-else
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.participant.name)}`"
                :alt="conversation.participant.username"
                class="w-12 h-12 rounded-full object-cover"
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
                        formatDate(conversation.updated_at)
                    }}</span>
                </div>
            </div>
            <p
                class="truncate text-sm"
                :class="conversation.unread_count > 0 ? 'font-bold text-primary' : 'text-secondary'"
            >
                {{ conversation.last_message?.content || 'No messages yet' }}
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
import type { Conversation } from '~/modules/chat/types'
import { shorterName, formatDate } from '~/utils/helpers'

defineProps<{
    conversation: Conversation
    isSelected?: boolean
}>()
</script>

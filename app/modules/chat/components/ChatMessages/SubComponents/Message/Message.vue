<template>
    <div class="flex gap-2 px-4 py-1.5" :class="isOwnMessage ? 'justify-end' : 'justify-start'">
        <!-- Message Content -->
        <div class="flex flex-col gap-0.5 max-w-[70%]">
            <!-- Message Bubble -->
            <div
                class="rounded-3xl px-4 py-2"
                :class="isOwnMessage ? 'bg-accent text-primary' : 'bg-dark-gray text-primary'"
            >
                <p class="text-[15px] leading-5 whitespace-pre-wrap break-words">
                    {{ message.content }}
                </p>

                <!-- Media display -->
                <div v-if="message.media && message.media.length > 0" class="mt-2 space-y-2">
                    <div
                        v-for="(item, index) in message.media"
                        :key="index"
                        class="rounded-xl overflow-hidden"
                    >
                        <img
                            v-if="item.type === 'image'"
                            :src="item.url"
                            :alt="`Media ${index + 1}`"
                            class="max-w-full h-auto rounded-xl"
                        />
                        <video
                            v-else-if="item.type === 'video'"
                            :src="item.url"
                            class="max-w-full h-auto rounded-xl"
                            controls
                        >
                            <p>Your browser does not support the video tag.</p>
                        </video>
                    </div>
                </div>
            </div>

            <!-- Time under the message -->
            <span
                class="text-xs text-secondary px-4"
                :class="isOwnMessage ? 'text-right' : 'text-left'"
            >
                {{ formatDate(message.created_at) }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '~/modules/chat/types'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { formatDate } from '~/utils/helpers'

interface MessageWithSender extends Message {
    sender: {
        id: string
        name: string
        username: string
        avatar: string
    }
    media?: Array<{
        url: string
        type: 'image' | 'video'
    }>
}

const props = defineProps<{
    message: MessageWithSender
    currentUserId: string
}>()

const isOwnMessage = computed(() => props.message.sender_id === props.currentUserId)
</script>

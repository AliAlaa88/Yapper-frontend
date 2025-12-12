<template>
    <div class="flex gap-2 px-4 py-1.5" :class="isOwnMessage ? 'justify-end' : 'justify-start'">
        <!-- Message Content -->
        <div class="flex flex-col gap-0.5 max-w-[70%]">
            <!-- Message Bubble -->
            <div
                class="rounded-3xl px-4 py-2"
                :class="isOwnMessage ? 'bg-accent text-primary' : 'bg-dark-gray text-primary'"
            >
                <p v-if="message.content" class="text-[15px] leading-5 whitespace-pre-wrap break-words" style="unicode-bidi: plaintext;" v-html="parseLinks(message.content, isOwnMessage)"/>

                <!-- Image display -->
                <div v-if="message.image_url" class="mt-2">
                    <img
                        :src="message.image_url"
                        alt="Message image"
                        class="max-w-full h-auto rounded-xl"
                    />
                </div>
            </div>

            <!-- Time under the message -->
            <span
                class="text-xs text-secondary px-4"
                :class="isOwnMessage ? 'text-right' : 'text-left'"
            >
                {{ formatMessageDate(message.created_at) }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '~/modules/chat/types'
import { formatMessageDate } from '~/utils/helpers'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { parseLinks } from '~/lib/utils'

const userStore = useUserStore()

const props = defineProps<{
    message: Message
}>()

const currentUser = userStore.getUser().user_id
const isOwnMessage = computed(() => {
    return props.message.sender.id.toString() === currentUser?.toString()
})
</script>

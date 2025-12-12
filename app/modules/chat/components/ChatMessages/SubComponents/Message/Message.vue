<template>
    <div class="flex gap-2 px-4 py-1.5" :class="isOwnMessage ? 'justify-end' : 'justify-start'">
        <!-- Message Content -->
        <div
            class="flex flex-col gap-0.5"
            :class="isOwnMessage ? 'items-end' : 'items-start'"
            style="max-width: min(70%, 500px)"
        >
            <!-- Message Bubble -->
            <div
                class="rounded-3xl px-4 py-2 max-w-[300px]"
                :class="isOwnMessage ? 'bg-accent text-primary' : 'bg-dark-gray text-primary'"
            >
                <!-- Image display -->
                <div v-if="message.image_url" class="mb-2 first:mt-0">
                    <img
                        :src="message.image_url"
                        alt="Message image"
                        class="max-w-full max-h-[300px] object-contain h-auto rounded-xl"
                    />
                </div>
                <div v-if="message.content">
                    <p
                        class="text-[15px] leading-5 whitespace-pre-wrap wrap-break-word"
                        style="unicode-bidi: plaintext"
                        v-html="
                            parseLinks(
                                isExpanded ? message.content : truncatedContent,
                                isOwnMessage,
                            )
                        "
                    />
                    <button
                        v-if="shouldShowSeeMore"
                        @click="toggleExpand"
                        class="text-primary hover:underline text-sm mt-1 font-medium"
                    >
                        {{ isExpanded ? $t('chat.seeLess') : $t('chat.seeMore') }}
                    </button>
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
import { computed, ref } from 'vue'
import type { Message } from '~/modules/chat/types'
import { formatMessageDate } from '~/utils/helpers'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { parseLinks } from '~/lib/utils'

const userStore = useUserStore()

const props = defineProps<{
    message: Message
}>()

const MAX_CHAR_LENGTH = 150

const currentUser = userStore.getUser()?.user_id
const isOwnMessage = computed(() => {
    return props.message.sender.id.toString() === currentUser?.toString()
})

const isExpanded = ref(false)

const shouldShowSeeMore = computed(() => {
    return props.message.content && props.message.content.length > MAX_CHAR_LENGTH
})

const truncatedContent = computed(() => {
    if (!props.message.content) return ''
    if (props.message.content.length <= MAX_CHAR_LENGTH) return props.message.content
    return props.message.content.slice(0, MAX_CHAR_LENGTH) + '...'
})

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
}
</script>

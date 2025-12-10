<template>
    <div class="flex flex-col h-full bg-primary relative">
        <!-- Header -->
        <div
            class="p-4 flex items-center justify-between sticky top-0 bg-primary/80 backdrop-blur-md z-10 border-b border-primary"
        >
            <div class="flex items-center gap-3">
                <button
                    id="back-to-messages-button"
                    class="md:hidden p-2 hover:bg-hover rounded-full cursor-pointer transition-colors"
                    @click="router.push('/messages')"
                    aria-label="Back to messages"
                >
                    <ArrowLeft class="w-5 h-5 text-primary" />
                </button>
                <template
                    v-if="!isConversationLoading && !isLoading && participant && conversationId"
                    >
                    <NuxtLink :to="`/${participant.username}`">
                    <div class="flex items-center gap-2">


                            <img
                            v-if="participant.avatar_url"
                            :src="participant.avatar_url"
                        :alt="participant.username"
                        class="w-10 h-10 rounded-full object-cover"
                        :onerror="`this.src = 'https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}'`"
                    />
                    <img
                        v-else
                        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name || 'User')}`"
                        :alt="participant.username"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div>

                        <h2 class="font-bold text-primary">
                            {{ participant.name || 'Chat' }}
                        </h2>
                        <p class="text-sm text-secondary">@{{ participant.username || '' }}</p>
                    </div>
                    </div>
                    </NuxtLink>
                </template>
                <div v-else class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-secondary animate-pulse" />
                    <div>
                        <div class="h-4 w-24 bg-secondary rounded animate-pulse mb-2" />
                        <div class="h-3 w-16 bg-secondary rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Messages List -->
        <div ref="messagesContainerRef" class="relative flex-1 overflow-y-auto">
            <!-- Loading State -->
            <div
                v-if="isLoading || isConversationLoading"
                class="flex items-center justify-center h-full"
            >
                <LoadingSpinner size="lg" />
            </div>

            <!-- Error State -->
            <div v-else-if="isError" class="flex items-center justify-center h-full">
                <p class="text-red-500">{{ $t('chat.failedToLoad') }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="messages.length === 0" class="flex items-center justify-center h-full">
                <p class="text-secondary">{{ $t('chat.noMessagesInChat') }}</p>
            </div>

            <!-- Messages -->
            <template v-else>
                <div v-if="hasNextPage && !isFetchingNextPage" ref="sentinelRef" class="h-1" />

                <div v-if="isFetchingNextPage" class="flex justify-center py-4">
                    <LoadingSpinner />
                </div>

                <Message v-for="message in messages" :key="message.id" :message="message" />
            </template>

            <!-- Typing Indicator -->
            <TypingIndicator
                v-if="conversationId"
                :chat-id="conversationId"
                :user-name="participant?.name"
            />
            <!-- Scroll to Bottom Button -->
            <button
                v-if="showScrollButton"
                class="sticky bottom-4 right-4 cursor-pointer ml-auto mr-4 bg-alternate text-alternate p-2 rounded-full shadow-lg hover:bg-alternate/90 transition-colors z-20 flex items-center justify-center w-10 h-10"
                @click="scrollToBottom"
                aria-label="Scroll to bottom"
            >
                <ArrowDown class="w-5 h-5" />
            </button>
        </div>

        <!-- Input Bar -->
        <InputBar
            v-if="conversationId && participant && !isConversationLoading && !isLoading"
            :conversation-id="conversationId"
            :containerRef="messagesContainerRef"
            :messagesLength="messages.length"
            :participant="participant"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ArrowLeft, ArrowDown } from 'lucide-vue-next'
import Message from './SubComponents/Message/Message.vue'
import InputBar from './SubComponents/InputBar/InputBar.vue'
import TypingIndicator from '../TypingIndicator/TypingIndicator.vue'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { useMessagesQuery } from '../../queries/useMessagesQuery'
import { storeToRefs } from 'pinia'
import type { participant as participantType } from '~/modules/chat/types'
import { useIntersectionObserver } from '@vueuse/core'

const router = useRouter()

const props = defineProps<{
    conversationId?: string
    participant?: participantType
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const messagesContainerRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)
const hasScrolledInitially = ref(false)
const previousScrollHeight = ref(0)
const showScrollButton = ref(false)

const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMessagesQuery(computed(() => props.conversationId))

const isConversationLoading = computed(() => !!props.conversationId && !props.participant)

const messages = computed(() => {
    if (!data.value?.pages) return []

    return data.value.pages
        .slice()
        .reverse()
        .flatMap((page) => page.messages)
})

const scrollToBottom = () => {
    if (messagesContainerRef.value) {
        messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
    }
}

const checkScrollPosition = () => {
    if (messagesContainerRef.value) {
        const container = messagesContainerRef.value
        const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 100
        showScrollButton.value = !isNearBottom
    }
}

useIntersectionObserver(
    sentinelRef,
    ([entry]) => {
        if (entry?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
            if (messagesContainerRef.value) {
                previousScrollHeight.value = messagesContainerRef.value.scrollHeight
            }
            fetchNextPage()
        }
    },
    {
        root: messagesContainerRef,
        rootMargin: '100px',
    },
)

watch(isFetchingNextPage, (isFetching, wasFetching) => {
    if (
        wasFetching &&
        !isFetching &&
        messagesContainerRef.value &&
        previousScrollHeight.value > 0
    ) {
        nextTick(() => {
            if (messagesContainerRef.value) {
                const newScrollHeight = messagesContainerRef.value.scrollHeight
                const scrollDifference = newScrollHeight - previousScrollHeight.value

                messagesContainerRef.value.scrollTop += scrollDifference
                previousScrollHeight.value = 0
            }
        })
    }
})

watch(
    () => messages.value.length,
    (newLength, oldLength) => {
        if (newLength > oldLength && !isFetchingNextPage.value && messagesContainerRef.value) {
            if (!hasScrolledInitially.value) {
                nextTick(() => {
                    scrollToBottom()
                })
            } else {
                const container = messagesContainerRef.value
                const isNearBottom =
                    container.scrollHeight - container.scrollTop - container.clientHeight < 200

                if (isNearBottom) {
                    nextTick(() => {
                        scrollToBottom()
                    })
                }
            }
        }
    },
)

onMounted(() => {
    nextTick(() => {
        scrollToBottom()
        hasScrolledInitially.value = true
    })

    if (messagesContainerRef.value) {
        messagesContainerRef.value.addEventListener('scroll', checkScrollPosition)
    }
})

onUnmounted(() => {
    if (messagesContainerRef.value) {
        messagesContainerRef.value.removeEventListener('scroll', checkScrollPosition)
    }
})
</script>

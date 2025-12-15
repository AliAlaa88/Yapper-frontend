<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-4 sm:py-8"
            @click.self="closeModal"
        >
            <div
                class="quote-modal relative w-full max-w-[600px] bg-primary rounded-2xl mx-4"
                @click.stop
            >
                    <!-- Header -->
                    <div class="flex items-center p-4 border-b border-primary">
                        <button
                            id="btn-close-quote-modal"
                            class="p-2 rounded-full hover:bg-hover transition-colors cursor-pointer"
                            @click="closeModal"
                        >
                            <X :size="20" class="text-primary" />
                        </button>
                    </div>

                    <!-- Quote Tweet Form -->
                    <PostTweet
                        :border="false"
                        :quoted-tweet="quotedTweet"
                        :inlineborder="false"
                        :compact="true"
                        @success="handleSuccess"
                    />
                </div>
            </div>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { Tweet } from '../../types/tweet'
import PostTweet from '~/modules/TimeLine/components/postTweet'
import { cacheInvalidation } from '~/modules/Common/queries/cacheInvalidation'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'

const props = defineProps<{
    isOpen: boolean
    quotedTweet: Tweet
}>()

const emit = defineEmits<{
    (e: 'close' | 'success'): void
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { $queryClient } = useNuxtApp()

const closeModal = () => {
    emit('close')
}

const handleSuccess = () => {
    // Handle cache invalidation for quote tweets
    cacheInvalidation.onTweetRepostChange(
        $queryClient,
        props.quotedTweet.tweet_id,
        `/users/${user.value?.user_id}/posts`,
    )
    emit('success')
    emit('close')
}

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) closeModal()
}

// Watch for modal open/close to manage body scroll
watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    },
)

onMounted(() => {
    document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
})
</script>

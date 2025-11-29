<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div
                class="relative w-full h-full flex items-start justify-center overflow-y-auto py-4 sm:py-8"
            >
                <div
                    class="relative w-full max-w-[600px] bg-primary rounded-2xl mx-4"
                    @click.stop
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 border-b border-primary">
                        <button
                            class="p-2 rounded-full hover:bg-hover transition-colors"
                            @click="closeModal"
                        >
                            <X :size="20" class="text-primary" />
                        </button>
                        <Button
                            id="quote-post-btn"
                            :disabled="disablePostButton"
                            :button-class="buttonClass"
                            :button-text="$t('timeline.postTweet.post')"
                            :loading-text="$t('timeline.postTweet.posting')"
                            :is-loading="postTweet.isPending.value"
                            @click="handleSubmit"
                        />
                    </div>

                    <!-- Content -->
                    <div class="p-4">
                        <div class="flex gap-3">
                            <img
                                :src="userAvatar"
                                :alt="user?.name"
                                class="w-10 h-10 rounded-full"
                            >
                            <div class="flex-1">
                                <FormattedTextarea
                                    id="quote-tweet-textarea"
                                    v-model="content"
                                    :placeholder="$t('timeline.postTweet.quotePlaceholder')"
                                    :inlineborder="false"
                                />

                                <!-- Quoted Tweet Preview -->
                                <QuotedTweet :tweet="quotedTweet" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { Tweet } from '../../types/tweet'
import QuotedTweet from '../Tweet/subComponents/QuotedTweet/QuotedTweet.vue'
import { FormattedTextarea } from '~/modules/TimeLine/components/postTweet/subComponents/FormattedTextarea'
import Button from '~/modules/Common/components/Button/Button.vue'
import { usePostTweet } from '~/modules/TimeLine/queries/usePostTweet'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import type { TweetBody } from '~/modules/TimeLine/types/tweetBody'

const props = defineProps<{
    isOpen: boolean
    quotedTweet: Tweet
}>()

const emit = defineEmits<{
    (e: 'close' | 'success'): void
}>()

const buttonClass = 'px-4 py-2 bg-alternate text-alternate rounded-full font-bold ' +
    'hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const postTweet = usePostTweet()

const content = ref('')

const userAvatar = computed(() =>
    user.value?.avatar_url ?? `https://ui-avatars.com/api/?name=${user.value?.name}`,
)

const disablePostButton = computed(() => content.value.trim().length === 0)

const closeModal = () => {
    content.value = ''
    emit('close')
}

const handleSubmit = async () => {
    try {
        const tweetData: TweetBody = {
            content: content.value,
            videos: [],
            images: [],
            parent_tweet_id: props.quotedTweet.tweet_id,
            type: 'quote',
        }

        await postTweet.mutateAsync(tweetData)
        content.value = ''
        emit('success')
        emit('close')
    } catch (error) {
        console.error('Failed to post quote:', error)
    }
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

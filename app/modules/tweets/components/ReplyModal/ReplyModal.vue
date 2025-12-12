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
                            id="btn-close-reply-modal"
                            class="p-2 rounded-full hover:bg-hover transition-colors cursor-pointer"
                            @click="closeModal"
                        >
                            <X :size="20" class="text-primary" />
                        </button>
                    </div>

                    <!-- Parent Tweet Preview -->
                    <div class="px-4 pt-4">
                        <div class="flex gap-3">
                            <!-- Avatar with connecting line -->
                            <div class="flex flex-col items-center">
                                <UserImage
                                    :image-url="parentTweetAvatar"
                                    :name="parentTweet.user.name"
                                    :compact="true"
                                />
                                <div class="w-0.5 flex-1 bg-gray-600 mt-2" />
                            </div>
                            <!-- Parent tweet content -->
                            <div class="flex-1 min-w-0 pb-2">
                                <div class="flex items-center gap-1 text-sm">
                                    <span class="font-bold text-primary truncate">
                                        {{ parentTweet.user.name }}
                                    </span>
                                    <span class="text-secondary truncate">
                                        @{{ parentTweet.user.username }}
                                    </span>
                                </div>
                                <p class="text-primary mt-1 whitespace-pre-wrap wrap-break-word" style="unicode-bidi: plaintext;">
                                    {{ parentTweet.content }}
                                </p>
                                <!-- Media (Images and Videos) -->
                                <div
                                    v-if="hasMedia"
                                    class="mt-2"
                                >
                                    <TweetMedia
                                        :images="parentTweet.images || []"
                                        :videos="parentTweet.videos || []"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reply Form -->
                    <div class="p-4">
                        <PostTweet
                            :border="false"
                            :parent-tweet-id="parentTweet.tweet_id"
                            :replying-to-username="parentTweet.user.username"
                            :inlineborder="false"
                            :compact="true"
                            @success="handleSuccess"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { Tweet } from '../../types/tweet'
import PostTweet from '~/modules/TimeLine/components/postTweet'
import TweetMedia from '../Tweet/subComponents/TweetMedia/TweetMedia.vue'
import UserImage from '~/modules/Common/components/UserImage/UserImage.vue'

const props = defineProps<{
    isOpen: boolean
    parentTweet: Tweet
}>()

const emit = defineEmits<{
    (e: 'close' | 'success'): void
}>()

const parentTweetAvatar = computed(() =>
    props.parentTweet.user.avatar_url ??
    `https://ui-avatars.com/api/?name=${props.parentTweet.user.name}`,
)

const hasMedia = computed(() =>
    (props.parentTweet.images && props.parentTweet.images.length > 0) ||
    (props.parentTweet.videos && props.parentTweet.videos.length > 0),
)

const closeModal = () => {
    emit('close')
}

const handleSuccess = () => {
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

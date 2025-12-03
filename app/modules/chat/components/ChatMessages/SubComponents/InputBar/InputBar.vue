<template>
    <div class="flex flex-col gap-2 p-2 bg-primary border-t border-primary">
        <!-- Media Preview -->
        <div v-if="mediaUrls.length > 0" class="rounded-xl overflow-hidden border border-primary">
            <div
                class="grid gap-2 p-2"
                :class="
                    mediaUrls.length === 1
                        ? 'grid-cols-1'
                        : mediaUrls.length === 2
                          ? 'grid-cols-2'
                          : mediaUrls.length === 3
                            ? 'grid-cols-2'
                            : 'grid-cols-2'
                "
            >
                <div
                    v-for="(media, index) in mediaUrls"
                    :key="index"
                    class="relative group rounded-xl overflow-hidden"
                    :class="
                        mediaUrls.length === 1
                            ? 'aspect-video'
                            : mediaUrls.length === 3 && index === 0
                              ? 'col-span-2 aspect-video'
                              : 'aspect-square'
                    "
                >
                    <img
                        v-if="media.type === 'image'"
                        :src="media.url"
                        :alt="`Uploaded media ${index + 1}`"
                        class="w-full h-full object-cover"
                    />
                    <video
                        v-else-if="media.type === 'video'"
                        :src="media.url"
                        class="w-full h-full object-cover"
                        controls
                    >
                        <p>Your browser does not support the video tag.</p>
                    </video>
                    <button
                        type="button"
                        class="absolute top-2 right-2 w-8 h-8 bg-alternate hover:bg-hover-alternate rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        @click="removeMedia(index)"
                    >
                        <X class="w-5 h-5 text-alternate" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Input Bar -->
        <div class="flex items-center gap-2 bg-dark-gray rounded-full p-2 border border-primary">
            <div class="relative">
                <MediaUpload :disabled="mediaUrls.length >= 4" @select="handleSelectMedia" />
            </div>

            <div class="relative">
                <button
                    type="button"
                    :disabled="mediaUrls.length >= 4"
                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="toggleGifPicker"
                >
                    <ImagePlay class="w-5 h-5 text-accent" />
                </button>
                <GifPicker
                    :is-open="showGifPicker"
                    position="top"
                    @select="handleGifSelect"
                    @close="showGifPicker = false"
                />
            </div>

            <div class="relative">
                <button
                    type="button"
                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors"
                    @click="toggleEmojiPicker"
                >
                    <Smile class="w-5 h-5 text-accent" />
                </button>
                <EmojiPicker
                    :is-open="showEmojiPicker"
                    position="top"
                    @select="handleEmojiSelect"
                    @close="showEmojiPicker = false"
                />
            </div>

            <div class="flex-1 min-w-0">
                <textarea
                    ref="textareaRef"
                    v-model="content"
                    placeholder="Type a message..."
                    class="w-full bg-transparent border-none outline-none resize-none text-primary placeholder:text-muted px-2 py-1 max-h-32 overflow-y-auto"
                    rows="1"
                    @input="handleTextareaInput"
                />
            </div>

            <button
                type="button"
                :disabled="disableSendButton"
                class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleSubmit"
            >
                <Send class="w-5 h-5 text-accent" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Send, Smile, ImagePlay, X } from 'lucide-vue-next'
import GifPicker from '~/modules/TimeLine/components/postTweet/subComponents/GifPicker/GifPicker.vue'
import EmojiPicker from '~/modules/TimeLine/components/postTweet/subComponents/EmojiPicker/EmojiPicker.vue'
import MediaUpload from '~/modules/TimeLine/components/postTweet/subComponents/MediaUpload/MediaUpload.vue'
import { useUploadMedia } from '~/modules/TimeLine/queries/useUploadMedia'

interface MediaItem {
    url: string
    type: 'image' | 'video'
}

const props = defineProps<{
    conversationId: string
}>()

const { $chatSocketService } = useNuxtApp()

const content = ref('')
const showGifPicker = ref(false)
const showEmojiPicker = ref(false)
const mediaUrls = ref<MediaItem[]>([])
const uploadMedia = useUploadMedia()

const disableSendButton = computed(() => {
    const isEmpty = content.value.trim().length === 0 && mediaUrls.value.length === 0
    return isEmpty || $chatSocketService.isSendingMessage.value
})

const processUploadResponse = (response: any, type: 'image' | 'video') => {
    if (response?.data?.url) {
        const url = response.data.url
        const exists = mediaUrls.value.some((item) => item.url === url)
        if (!exists && mediaUrls.value.length < 4) {
            mediaUrls.value.push({ url: url, type: type })
        }
    }
}

const handleSelectMedia = async (files: File[]) => {
    for (const media of files) {
        if (mediaUrls.value.length >= 4) break
        const type = media.type.includes('image') ? 'image' : 'video'
        try {
            const response = await uploadMedia.mutateAsync({ media, type })
            processUploadResponse(response, type)
        } catch (error) {
            console.error('Failed to upload media:', error)
        }
    }
}

const removeMedia = (index: number) => {
    mediaUrls.value.splice(index, 1)
}

const toggleGifPicker = () => {
    showGifPicker.value = !showGifPicker.value
    showEmojiPicker.value = false
}

const handleGifSelect = (gifUrl: string) => {
    showGifPicker.value = false
    if (mediaUrls.value.length >= 4) return
    mediaUrls.value.push({ url: gifUrl, type: 'image' })
}

const toggleEmojiPicker = () => {
    showEmojiPicker.value = !showEmojiPicker.value
    showGifPicker.value = false
}

const handleEmojiSelect = (emoji: any) => {
    content.value += emoji.i
}

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const handleTextareaInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    // Auto-resize textarea
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 128)}px`

    // Trigger typing indicator
    $chatSocketService.handleTyping()
}

// Watch content changes to auto-resize (e.g., when emoji is added)
watch(
    () => content.value,
    () => {
        nextTick(() => {
            if (textareaRef.value) {
                textareaRef.value.style.height = 'auto'
                textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 128)}px`
            }
        })
    },
)

const handleSubmit = () => {
    if (disableSendButton.value) return

    // Determine message type based on media
    let messageType: 'text' | 'image' | 'video' = 'text'
    let mediaUrl: string | undefined

    if (mediaUrls.value.length > 0) {
        const firstMedia = mediaUrls.value[0]
        if (firstMedia) {
            messageType = firstMedia.type
            mediaUrl = firstMedia.url
        }
    }

    // Send message via socket
    $chatSocketService.sendMessage(props.conversationId, {
        content: content.value.trim() || undefined,
        mediaUrl,
        messageType,
    })

    // Clear form after sending
    content.value = ''
    mediaUrls.value = []
}
</script>

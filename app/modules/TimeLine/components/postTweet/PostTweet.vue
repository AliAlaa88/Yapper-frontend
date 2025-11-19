<template>
    <form
        class="flex flex-row gap-4 p-4 bg-primary"
        :class="border ? 'border-b border-primary' : ''"
        @submit.prevent="handleSubmit"
    >
        <NuxtLink :to="`/profile/${user.username}`">
            <img :src="user.avatar_url" :alt="user.name" class="w-10 h-10 rounded-full" />
        </NuxtLink>

        <div class="flex-1">
            <textarea
                placeholder="What's happening?"
                v-model="content"
                id="post-tweet-textarea"
                class="w-full h-24 p-4 border-b border-primary resize-none bg-primary text-primary placeholder:text-muted focus:outline-none focus:border-blue focus:bg-primary"
            ></textarea>

            <!-- Media Preview -->
            <div
                v-if="mediaUrls.length > 0"
                class="mt-4 rounded-2xl overflow-hidden border border-primary"
            >
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
                        />
                        <button
                            type="button"
                            @click="removeMedia(index)"
                            class="absolute top-2 right-2 w-8 h-8 bg-alternate hover:bg-hover-alternate rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <X class="w-5 h-5 text-alternate" />
                        </button>
                    </div>
                </div>
            </div>

            <!--  post footer -->
            <div class="flex flex-row justify-between items-center mt-4">
                <ul class="flex flex-row gap-2 items-center">
                    <li class="relative inline-flex">
                        <MediaUpload
                            @select="handleSelectMedia"
                            :disabled="mediaUrls.length >= 4"
                        />
                    </li>
                    <li class="relative inline-flex">
                        <CustomToolTip side="bottom">
                            <template #trigger>
                                <button
                                    type="button"
                                    @click="toggleGifPicker"
                                    id="post-tweet-gif-picker-btn"
                                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors"
                                >
                                    <ImagePlay class="w-5 h-5 text-blue" />
                                </button>
                            </template>
                            <template #content>
                                <div :class="contentClass">GIFs</div>
                            </template>
                        </CustomToolTip>

                        <!-- GifPicker positioned relative to button -->
                        <GifPicker
                            :is-open="showGifPicker"
                            @select="handleGifSelect"
                            @close="showGifPicker = false"
                        />
                    </li>
                    <li class="relative inline-flex">
                        <CustomToolTip side="bottom">
                            <template #trigger>
                                <button
                                    type="button"
                                    @click="toggleEmojiPicker"
                                    id="post-tweet-emoji-picker-btn"
                                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors"
                                >
                                    <Smile class="w-5 h-5 text-blue" />
                                </button>
                            </template>
                            <template #content>
                                <div :class="contentClass">Emoji</div>
                            </template>
                        </CustomToolTip>
                        <EmojiPicker
                            :is-open="showEmojiPicker"
                            @select="handleEmojiSelect"
                            @close="showEmojiPicker = false"
                        />
                    </li>
                </ul>
                <button
                    type="submit"
                    :disabled="disablePostButton"
                    id="post-tweet-post-btn"
                    class="px-4 py-2 bg-alternate text-alternate rounded-full font-bold hover:bg-blue-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Post
                </button>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { Smile, ImagePlay, X } from 'lucide-vue-next'
import { CustomToolTip } from '~/modules/Common/components/Tooltip'
import MediaUpload from './subComponents/MediaUpload'
import GifPicker from './subComponents/GifPicker/GifPicker.vue'
import EmojiPicker from './subComponents/EmojiPicker'
import { getUser } from '~/utils/helpers'
import type { User as UserType } from '~/modules/Common/types/user'
import { tooltipContentClass as contentClass } from '~/modules/Common/constants/stylesConstants'
import { useUploadMedia } from '../../queries/useUploadMedia'
const props = withDefaults(
    defineProps<{
        border: boolean
    }>(),
    {
        border: true,
    },
)

const user = getUser() as UserType
console.log('user =======>', user)

interface MediaItem {
    url: string
    type: 'image' | 'video'
}

const content = ref('')
const showGifPicker = ref(false)
const showEmojiPicker = ref(false)

const mediaUrls = ref<MediaItem[]>([])

const uploadMedia = useUploadMedia()

// Handle processing the uploaded media response
const processUploadResponse = (response: any, type: 'image' | 'video') => {
    if (response?.data?.url) {
        const url = response.data.url
        // Check if this URL is already in the list to prevent duplicates
        const exists = mediaUrls.value.some((item) => item.url === url)

        if (!exists && mediaUrls.value.length < 4) {
            mediaUrls.value.push({
                url: url,
                type: type,
            })
        }
    }
}

const disablePostButton = computed(() => {
    return content.value.trim().length === 0 && mediaUrls.value.length === 0
})

const handleSubmit = () => {
    console.log(content.value)
    console.log('Media URLs:', mediaUrls.value)
    // TODO: Implement actual tweet posting with media
    content.value = ''
    mediaUrls.value = []
}

const handleSelectMedia = async (files: File[]) => {
    console.log(files)

    for (const media of files) {
        // Check if we've reached the limit
        if (mediaUrls.value.length >= 4) {
            console.warn('Maximum of 4 media items allowed')
            break
        }

        const type = media.type.includes('image') ? 'image' : 'video'
        console.log('type =======>', type)

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
}

const toggleEmojiPicker = () => {
    showEmojiPicker.value = !showEmojiPicker.value
    showGifPicker.value = false
}

const handleEmojiSelect = (emoji: any) => {
    content.value += emoji.i
}
</script>

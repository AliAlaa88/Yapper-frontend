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
            <FormattedTextarea
                v-model="content"
                placeholder="What's happening?"
                id="post-tweet-textarea"
            />

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
                            class="absolute top-2 right-2 w-8 h-8 bg-alternate hover:bg-hover-alternate rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                            <X class="w-5 h-5 text-alternate" />
                        </button>
                    </div>
                </div>
            </div>

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
                                    :disabled="mediaUrls.length >= 4"
                                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ImagePlay class="w-5 h-5 text-accent" />
                                </button>
                            </template>
                            <template #content>
                                <div :class="contentClass">GIFs</div>
                            </template>
                        </CustomToolTip>

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
                                    <Smile class="w-5 h-5 text-accent" />
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
import { FormattedTextarea } from './subComponents/FormattedTextarea' // Import the new component
import { getUser } from '~/utils/helpers'
import type { User as UserType } from '~/modules/Common/types/user'
import { tooltipContentClass as contentClass } from '~/modules/Common/constants/stylesConstants'
import { useUploadMedia } from '../../queries/useUploadMedia'
import { usePostTweet } from '../../queries/usePostTweet'

const props = withDefaults(
    defineProps<{
        border: boolean
    }>(),
    {
        border: true,
    },
)

const user = getUser() as UserType

interface MediaItem {
    url: string
    type: 'image' | 'video'
}

const content = ref('')
const showGifPicker = ref(false)
const showEmojiPicker = ref(false)
const mediaUrls = ref<MediaItem[]>([])
const uploadMedia = useUploadMedia()
const postTweet = usePostTweet()

const processUploadResponse = (response: any, type: 'image' | 'video') => {
    if (response?.data?.url) {
        const url = response.data.url
        const exists = mediaUrls.value.some((item) => item.url === url)
        if (!exists && mediaUrls.value.length < 4) {
            mediaUrls.value.push({ url: url, type: type })
        }
    }
}

const disablePostButton = computed(() => {
    return content.value.trim().length === 0 && mediaUrls.value.length === 0
})

const handleSubmit = async () => {
    try {
        await postTweet.mutateAsync({
            content: content.value,
            videos: mediaUrls.value
                .filter((media) => media.type === 'video')
                .map((media) => media.url),
            images: mediaUrls.value
                .filter((media) => media.type === 'image')
                .map((media) => media.url),
        })

        content.value = ''
        mediaUrls.value = []
    } catch (error) {
        console.error('Failed to post tweet:', error)
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
    // Simply appending to content will trigger the watch inside RichTextarea
    content.value += emoji.i
}
</script>

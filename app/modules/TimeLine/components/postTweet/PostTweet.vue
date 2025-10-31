<template>
    <form
        class="flex flex-row gap-4 p-4"
        :class="border ? 'border-b border-primary' : ''"
        @submit.prevent="handleSubmit"
    >
        <!-- User Avatar logo for now to be changed to the user avatar -->
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
            <!--  post footer -->
            <div class="flex flex-row justify-between items-center mt-4">
                <ul class="flex flex-row gap-2">
                    <li>
                        <MediaUpload @select="handleSelectMedia" />
                    </li>
                    <li class="relative inline-flex">
                        <Tooltip text="GIFs" position="bottom">
                            <template #trigger>
                                <button
                                    @click="toggleGifPicker"
                                    id="post-tweet-gif-picker-btn"
                                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors"
                                >
                                    <ImagePlay class="w-5 h-5 text-blue" />
                                </button>
                            </template>
                        </Tooltip>

                        <!-- GifPicker positioned relative to button -->
                        <GifPicker
                            :is-open="showGifPicker"
                            @select="handleGifSelect"
                            @close="showGifPicker = false"
                        />
                    </li>
                    <li class="relative inline-flex">
                        <Tooltip text="Emoji" position="bottom">
                            <template #trigger>
                                <button
                                    @click="toggleEmojiPicker"
                                    id="post-tweet-emoji-picker-btn"
                                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors"
                                >
                                    <Smile class="w-5 h-5 text-blue" />
                                </button>
                            </template>
                        </Tooltip>
                        <EmojiPicker
                            :is-open="showEmojiPicker"
                            @select="handleEmojiSelect"
                            @close="showEmojiPicker = false"
                        />
                    </li>
                </ul>
                <button
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
import { Smile, ImagePlay } from 'lucide-vue-next'
import Tooltip from '~/modules/Common/components/toolTip'
import MediaUpload from './subComponents/MediaUpload'
import GifPicker from './subComponents/GifPicker/GifPicker.vue'
import EmojiPicker from './subComponents/EmojiPicker'
import { getUser } from '~/utils/helpers'
import type { User as UserType } from '~/modules/auth/types/user'
const props = withDefaults(
    defineProps<{
        border: boolean
    }>(),
    {
        border: true,
    },
)

const user = getUser() as UserType

const content = ref('')
const showGifPicker = ref(false)
const showEmojiPicker = ref(false)

const disablePostButton = computed(() => {
    return content.value.trim().length === 0
})

const handleSubmit = () => {
    console.log(content.value)
    content.value = ''
}

const handleSelectMedia = (files: File[]) => {
    console.log(files)
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

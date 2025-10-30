<template>
    <form class="flex flex-row gap-4 p-4 border-b border-primary" @submit.prevent="handleSubmit">
        <!-- User Avatar logo for now to be changed to the user avatar -->
        <div>
            <img
                src="../../../../assets/logo-white.png"
                alt="logo"
                class="w-10 h-10 rounded-full"
            />
        </div>

        <div class="flex-1">
            <textarea
                placeholder="What's happening?"
                v-model="content"
                class="w-full h-24 p-4 border-b border-primary resize-none bg-primary text-primary placeholder:text-muted focus:outline-none focus:border-blue focus:bg-primary"
            ></textarea>
            <!--  post footer -->
            <div class="flex flex-row justify-between items-center mt-4">
                <ul class="flex flex-row gap-2">
                    <li>
                        <MediaUpload @select="handleSelectMedia" />
                    </li>
                    <li>
                        <Tooltip text="GIF" position="bottom">
                            <template #trigger>
                                <button
                                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors"
                                >
                                    <ImagePlay class="w-5 h-5 text-blue" />
                                </button>
                            </template>
                        </Tooltip>
                    </li>
                    <li>
                        <Tooltip text="Emoji" position="bottom">
                            <template #trigger>
                                <button
                                    class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors"
                                >
                                    <Smile class="w-5 h-5 text-blue" />
                                </button>
                            </template>
                        </Tooltip>
                    </li>
                </ul>
                <button
                    :disabled="disablePostButton"
                    class="px-4 py-2 bg-alternate text-alternate rounded-full font-bold hover:bg-blue-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Post
                </button>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ImagePlay, Smile } from 'lucide-vue-next'
import Tooltip from '~/modules/Common/components/toolTip'
import MediaUpload from './subComponents/MediaUpload'
const content = ref('')

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
</script>

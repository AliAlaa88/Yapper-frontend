<template>
    <CustomToolTip side="bottom">
        <template #trigger>
            <button
                @click="openMediaDrawer"
                id="post-tweet-media-upload-btn"
                class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors"
            >
                <Image class="w-5 h-5 text-blue" />
            </button>
        </template>
        <template #content>
            <div :class="contentClass">Media</div>
        </template>
    </CustomToolTip>

    <input
        ref="fileInput"
        type="file"
        accept="image/*,video/*"
        id="post-tweet-media-upload-input"
        style="display: none"
        @change="onFileChange"
    />
</template>

<script setup>
import { Image } from 'lucide-vue-next'
import { CustomToolTip } from '~/components/ui/tooltip'
import { tooltipContentClass as contentClass } from '~/modules/Common/constants/stylesConstants'
import { ref } from 'vue'

const emit = defineEmits(['select'])

const fileInput = ref(null)

const openMediaDrawer = () => {
    fileInput.value?.click()
}

const onFileChange = (e) => {
    const files = Array.from(e.target.files)
    emit('select', files) // to parent component
}
</script>

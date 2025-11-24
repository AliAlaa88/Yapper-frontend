<template>
    <CustomToolTip side="bottom">
        <template #trigger>
            <button
                type="button"
                @click="openMediaDrawer"
                :disabled="disabled"
                id="post-tweet-media-upload-btn"
                class="cursor-pointer hover:bg-hover rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Image class="w-5 h-5 text-accent" />
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
        multiple="true"
    />
</template>

<script setup lang="ts">
import { Image } from 'lucide-vue-next'
import { CustomToolTip } from '~/modules/Common/components/Tooltip'
import { tooltipContentClass as contentClass } from '~/modules/Common/constants/stylesConstants'
import { ref } from 'vue'

const props = withDefaults(
    defineProps<{
        disabled?: boolean
    }>(),
    {
        disabled: false,
    },
)

const emit = defineEmits(['select'])

const fileInput = ref<HTMLInputElement | null>(null)

const openMediaDrawer = () => {
    if (props.disabled) return
    fileInput.value?.click()
}

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target && target.files) {
        const files = Array.from(target.files)
        emit('select', files) // to parent component
    }
}
</script>

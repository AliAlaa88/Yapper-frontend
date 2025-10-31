<template>
    <div
        v-if="isOpen"
        class="absolute z-[60] mt-2 bg-primary border border-primary rounded-lg shadow-lg overflow-hidden left-0"
    >
        <div class="p-2 border-b border-primary flex justify-between items-center">
            <span class="text-primary font-semibold text-sm">Emoji</span>
            <button @click="$emit('close')" class="text-muted hover:text-primary">
                <X class="w-4 h-4" />
            </button>
        </div>
        <EmojiPicker @select="onSelect" :theme="emojiTheme" />
    </div>
</template>

<script setup>
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { X } from 'lucide-vue-next'

const props = defineProps({
    isOpen: Boolean,
})

const emit = defineEmits(['select', 'close'])

// Detect system dark mode preference
const emojiTheme = computed(() => {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
})

const onSelect = (emoji) => {
    emit('select', emoji)
}
</script>

<style scoped>
:deep(.emoji-overlay__overlay) {
    padding: 0 !important;
}

:deep(.emoji-overlay) {
    width: 100% !important;
}
</style>

<template>
    <div
        v-if="isOpen"
        class="absolute z-[60] bg-primary border border-primary rounded-lg shadow-lg overflow-hidden left-0"
        :class="position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'"
    >
        <div class="p-2 border-b border-primary flex justify-between items-center">
            <span class="text-primary font-semibold text-sm">Emoji</span>
            <button
                @click="$emit('close')"
                class="text-muted hover:text-primary"
                id="close-emoji-picker-btn"
            >
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
    position: {
        type: String,
        default: 'bottom',
        validator: (value) => ['top', 'bottom'].includes(value),
    },
})

const emit = defineEmits(['select', 'close'])

const emojiTheme = computed(() => {
    if (typeof window !== 'undefined') {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
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

<template>
    <!-- Mobile: Bottom sheet overlay -->
    <div
        v-if="isOpen"
        class="md:hidden fixed inset-0 bg-black/50 z-50"
        @click="$emit('close')"
    ></div>
    <div
        v-if="isOpen"
        ref="emojiPickerRef"
        class="fixed md:absolute z-60 bg-primary border border-primary rounded-lg md:rounded-lg rounded-t-2xl rounded-b-none shadow-lg overflow-hidden
               inset-x-0 bottom-0 md:bottom-auto md:inset-x-auto
               w-full md:w-auto
               md:left-0"
        :class="{ 'md:bottom-full md:mb-2': position === 'top', 'md:top-full md:mt-2': position !== 'top' }"
        @click.stop
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
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
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

const emojiPickerRef = ref(null)

const emojiTheme = computed(() => {
    if (typeof window !== 'undefined') {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'light'
})

const onSelect = (emoji) => {
    emit('select', emoji)
}

const handleClickOutside = (event) => {
    if (emojiPickerRef.value && !emojiPickerRef.value.contains(event.target)) {
        emit('close')
    }
}

watch(
    () => props.isOpen,
    async (newValue) => {
        if (newValue) {
            await nextTick()
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside, true)
            }, 0)
        } else {
            document.removeEventListener('click', handleClickOutside, true)
        }
    },
)

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
:deep(.emoji-overlay__overlay) {
    padding: 0 !important;
}

:deep(.emoji-overlay) {
    width: 100% !important;
}
</style>

<template>
    <!-- Mobile: Bottom sheet overlay -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50" @click="$emit('close')"/>
    <div
        v-if="isOpen"
        ref="emojiPickerRef"
        class="fixed z-60 bg-primary border border-primary shadow-lg overflow-hidden md:rounded-lg rounded-t-2xl rounded-b-none inset-x-0 bottom-0 md:bottom-auto md:inset-x-auto w-full md:w-auto"
        :style="pickerStyle"
        @click.stop
    >
        <div class="p-2 border-b border-primary flex justify-between items-center">
            <span class="text-primary font-semibold text-sm">Emoji</span>
            <button
                id="close-emoji-picker-btn"
                class="text-muted hover:text-primary"
                @click="$emit('close')"
            >
                <X class="w-4 h-4" />
            </button>
        </div>
        <EmojiPicker :theme="emojiTheme" @select="onSelect" />
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount, computed } from 'vue'
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
const triggerRect = ref(null)

// Compute style for fixed positioning on desktop
const pickerStyle = computed(() => {
    // On mobile, use bottom sheet positioning
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return {}
    }

    if (!triggerRect.value) {
        return {}
    }

    const rect = triggerRect.value
    const pickerWidth = 352 // emoji picker default width

    if (props.position === 'top') {
        return {
            left: `${Math.max(8, rect.left - pickerWidth / 2 + rect.width / 2)}px`,
            bottom: `${window.innerHeight - rect.top + 8}px`,
        }
    } else {
        return {
            left: `${Math.max(8, rect.left - pickerWidth / 2 + rect.width / 2)}px`,
            top: `${rect.bottom + 8}px`,
        }
    }
})

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
            // Get the trigger button's position (parent element's first button)
            if (emojiPickerRef.value) {
                const parent = emojiPickerRef.value.parentElement
                const triggerButton = parent?.querySelector('button')
                if (triggerButton) {
                    triggerRect.value = triggerButton.getBoundingClientRect()
                }
            }
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside, true)
            }, 0)
        } else {
            document.removeEventListener('click', handleClickOutside, true)
            triggerRect.value = null
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

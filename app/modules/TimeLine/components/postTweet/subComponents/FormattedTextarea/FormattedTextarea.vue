<template>
    <div class="relative w-full group">
        <div
            ref="displayRef"
            class="absolute inset-0 w-full h-full p-4 whitespace-pre-wrap break-words overflow-hidden border-b border-transparent text-base leading-normal font-sans bg-transparent pointer-events-none"
            style="z-index: 10"
            aria-hidden="true"
        >
            <span v-if="!modelValue" class="text-muted">{{ placeholder }}</span>
            <span v-else v-html="formattedContent"></span>
            <br v-if="modelValue.endsWith('\n')" />
        </div>

        <textarea
            ref="textareaRef"
            :value="modelValue"
            @input="handleInput"
            @scroll="handleScroll"
            :id="id"
            :placeholder="!modelValue ? placeholder : ''"
            class="relative w-full min-h-24 p-4 bg-transparent text-transparent caret-black dark:caret-white resize-none focus:outline-none whitespace-pre-wrap break-words overflow-y-hidden text-base leading-normal font-sans placeholder:text-transparent z-20 selection:bg-blue-200/30"
            :class="props.inlineborder ? 'border-b border-primary focus:border-blue' : ''"
            spellcheck="false"
        ></textarea>
    </div>
</template>

<script setup lang="ts">
import { parseTextWithTags } from '~/utils/helpers'

interface Props {
    modelValue: string
    placeholder?: string
    id?: string
    inlineborder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: "What's happening?",
    id: '',
    inlineborder: true,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const displayRef = ref<HTMLDivElement | null>(null)

// Generate the HTML for the background layer
const formattedContent = computed(() => {
    return parseTextWithTags(props.modelValue)
})

// Auto-resize logic
const adjustHeight = () => {
    if (textareaRef.value) {
        // Reset height to auto to shrink if needed, then set to scrollHeight
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
    }
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
    adjustHeight()
}

// Sync scroll between textarea and display div (if content gets very long)
const handleScroll = () => {
    if (textareaRef.value && displayRef.value) {
        displayRef.value.scrollTop = textareaRef.value.scrollTop
    }
}

// Watch for external changes (e.g., emoji picker)
watch(
    () => props.modelValue,
    () => {
        nextTick(() => {
            adjustHeight()
        })
    },
)

onMounted(() => {
    adjustHeight()
})
</script>

<style scoped>
/* Additional insurance to ensure fonts match exactly.
   Tailwind utility classes usually handle this, but explicit inheritance prevents bugs.
*/
textarea,
div {
    font-family: inherit;
    letter-spacing: inherit;
}
</style>

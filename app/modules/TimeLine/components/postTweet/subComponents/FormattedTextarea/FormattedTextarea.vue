<template>
    <div class="relative w-full group">
        <div
            ref="displayRef"
            class="absolute inset-0 w-full h-full p-4 whitespace-pre-wrap break-words overflow-hidden border-b border-transparent text-base leading-normal font-sans bg-transparent pointer-events-none"
            style="z-index: 10; unicode-bidi: plaintext"
            :dir="textDirection"
            aria-hidden="true"
        >
            <span v-if="!modelValue" class="text-muted">{{ placeholder }}</span>

            <span v-else v-html="formattedContent" />
            <br v-if="modelValue.endsWith('\n')" />
        </div>

        <textarea
            :id="id"
            ref="textareaRef"
            :value="modelValue"
            :placeholder="!modelValue ? placeholder : ''"
            :dir="textDirection"
            class="relative w-full min-h-24 p-4 bg-transparent text-transparent caret-black dark:caret-white resize-none focus:outline-none whitespace-pre-wrap break-words overflow-y-hidden text-base leading-normal font-sans placeholder:text-transparent z-20 selection:bg-blue-200/30"
            :class="props.inlineborder ? 'border-b border-primary focus:border-accent' : ''"
            style="unicode-bidi: plaintext"
            spellcheck="false"
            @input="handleInput"
            @scroll="handleScroll"
        />

        <MentionSuggestion
            :visible="showMentionPopup"
            :suggestions="mentionSuggestions"
            :loading="mentionLoading"
            :position="popupPosition"
            @select="handleMentionSelection"
            @close="resetMentions"
        />
    </div>
</template>

<script setup lang="ts">
import { parseLinks } from '~/lib/utils'
import MentionSuggestion from '../MentionSuggestion/MentionSuggestion.vue'
import type { UserSuggestion } from '~/modules/search/types'
import { useDebounce } from '~/modules/Common/composables/useDebounce'
interface Props {
    modelValue: string
    placeholder?: string
    id?: string
    inlineborder?: boolean
    maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: "What's happening?",
    id: '',
    inlineborder: true,
    maxLength: undefined,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const displayRef = ref<HTMLDivElement | null>(null)
const mentionSuggestions = ref<UserSuggestion[]>([])
const mentionQuery = ref('')
const mentionLoading = ref(false)
const showMentionPopup = ref(false)
const mentionStartIndex = ref<number | null>(null)
const popupPosition = ref({ top: 60, left: 0 })
const MIN_MENTION_CHARS = 3
const MAX_SUGGESTIONS = 5
const debouncedMentionQuery = useDebounce(mentionQuery, 250)

const { locale } = useI18n()
const textDirection = computed(() => {
    return locale.value === 'ar' ? 'rtl' : 'ltr'
})

const formattedContent = computed(() => {
    const text = props.modelValue

    // If maxLength is set and text exceeds it, split and color the overflow red
    if (props.maxLength && text.length > props.maxLength) {
        const validPart = text.slice(0, props.maxLength)
        const overflowPart = text.slice(props.maxLength)
        return (
            parseLinks(validPart, false, true) +
            `<span class="text-red-500 bg-red-500/20">${parseLinks(overflowPart)}</span>`
        )
    }

    return parseLinks(text, false, true)
})

const adjustHeight = () => {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
    }
}

const { $searchService } = useNuxtApp()

type MentionMatch = { query: string; start: number; end: number }

const findMentionAtCursor = (text: string, caret: number): MentionMatch | null => {
    const uptoCaret = text.slice(0, caret)
    const match = uptoCaret.match(/@([\p{L}0-9_]{0,})$/u)
    if (!match) return null
    const query = match[1] ?? ''
    const start = caret - match[0].length
    return { query, start, end: caret }
}

const resetMentions = () => {
    mentionSuggestions.value = []
    showMentionPopup.value = false
    mentionStartIndex.value = null
    mentionLoading.value = false
}

const fetchMentionSuggestions = async (query: string) => {
    if (query.length < MIN_MENTION_CHARS) {
        resetMentions()
        return
    }

    mentionLoading.value = true
    showMentionPopup.value = true
    try {
        console.log('[MentionSuggestions] fetching', { query })
        const users = await $searchService.getUsers(query)
        const list = Array.isArray(users) ? users : []
        console.log('[MentionSuggestions] fetched', { count: list.length })
        mentionSuggestions.value = list.slice(0, MAX_SUGGESTIONS)
    } catch (error) {
        console.error('Failed to fetch mention suggestions', error)
        mentionSuggestions.value = []
    } finally {
        mentionLoading.value = false
    }
}

const handleMentionSelection = async (user: UserSuggestion) => {
    const textarea = textareaRef.value
    if (!textarea) return

    const text = textarea.value
    const caret = textarea.selectionStart ?? text.length
    const mention = findMentionAtCursor(text, caret)

    const start = mention?.start ?? mentionStartIndex.value ?? caret
    const end = mention?.end ?? caret

    const before = text.slice(0, start)
    const after = text.slice(end)
    const insertion = `@${user.username} `
    const updated = before + insertion + after

    emit('update:modelValue', updated)

    await nextTick()
    const newCaret = (start + insertion.length) as number
    textarea.selectionStart = textarea.selectionEnd = newCaret
    adjustHeight()
    resetMentions()
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
    adjustHeight()

    const caret = target.selectionStart ?? target.value.length
    const mention = findMentionAtCursor(target.value, caret)

    if (mention) {
        mentionStartIndex.value = mention.start
        mentionQuery.value = mention.query
        showMentionPopup.value = mention.query.length >= MIN_MENTION_CHARS
    } else {
        resetMentions()
    }
}

const handleScroll = () => {
    if (textareaRef.value && displayRef.value) {
        displayRef.value.scrollTop = textareaRef.value.scrollTop
    }
}

watch(
    () => props.modelValue,
    () => {
        nextTick(() => {
            adjustHeight()
        })
    },
)

watch(
    () => debouncedMentionQuery.value,
    (val) => {
        if (!val || val.length < MIN_MENTION_CHARS) {
            resetMentions()
            return
        }
        fetchMentionSuggestions(val)
    },
)

onMounted(() => {
    adjustHeight()
})
</script>

<style scoped>
textarea,
div {
    font-family: inherit;
    letter-spacing: inherit;
}
</style>

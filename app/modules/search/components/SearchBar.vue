<template>
    <div class="relative w-full">
        <div class="flex items-center w-full">
            <button
                v-if="isFocused && hasArrow"
                id="btn-back-search"
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover transition-colors shrink-0 cursor-pointer"
                :aria-label="$t('navigation.back')"
                @click="handleBack"
            >
                <ArrowLeft :size="20" class="text-primary" />
            </button>
            <div
                class="flex items-center rounded-full px-4 py-2 transition-colors border-2 flex-1 min-w-0"
                :class="[isFocused ? 'border-accent' : 'border-primary']"
            >
                <Search :size="18" class="text-secondary" />
                <input
                    id="input-search-bar"
                    ref="inputRef"
                    v-model="searchQueryInput"
                    type="text"
                    class="bg-transparent outline-none ml-2 text-primary flex-1"
                    :placeholder="$t('search.searchPlaceholder')"
                    style="unicode-bidi: plaintext"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @keydown.enter="handleSearchSubmit(searchQueryInput)"
                >
                <CircleX
                    v-if="isFocused && searchQueryInput !== ''"
                    id="btn-clear-search"
                    :size="20"
                    class="cursor-pointer"
                    @click="handleClearQuery"
                />
            </div>
        </div>
        <div
            v-if="isFocused"
            class="absolute top-full left-0 right-0 mt-1 bg-primary rounded-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
            :class="[isFocused ? 'shadow-secondary' : '']"
            @mousedown.prevent
        >
            <SearchHistory v-if="searchQuery === ''" @handle-search-submit="handleSearchSubmit" />
            <SearchSuggestions
                v-else
                :search-query="searchQuery"
                @handle-search-submit="handleSearchSubmit"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Search, CircleX } from 'lucide-vue-next'
import SearchHistory from '~/modules/search/components/SearchHistory.vue'
import SearchSuggestions from '~/modules/search/components/SearchSuggestions.vue'
import { useDebounce } from '~/modules/Common/composables/useDebounce'

const props = defineProps<{
    hasArrow?: boolean
}>()

const route = useRoute()
const router = useRouter()
const isFocused = ref(false)
const searchQueryInput = ref('')
const searchQuery = useDebounce(searchQueryInput, 300)
const inputRef = ref<HTMLInputElement | null>(null)
const STORAGE_KEY = 'yapper-search-history'
const initialQuery = (history.state.user as string) || ''

onMounted(() => {
    searchQueryInput.value =
        (route.query.q as string) || (initialQuery ? `from:${initialQuery} ` : '') || ''
})

watch(
    () => route.query.q,
    (newQuery) => {
        searchQueryInput.value = (newQuery as string) || ''
    },
)

const handleClearQuery = () => {
    searchQueryInput.value = ''
    isFocused.value = true
}

const handleFocus = () => {
    setTimeout(() => {
        isFocused.value = true
    }, 200)
}

const handleBlur = () => {
    setTimeout(() => {
        isFocused.value = false
    }, 200)
}

const handleBack = () => {
    isFocused.value = false
}

const handleSearchSubmit = (
    query: string,
    src: 'typed_query' | 'typeahead_click' | 'recent_search_click' | 'trend_click' = 'typed_query',
) => {
    if (!query.trim()) return
    searchQueryInput.value = query

    if (inputRef.value) {
        inputRef.value.blur()
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const searchHistory = stored ? JSON.parse(stored) : []

        const existingIndex = searchHistory.findIndex(
            (item: any) => item.type === 'query' && item.query === query,
        )
        if (existingIndex !== -1) {
            searchHistory.splice(existingIndex, 1)
        }

        searchHistory.unshift({
            type: 'query',
            query: query,
            timestamp: Date.now(),
        })

        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory))
        router.push({
            path: '/search',
            query: {
                q: query,
                src,
            },
        })

        isFocused.value = false
    } catch (error) {
        console.error('Failed to save search query:', error)
    }
}
</script>

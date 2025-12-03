<template>
    <div class="relative w-full">
        <div class="flex items-center w-full">
            <button
                v-if="isFocused && hasArrow"
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover transition-colors shrink-0"
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
                    type="text"
                    class="bg-transparent outline-none ml-2 text-primary flex-1"
                    :placeholder="$t('search.searchPlaceholder')"
                    @focus="isFocused = true"
                    @blur="handleBlur"
                    v-model="searchQuery"
                    @keydown.enter="handleSearchSubmit"
                />
            </div>
        </div>
        <div
            v-if="isFocused"
            class="absolute top-full left-0 right-0 mt-1 bg-primary rounded-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
            :class="[isFocused ? 'shadow-secondary' : '']"
            @mousedown.prevent
        >
            <SearchHistory v-if="searchQuery === ''" />
            <SearchSuggestions v-else :searchQuery="searchQuery" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowLeft, Search } from 'lucide-vue-next'
import SearchHistory from '~/modules/search/components/SearchHistory.vue'
import SearchSuggestions from '~/modules/search/components/SearchSuggestions.vue'

defineProps<{
    hasArrow: boolean
}>()

const isFocused = ref(false)
const searchQuery = ref('')
const STORAGE_KEY = 'yapper-search-history'

const handleBlur = () => {
    // Delay blur to allow button clicks to register
    setTimeout(() => {
        isFocused.value = false
    }, 200)
}

const handleBack = () => {
    isFocused.value = false
}

const handleSearchSubmit = () => {
    if (!searchQuery.value.trim()) return

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        let searchHistory = stored ? JSON.parse(stored) : []

        const existingIndex = searchHistory.findIndex((item: any) => item.query === searchQuery.value)
        if (existingIndex !== -1) {
            searchHistory.splice(existingIndex, 1)
        }

        searchHistory.unshift({ query: searchQuery.value })

        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory))

        // TODO: Navigate to search results or trigger search
        isFocused.value = false
    } catch (error) {
        console.error('Failed to save search query:', error)
    }
}
</script>

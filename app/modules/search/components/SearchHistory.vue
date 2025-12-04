<template>
    <div>
        <div v-if="searchQueries.length > 0" class="flex items-center justify-between px-4 py-3">
            <h3 class="text-primary font-bold text-[20px]">{{ $t('search.recent') }}</h3>
            <button
                v-if="searchQueries.length > 0"
                type="button"
                class="px-2 py-1 text-accent hover:bg-accent/10 text-[15px] rounded-full font-semibold transition-colors"
                @click="clearAll"
            >
                {{ $t('search.clearAll') }}
            </button>
        </div>
        <div v-else class="px-4 py-3 text-secondary">
            {{ $t('search.enterQuery') }}
        </div>
        <ul v-if="searchQueries.length > 0">
            <li
                v-for="(item, index) in searchQueries"
                :key="index"
                class="px-4 py-3 hover:bg-hover transition-colors"
            >
                <div class="flex items-center gap-3">
                    <Search :size="20" class="text-primary/50 shrink-0" />
                    <div class="flex-1 min-w-0 cursor-pointer" @click="$emit('handleSearchSubmit', item.query, 'recent_search_click')">
                        <div class="text-primary font-semibold text-[15px] truncate">{{ item.query }}</div>
                        <div v-if="item.is_trending" class="text-primary/50 text-[13px]">
                            {{ $t('search.trending') }}
                        </div>
                    </div>
                    <button
                        v-if="!item.is_trending"
                        type="button"
                        class="p-1 hover:bg-accent/10 rounded-full shrink-0 transition-colors"
                        @click.stop="removeQuery(index)"
                        :aria-label="$t('search.removeQuery') + ' ' + item.query"
                    >
                        <X :size="16" class="text-accent" />
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, X } from 'lucide-vue-next'
import type { SearchQuery } from '~/modules/search/types'

defineEmits<{
    handleSearchSubmit: [query: string, src: 'recent_search_click']
}>()

const STORAGE_KEY = 'yapper-search-history'
const searchQueries = ref<SearchQuery[]>([])

const loadSearchHistory = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            searchQueries.value = JSON.parse(stored)
        }
    } catch (error) {
        console.error('Failed to load search history:', error)
        searchQueries.value = []
    }
}

const saveSearchHistory = () => {
    try {
        console.log(searchQueries.value)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchQueries.value))
    } catch (error) {
        console.error('Failed to save search history:', error)
    }
}

const removeQuery = (index: number) => {
    searchQueries.value.splice(index, 1)
    saveSearchHistory()
}

const clearAll = () => {
    searchQueries.value = []
    saveSearchHistory()
}

onMounted(() => {
    loadSearchHistory()
})
</script>

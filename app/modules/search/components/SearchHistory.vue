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
            {{ $t('search.noRecentQueries') }}
        </div>
        <SearchQueriesList
            :list="searchQueries"
            @remove-query="removeQuery"
            @select-query="selectQuery"
        />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchQueriesList from './SearchQueriesList.vue'
import type { SearchQuery } from '~/modules/search/types'

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

const selectQuery = (query: string) => {
    // Handle query selection if needed
    console.log('Selected query:', query)
}

onMounted(() => {
    loadSearchHistory()
})
</script>

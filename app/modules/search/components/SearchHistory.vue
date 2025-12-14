<template>
    <div>
        <div v-if="sortedHistory.length > 0" class="flex items-center justify-between px-4 py-3">
            <h3 class="text-primary font-bold text-[20px]">{{ $t('search.recent') }}</h3>
            <button
                id="btn-clear-all-search-history"
                type="button"
                class="px-2 py-1 text-accent hover:bg-accent/10 text-[15px] rounded-full font-semibold transition-colors cursor-pointer"
                @click="clearAll"
            >
                {{ $t('search.clearAll') }}
            </button>
        </div>
        <div v-else class="px-4 py-3 text-secondary">
            {{ $t('search.enterQuery') }}
        </div>
        <ul v-if="sortedHistory.length > 0">
            <li
                v-for="(item, index) in sortedHistory"
                :key="index"
                class="px-4 py-3 hover:bg-hover transition-colors"
            >
                <!-- Query Item -->
                <div v-if="item.type === 'query'" class="flex items-center gap-3">
                    <Search :size="20" class="text-primary/50 shrink-0" />
                    <div
                        class="flex-1 min-w-0 cursor-pointer"
                        @click="handleQueryClick(item.query)"
                    >
                        <div class="text-primary font-semibold text-[15px] truncate">
                            {{ item.query }}
                        </div>
                    </div>
                    <button
                        :id="`btn-remove-search-history-${index}`"
                        type="button"
                        class="p-1 hover:bg-accent/10 rounded-full shrink-0 transition-colors cursor-pointer"
                        :aria-label="$t('search.removeQuery') + ' ' + item.query"
                        @click.stop="removeItem(index)"
                    >
                        <X :size="16" class="text-accent" />
                    </button>
                </div>

                <!-- User Item -->
                <div
                    v-else-if="item.type === 'user'"
                    class="flex items-center gap-3 cursor-pointer"
                    @click="handleUserClick(item)"
                >
                    <img
                        v-if="item.avatar_url"
                        :src="item.avatar_url"
                        :alt="item.name"
                        class="w-10 h-10 rounded-full object-cover shrink-0"
                        :onerror="`this.src = 'https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random'`"
                    />
                    <img
                        v-else
                        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`"
                        :alt="item.name"
                        class="w-10 h-10 rounded-full object-cover shrink-0"
                        :onerror="`this.src = 'https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random'`"
                    />
                    <div class="flex-1 min-w-0">
                        <div class="text-primary font-bold text-[15px] truncate">
                            {{ item.name }}
                        </div>
                        <div class="text-secondary text-[13px] truncate">@{{ item.username }}</div>
                    </div>
                    <button
                        type="button"
                        class="p-1 hover:bg-accent/10 rounded-full shrink-0 transition-colors"
                        :aria-label="$t('search.removeQuery') + ' ' + item.name"
                        @click.stop="removeItem(index)"
                    >
                        <X :size="16" class="text-accent" />
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X } from 'lucide-vue-next'

interface HistoryQuery {
    type: 'query'
    query: string
    timestamp: number
}

interface HistoryUser {
    type: 'user'
    user_id: string
    name: string
    username: string
    avatar_url: string
    timestamp: number
}

type HistoryItem = HistoryQuery | HistoryUser

const emits = defineEmits<{
    handleSearchSubmit: [query: string, src: 'recent_search_click']
}>()

const router = useRouter()
const STORAGE_KEY = 'yapper-search-history'
const searchHistory = ref<HistoryItem[]>([])

const sortedHistory = computed(() => {
    return [...searchHistory.value].sort((a, b) => b.timestamp - a.timestamp)
})

const loadSearchHistory = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored)
            // Migrate old format to new format
            searchHistory.value = parsed.map((item: any) => {
                if (!item.type) {
                    // Old format: { query: string }
                    return {
                        type: 'query',
                        query: item.query,
                        timestamp: Date.now(),
                    }
                }
                return item
            })
        }
    } catch (error) {
        console.error('Failed to load search history:', error)
        searchHistory.value = []
    }
}

const saveSearchHistory = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value))
    } catch (error) {
        console.error('Failed to save search history:', error)
    }
}

const removeItem = (index: number) => {
    const actualIndex = searchHistory.value.findIndex((item) => item === sortedHistory.value[index])
    if (actualIndex !== -1) {
        searchHistory.value.splice(actualIndex, 1)
        saveSearchHistory()
    }
}

const clearAll = () => {
    searchHistory.value = []
    saveSearchHistory()
}

const handleQueryClick = (query: string) => {
    // Move to top by updating timestamp
    const item = searchHistory.value.find((item) => item.type === 'query' && item.query === query)
    if (item) {
        item.timestamp = Date.now()
        saveSearchHistory()
    }
    emits('handleSearchSubmit', query, 'recent_search_click')
}

const handleUserClick = (user: HistoryUser) => {
    // Move to top by updating timestamp
    const item = searchHistory.value.find(
        (item) => item.type === 'user' && item.user_id === user.user_id,
    )
    if (item) {
        item.timestamp = Date.now()
        saveSearchHistory()
    }
    router.push(`/${user.username}`)
}

onMounted(() => {
    loadSearchHistory()
})
</script>

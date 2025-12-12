<template>
    <div>
        <div v-if="isLoading" class="px-4 py-3 text-secondary text-sm">
            {{ $t('messages.loading') }}
        </div>

        <div v-else-if="isError" class="px-4 py-3 text-red text-sm">
            {{ $t('messages.error') }}
        </div>

        <div v-else-if="suggestionsData">
            <!-- Suggested Queries -->
            <ul v-if="suggestionsData.suggested_queries?.length">
                <li
                    v-for="(item, index) in suggestionsData.suggested_queries"
                    :key="index"
                    class="px-4 py-2 hover:bg-hover transition-colors cursor-pointer"
                    data-testid="link-suggested-query"
                    @click="handleQueryClick(item.query)"
                >
                    <div class="flex items-center gap-3">
                        <Search :size="24" class="text-primary/50 shrink-0 font-bold mx-2" />
                        <div class="flex-1 min-w-0">
                            <div class="text-primary text-md truncate">
                                {{ item.query }}
                            </div>
                            <div v-if="item.is_trending" class="text-secondary text-md">
                                {{ $t('search.trending') }}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- Suggested Users -->
            <ul v-if="suggestionsData.suggested_users?.length">
                <li
                    v-for="user in suggestionsData.suggested_users"
                    :key="user.user_id"
                    class="px-4 py-2 hover:bg-hover transition-colors cursor-pointer"
                    data-testid="link-suggested-user"
                    @click="handleUserClick(user)"
                >
                    <div class="flex items-center gap-3">
                        <img
                            v-if="user.avatar_url"
                            :src="user.avatar_url"
                            :alt="user.name"
                            class="w-10 h-10 rounded-full object-cover shrink-0"
                            :onerror="`this.src = 'https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}'`"
                        />
                        <img
                            v-else
                            :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`"
                            :alt="user.name"
                            class="w-10 h-10 rounded-full object-cover shrink-0"
                            :onerror="`this.src = 'https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}'`"
                        />
                        <div class="flex-1 min-w-0">
                            <div class="text-primary font-bold text-[15px] truncate">
                                {{ user.name }}
                            </div>
                            <div class="text-secondary text-[13px] truncate">
                                @{{ user.username }}
                            </div>
                            <div
                                v-if="user.is_following || user.is_follower"
                                class="text-secondary text-[13px] flex items-center gap-1"
                            >
                                <UserRound :size="12" />
                                <span v-if="user.is_following && user.is_follower">
                                    {{ $t('search.followEachOther') }}
                                </span>
                                <span v-else-if="user.is_following">
                                    {{ $t('search.youFollow') }}
                                </span>
                                <span v-else-if="user.is_follower">
                                    {{ $t('search.followsYou') }}
                                </span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- Empty State -->
            <div
                v-if="
                    !suggestionsData.suggested_queries?.length &&
                    !suggestionsData.suggested_users?.length
                "
                class="px-4 py-3 text-secondary text-sm"
            >
                {{ $t('search.noSuggestions') }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, UserRound } from 'lucide-vue-next'
import { useSearchSuggestionsQuery } from '../queries/useSearchSuggestionsQuery'

const props = defineProps<{
    searchQuery: string
}>()

const emits = defineEmits<{
    handleSearchSubmit: [query: string, src: 'typeahead_click']
}>()

const router = useRouter()
const trimmedQuery = computed(() => props.searchQuery.trim())
const isEnabled = computed(() => trimmedQuery.value.length > 0)

const {
    data: suggestionsData,
    isLoading,
    isError,
} = useSearchSuggestionsQuery(trimmedQuery, isEnabled)

watch(suggestionsData, (newData) => {
    console.log('Search suggestions data:', newData)
})

// Handle query click (from suggestions)
const handleQueryClick = (query: string) => {
    emits('handleSearchSubmit', query, 'typeahead_click')
}

// Handle user click (from suggestions)
const handleUserClick = (user: any) => {
    const STORAGE_KEY = 'yapper-search-history'

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        let searchHistory = stored ? JSON.parse(stored) : []

        // Remove duplicate if exists
        const existingIndex = searchHistory.findIndex(
            (item: any) => item.type === 'user' && item.user_id === user.user_id,
        )
        if (existingIndex !== -1) {
            searchHistory.splice(existingIndex, 1)
        }

        // Add user to top of history
        searchHistory.unshift({
            type: 'user',
            user_id: user.user_id,
            name: user.name,
            username: user.username,
            avatar_url: user.avatar_url,
            timestamp: Date.now(),
        })

        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory))
        console.log('Saved user to history:', user)
        router.push(`/${user.username}`)
    } catch (error) {
        console.error('Failed to save user to history:', error)
        router.push(`/${user.username}`)
    }
}
</script>

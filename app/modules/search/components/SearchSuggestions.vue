<template>
    <div>
        <div v-if="isLoading" class="px-4 py-3 text-secondary text-sm">
            {{ $t('messages.loading') }}
        </div>

        <div v-else-if="isError" class="px-4 py-3 text-red text-sm">
            {{ $t('messages.error') }}
        </div>

        <div v-else>
            <!-- Suggested Queries -->
            <ul v-if="suggestionsData?.suggested_queries?.length">
                <li
                    v-for="(item, index) in suggestionsData.suggested_queries"
                    :key="index"
                    class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer"
                >
                    <div class="flex items-center gap-3">
                        <Search :size="20" class="text-primary/50 shrink-0" />
                        <div class="flex-1 min-w-0">
                            <div class="text-primary font-semibold text-[15px] truncate">
                                {{ item.query }}
                            </div>
                            <div v-if="item.is_trending" class="text-primary/50 text-[13px]">
                                {{ $t('search.trending') }}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- Suggested Users -->
            <ul v-if="suggestionsData?.suggested_users?.length">
                <li
                    v-for="user in suggestionsData.suggested_users"
                    :key="user.user_id"
                    class="px-2 py-2 hover:bg-hover transition-colors cursor-pointer"
                >
                    <div class="flex items-center gap-3">
                        <img
                            :src="user.avatar_url"
                            :alt="user.name"
                            class="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div class="flex-1 min-w-0">
                            <div class="text-primary font-semibold text-[15px] truncate">
                                {{ user.name }}
                            </div>
                            <div class="text-primary/50 text-[13px] truncate">
                                @{{ user.username }}
                            </div>
                            <div
                                v-if="user.is_following || user.is_follower"
                                class="text-primary/50 text-[13px] flex items-center gap-1"
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
                    !suggestionsData?.suggested_queries?.length &&
                    !suggestionsData?.suggested_users?.length
                "
                class="px-4 py-3 text-secondary text-sm"
            >
                {{ $t('search.noSuggestions') }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search, UserRound } from 'lucide-vue-next'
import { useSearchSuggestionsQuery } from '../queries/useSearchSuggestionsQuery'
const props = defineProps<{
    searchQuery: string
}>()

const trimmedQuery = computed(() => props.searchQuery.trim())
const isEnabled = computed(() => trimmedQuery.value.length > 0)

const {
    data: suggestionsData,
    isLoading,
    isError,
} = useSearchSuggestionsQuery(trimmedQuery.value, isEnabled)
</script>

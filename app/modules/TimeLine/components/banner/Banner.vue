<template>
    <div class="w-full h-full z-1 bg-primary flex flex-col gap-4 p-4 min-w-[18rem]">
        <!-- Search Bar -->
        <SearchBar v-if="!isSearch" />

        <!-- Trending Section -->
        <div
            v-if="!isSearch"
            class="bg-primary rounded-2xl border border-primary overflow-hidden min-h-[350px] flex flex-col justify-between"
        >
            <h2 class="px-4 py-3 text-xl font-bold text-primary">
                {{ t('timeline.banner.trending') }}
            </h2>

            <div v-if="isLoading" class="flex justify-center items-center">
                <LoadingSpinner />
            </div>
            <TrendsList v-else-if="trends.length > 0" :trends="trends" :show-rank="true" />

            <div v-else-if="isError" class="px-4 py-3">
                <p class="text-red-500">{{ t('timeline.banner.error') }}</p>
            </div>
            <div v-else-if="trends.length === 0" class="px-4 py-3">
                <p class="text-muted">{{ t('timeline.banner.noTrends') }}</p>
            </div>

            <NuxtLink
                to="/explore/tabs/trending"
                class="w-full px-4 py-3 text-left text-sm text-accent hover:bg-hover transition-colors"
            >
                {{ t('timeline.banner.showMore') }}
            </NuxtLink>
        </div>

        <!-- Who to Follow Section -->
        <div class="bg-primary rounded-2xl border border-primary overflow-hidden">
            <h2 class="px-4 py-3 text-xl font-bold text-primary">
                {{ t('timeline.banner.whoToFollow') }}
            </h2>
            <div
                class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-12 h-12 bg-gray rounded-full flex items-center justify-center text-white font-bold"
                    >
                        A
                    </div>
                    <div>
                        <p class="text-primary font-bold">User Name</p>
                        <p class="text-muted text-sm">@username</p>
                    </div>
                </div>
                <button
                    class="px-4 py-2 bg-blue text-white rounded-full font-bold hover:bg-blue-dark transition-colors"
                >
                    {{ t('timeline.banner.follow') }}
                </button>
            </div>
            <div
                class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-12 h-12 bg-gray rounded-full flex items-center justify-center text-white font-bold"
                    >
                        B
                    </div>
                    <div>
                        <p class="text-primary font-bold">Another User</p>
                        <p class="text-muted text-sm">@anotheruser</p>
                    </div>
                </div>
                <button
                    class="px-4 py-2 bg-blue text-white rounded-full font-bold hover:bg-blue-dark transition-colors"
                >
                    {{ t('timeline.banner.follow') }}
                </button>
            </div>
            <button
                class="w-full px-4 py-3 text-left text-sm text-accent hover:bg-hover transition-colors"
            >
                {{ t('timeline.banner.showMore') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SearchBar from '~/modules/search/components/SearchBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TrendsList from '~/modules/explore/components/common/TrendsList.vue'
import { useGetTrendsQuery } from '~/modules/explore/queries/useGetExploreQuery'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'

/////////////////////////////////////////////////

const trendsQuery = useGetTrendsQuery('', true, 3)
const trends = computed(() => trendsQuery.data.value || [])
const isLoading = computed(() => trendsQuery.isLoading.value)
const isError = computed(() => trendsQuery.isError.value)

/////////////////////////////////////////////////////////
const route = useRoute()
const isSearch = computed(
    () => route.path.startsWith('/explore') || route.path.startsWith('/search'),
)
const { t } = useI18n()
</script>

<template>
    <div class="w-full h-full z-1 bg-primary flex flex-col gap-4 p-4 min-w-[22rem] max-w-[22rem]">
        <!-- Search Bar -->
        <SearchBar v-if="!isSearch" />

        <!-- Trending Section -->
        <div
            v-if="!isSearch || isConnect"
            class="bg-primary rounded-2xl border border-primary overflow-hidden min-h-[350px] flex flex-col justify-between"
        >
            <h2 class="px-4 py-3 text-xl font-bold text-primary">
                {{ t('timeline.banner.trending') }}
            </h2>

            <div class="flex-1">
                <div v-if="isLoading" class="flex justify-center items-center">
                    <LoadingSpinner />
                </div>
                <TrendsList
                    v-else-if="trends.length > 0"
                    :trends="trends.slice(0, 3)"
                    :show-rank="true"
                />

                <div v-else-if="isError" class="px-4 py-3">
                    <p class="text-red-500">{{ t('timeline.banner.error') }}</p>
                </div>
                <div v-else-if="trends.length === 0" class="px-4 py-3">
                    <p class="text-muted">{{ t('timeline.banner.noTrends') }}</p>
                </div>
            </div>

            <NuxtLink
                id="link-show-more-trends"
                to="/explore/tabs/trending"
                class="w-full px-4 py-3 text-left text-sm text-accent hover:bg-hover transition-colors"
            >
                {{ t('timeline.banner.showMore') }}
            </NuxtLink>
        </div>

        <!-- Who to Follow Section -->
        <div v-if="!isSearch" class="bg-primary rounded-2xl border border-primary overflow-hidden">
            <h2 class="px-4 py-3 text-xl font-bold text-primary">
                {{ t('timeline.banner.whoToFollow') }}
            </h2>

            <div v-if="isLoadingUsers" class="flex justify-center items-center py-8">
                <LoadingSpinner />
            </div>

            <WhoToFollowList
                v-else-if="users.length > 0"
                :users="users.slice(0, userLimit)"
                :hide-bio="true"
            />

            <div v-else-if="isErrorUsers" class="px-4 py-3">
                <p class="text-red-500">{{ t('explore.errorLoading') }}</p>
            </div>

            <div v-else-if="users.length === 0" class="px-4 py-3">
                <p class="text-muted">{{ t('explore.noUsersFound') }}</p>
            </div>

            <NuxtLink
                id="link-show-more-who-to-follow"
                to="/explore/who-to-follow"
                class="w-full px-4 py-3 text-start text-sm text-accent hover:bg-hover transition-colors block"
            >
                {{ t('timeline.banner.showMore') }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SearchBar from '~/modules/search/components/SearchBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TrendsList from '~/modules/explore/components/common/TrendsList.vue'
import WhoToFollowList from '~/modules/explore/components/common/WhoToFollowList.vue'
import {
    useGetTrendsQuery,
    useGetWhoToFollowQuery,
} from '~/modules/explore/queries/useGetExploreQuery'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'

/////////////////////////////////////////////////

const trendsQuery = useGetTrendsQuery('', true, 3)
const trends = computed(() => trendsQuery.data.value || [])
const isLoading = computed(() => trendsQuery.isLoading.value)
const isError = computed(() => trendsQuery.isError.value)

const whoToFollowQuery = useGetWhoToFollowQuery(true)
const users = computed(() => whoToFollowQuery.data.value?.data || [])
const isLoadingUsers = computed(() => whoToFollowQuery.isLoading.value)
const isErrorUsers = computed(() => whoToFollowQuery.isError.value)
const userLimit = 2

/////////////////////////////////////////////////////////
const route = useRoute()
const isSearch = computed(
    () => route.path.startsWith('/explore') || route.path.startsWith('/search'),
)
const isConnect = computed(() => route.path.startsWith('/explore/who-to-follow'))
const { t } = useI18n()
</script>

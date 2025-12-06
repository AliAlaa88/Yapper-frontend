<template>
    <div class="bg-primary">
        <div class="sticky top-0 z-10 bg-primary/80 backdrop-blur-md">
            <div class="p-4">
                <SearchBar :has-arrow="true" />
            </div>

            <Tabs :tabs="tabsConfig" :active-tab="currentTab" :on-change="handleTabChange" />
        </div>
        <div class="min-h-screen">
            <TweetsList
                v-if="currentTab === 'top' && searchQuery"
                :fetchingSource="`/search/posts?query=${encodeURIComponent(searchQueryForApi)}${fromUsername ? `&username=${fromUsername}` : ''}`"
                class="min-h-[650px] w-full"
            />

            <TweetsList
                v-if="currentTab === 'latest' && searchQuery"
                :fetchingSource="`/search/posts/latest?query=${encodeURIComponent(searchQueryForApi)}${fromUsername ? `&username=${fromUsername}` : ''}`"
                class="min-h-[650px] w-full"
            />

            <UserList
                v-if="currentTab === 'people' && searchQuery"
                :fetching-source="`/search/users?query=${encodeURIComponent(searchQueryForApi)}${fromUsername ? `&username=${fromUsername}` : ''}`"
                query-key-prefix="search-users"
                :loading-text="$t('messages.loading')"
                :error-text="$t('messages.error')"
                :retry-text="$t('messages.tryAgain')"
                :empty-title="$t('search.emptyState.noUsers.title')"
                :empty-description="$t('search.emptyState.noUsers.description')"
                class="min-h-[650px] w-full"
            >
                <template #default="{ users }">
                    <FollowListUserCard
                        v-for="user in users as FollowUser[]"
                        :key="user.user_id"
                        :user="user"
                        :show-tooltip="false"
                    />
                </template>

                <template #empty>
                    <EmptyState
                        icon="👤"
                        :title="$t('search.emptyState.noUsers.title')"
                        :description="$t('search.emptyState.noUsers.description')"
                    />
                </template>
            </UserList>

            <MediaGrid
                v-if="currentTab === 'media' && searchQuery"
                :fetching-source="`/search/posts?query=${encodeURIComponent(searchQueryForApi)}&has_media=true${fromUsername ? `&username=${fromUsername}` : ''}`"
                class="min-h-[650px] w-full"
            />

            <div v-if="!searchQuery" class="px-4 py-8 text-center text-secondary">
                No results for {{ searchQuery }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'
import SearchBar from './SearchBar.vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
import { UserList } from '~/modules/Common/components/UserList'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'
import FollowListUserCard from '~/modules/Common/components/UserCard/UserCard.vue'
import type { FollowUser } from '~/modules/profile/types/user'
import MediaGrid from '~/modules/Common/components/MediaGrid/MediaGrid.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const searchQuery = computed(() => (route.query.q as string) || '')

// if the query contains the format "from:username ", extract username and add it to the fetching sources.
const fromUsername = computed(() => {
    const match = searchQuery.value.match(/^from:(\S+)\s/)
    return match ? match[1] : null
})

// remove it from the query that is used for searching
const searchQueryForApi = computed(() => {
    let query = searchQuery.value
    if (fromUsername.value) {
        query = query.replace(/^from:\S+\s/, '')
    }
    return query
})
console.log(`/search/posts?query=${encodeURIComponent(searchQueryForApi.value)}${fromUsername ? `&username=${fromUsername}` : ''}`)

const currentTab = computed(() => {
    const filter = route.query.f as string
    if (filter === 'user') return 'people'
    if (filter === 'live') return 'latest'
    if (filter === 'media') return 'media'
    return 'top'
})

const tabsConfig = computed(() => [
    { label: t('search.tabs.top'), value: 'top', test_id: 'tab-top' },
    { label: t('search.tabs.latest'), value: 'latest', test_id: 'tab-latest' },
    { label: t('search.tabs.people'), value: 'people', test_id: 'tab-people' },
    { label: t('search.tabs.media'), value: 'media', test_id: 'tab-media' },
])

const handleTabChange = (tab: string) => {
    const query: Record<string, string> = {
        q: searchQuery.value,
        src: (route.query.src as string) || 'typed_query',
    }

    if (tab === 'people') {
        query.f = 'user'
    } else if (tab === 'latest') {
        query.f = 'live'
    } else if (tab === 'media') {
        query.f = 'media'
    }

    router.push({
        path: '/search',
        query,
    })
}
</script>

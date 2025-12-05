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
                :fetchingSource="`/search/posts?query=${encodeURIComponent(searchQuery)}`"
                class="min-h-[650px] w-full"
            />

            <TweetsList
                v-if="currentTab === 'latest' && searchQuery"
                :fetchingSource="`/search/posts/latest?query=${encodeURIComponent(searchQuery)}`"
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

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const searchQuery = computed(() => (route.query.q as string) || '')

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

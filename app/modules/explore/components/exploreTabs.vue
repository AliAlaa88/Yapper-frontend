<template>
    <div class="sticky top-0 bg-primary/95 backdrop-blur-sm overflow-hidden">
        <div class="p-4">
            <SearchBar :has-arrow="true" />
        </div>
        <tabsComponent :tabs="tabs" :active-tab="selectedTab" :on-change="onTabsChange" />
    </div>
</template>

<script lang="ts" setup>
import { tabs } from '../constants'
import tabsComponent from '../../Common/components/Tabs'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SearchBar from '~/modules/search/components/SearchBar.vue'
const router = useRouter()
const route = useRoute()
const selectedTab = computed(() => {
    const pathSegments = route.path.split('/')
    const tabSegment = pathSegments[pathSegments.length - 1]

    const matchingTab = tabs.find((tab) => tab.value === tabSegment)
    return matchingTab?.value || 'for_you'
})
const onTabsChange = (newTab: string) => {
    router.push(`/explore/tabs/${newTab}`)
}
</script>

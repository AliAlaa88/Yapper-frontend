<template>
    <div class="sticky top-0 bg-primary/95 backdrop-blur-sm z-10">
        <div class="p-4 flex items-center w-full">
            <button
                id="btn-back-search-mobile"
                type="button"
                class="md:hidden flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover transition-colors shrink-0 cursor-pointer"
                :aria-label="$t('navigation.back')"
                @click="router.back()"
            >
                <ArrowLeft :size="20" class="text-primary" />
            </button>
            <SearchBar :has-arrow="true" />
        </div>
        <div class="overflow-hidden">
            <tabsComponent
                :tabs="translatedTabs"
                :active-tab="selectedTab"
                :on-change="onTabsChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { tabs } from '../constants'
import tabsComponent from '../../Common/components/Tabs'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SearchBar from '~/modules/search/components/SearchBar.vue'
import { ArrowLeft } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const translatedTabs = computed(() =>
    tabs.map((tab) => ({
        ...tab,
        label: t(tab.translationKey),
    })),
)

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

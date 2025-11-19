<template>
    <div class="bg-primary">
        <div class="sticky top-0 z-10 bg-primary/80 backdrop-blur-md">
            <div class="flex items-center gap-8 px-4 py-3">
                <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover"
                    :aria-label="$t('navigation.back')"
                    @click="router.back()"
                >
                    <ArrowLeft :size="20" class="text-primary" />
                </button>
                <div class="flex flex-col">
                    <h2 class="text-xl font-bold text-primary">
                        {{ profile?.name }}
                    </h2>
                    <p class="text-[13px] text-muted">
                        @{{ profile?.username }}
                    </p>
                </div>
            </div>
            <Tabs :tabs="tabsConfig" :active-tab="currentTab" :on-change="handleTabChange" />
        </div>


        <div class="min-h-[100vh]">
            <div v-if="currentTab === 'followers'" class="bg-primary">
                <EmptyState
                    icon="👥"
                    :title="$t('profile.followLists.emptyState.noFollowers.title')"
                    :description="$t('profile.followLists.emptyState.noFollowers.description')"
                />
            </div>

            <div v-else-if="currentTab === 'following'" class="bg-primary">
                <EmptyState
                    icon="👤"
                    :title="$t('profile.followLists.emptyState.noFollowing.title')"
                    :description="$t('profile.followLists.emptyState.noFollowing.description')"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'
import { useProfileStore } from '../../stores/profileStore'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const currentTab = computed(() => {
    const path = route.path
    if (path.endsWith('/following')) return 'following'
    return 'followers'
})

const tabsConfig = computed(() => [
    { label: t('profile.followers'), value: 'followers', test_id: 'tab-followers' },
    { label: t('profile.following'), value: 'following', test_id: 'tab-following' },
])

const handleTabChange = (tab: string) => {
    const username = route.params.username as string
    const newPath = `/${username}/${tab}`
    router.push(newPath)
}
</script>

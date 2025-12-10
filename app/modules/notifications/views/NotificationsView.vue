<template>
    <div class="flex flex-col w-full min-h-screen">
        <h2 class="text-lg font-bold text-primary px-4 py-3">Notifications</h2>
        <Tabs :tabs="tabs" :active-tab="activeTab" @change="handleChange" />
        <div
            v-if="activeTab === 'mentions' ? isLoadingMentions : isLoadingNotifications"
            class="flex justify-center mt-9">
            <LoadingSpinner />
        </div>
        <div
            v-if="activeTab === 'mentions'
                ? isSuccessfullyMentions && mentions.length > 0
                : isSuccessfullyNotifications && notifications.length > 0">
            <NotificationsList
                :notifications="listData.value"
                :is-fetching-next-page="activeTab === 'all' ? isFetchingNextNotifications : isFetchingNextMentions"
                :has-next-page="activeTab === 'all' ? hasNextNotifications : hasNextMentions"
                :fetch-next-page="activeTab === 'all' ? fetchNextNotifications : fetchNextMentions"
            />
        </div>
        <div
            v-else-if="activeTab === 'mentions'
                ? isSuccessfullyMentions && mentions.length === 0
                : isSuccessfullyNotifications && notifications.length === 0"
            class="flex justify-center items-center flex-col space-y-2 mt-9">
            <h1 class="font-bold text-3xl text-primary">Nothing to see here - yet</h1>
            <p v-if="activeTab === 'mentions'" class="text-muted text-sm">When someone mentions you, you'll find it
                here.</p>
            <p v-else class="text-muted text-sm">When someone interacts with your posts, you'll see it here.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import Tabs from '~/modules/Common/components/Tabs'
import { onMounted, computed } from 'vue'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import NotificationsList from '~/modules/notifications/components/NotificationsList.vue'
import { useGetNotificationsQuery } from '../queries/useGetNotificationsQuery'
import { useGetMentionsQuery } from '../queries/useGetMentionsQuery'

const { $notificationsSocketService } = useNuxtApp()
const activeTab = ref('all')

const listData = computed(() => activeTab.value === 'all' ? notifications : mentions)

const {
    notifications,
    isLoadingNotifications,
    isSuccessfullyNotifications,
    hasNextNotifications,
    isFetchingNextNotifications,
    fetchNextNotifications,
} = useGetNotificationsQuery()

const {
    mentions,
    isLoadingMentions,
    isSuccessfullyMentions,
    hasNextMentions,
    isFetchingNextMentions,
    fetchNextMentions,
} = useGetMentionsQuery()

console.log('list data', listData)

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
    if (!userStore.isLoggedIn) {
        router.push('/auth')
    }
    $notificationsSocketService.markNotificationsAsSeen()
})

watch(activeTab, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

const tabs = computed(() => [
    {
        label: 'All',
        value: 'all',
        test_id: 'all-notifications-tab',
    },
    {
        label: 'Mentions',
        value: 'mentions',
        test_id: 'mentions-notifications-tab',
    },
])


function handleChange(tab: string) {
    activeTab.value = tab
}
</script>


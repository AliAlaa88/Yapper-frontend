<template>
    <div class="bg-primary">
        <Tabs
            v-if="!isBlocked"
            :tabs="tabsConfig"
            :active-tab="currentTab"
            :on-change="handleTabChange"
        />
        <div
            v-if="!isBlocked && currentTab === 'likes' && isMyProfile"
            class="mx-4 my-3 flex items-center gap-3 rounded-lg bg-blue-500/10 px-4 py-3"
        >
            <Lock :size="20" class="flex-shrink-0 text-blue-500" />
            <span class="text-sm text-blue-500">
                {{ t('profile.privacy.likesPrivate') }}
            </span>
        </div>
        <TweetsList
            v-if="
                !isBlocked &&
                userId &&
                ((currentTab === 'likes' && isMyProfile) ||
                    currentTab === 'posts' ||
                    currentTab === 'replies')
            "
            :fetchingSource="`${currentTab === 'posts' || currentTab === 'replies' ? `/users/${userId}/${currentTab}` : `/users/me/liked-posts`}`"
            class="min-h-[650px] w-full"
            :compact="currentTab === 'likes'"
        />
        <MediaGrid
            v-if="!isBlocked && userId && currentTab === 'media'"
            :fetching-source="`/users/${userId}/media`"
            class="min-h-[650px] w-full"
        />
        <ProfileBlockedContent v-if="isBlocked" :username="username" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Lock } from 'lucide-vue-next'

import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'

import { useUserInfo } from '~/modules/profile/composables/useUserInfo'
import { useProfileStore } from '../../stores/profileStore'
import ProfileBlockedContent from './SubComponents/ProfileBlockedContent.vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
import MediaGrid from '~/modules/Common/components/MediaGrid/MediaGrid.vue'
import { storeToRefs } from 'pinia'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const profileStore = useProfileStore()
const { profile, isMyProfile } = storeToRefs(profileStore)
const userId = computed(() => profile.value?.user_id ?? '')
const { isBlocked, username } = useUserInfo(userId)

const currentTab = computed(() => {
    const path = route.path
    if (path.endsWith('/replies')) return 'replies'
    if (path.endsWith('/media')) return 'media'
    if (path.endsWith('/likes')) return 'likes'
    return 'posts'
})

const tabsConfig = computed(() => {
    const tabs = [
        { label: t('profile.tabs.posts'), value: 'posts', test_id: 'tab-posts' },
        { label: t('profile.tabs.replies'), value: 'replies', test_id: 'tab-replies' },
        { label: t('profile.tabs.media'), value: 'media', test_id: 'tab-media' },
    ]

    if (isMyProfile.value) {
        tabs.push({ label: t('profile.tabs.likes'), value: 'likes', test_id: 'tab-likes' })
    }

    return tabs
})

const handleTabChange = (tab: string) => {
    const segments = route.path.split('/').filter(Boolean)
    let basePath = ''

    if (segments.length > 1) {
        basePath = `/${segments.slice(0, 1).join('/')}`
    } else {
        basePath = '/' + segments[0]
    }

    if (tab !== 'posts') {
        const newPath = `${basePath}/${tab}`
        router.push(newPath)
    } else {
        router.push(basePath)
    }
}
</script>

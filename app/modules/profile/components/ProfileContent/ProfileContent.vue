<template>
    <div class="bg-primary">
        <Tabs
            v-if="!isBlocked"
            :tabs="tabsConfig"
            :active-tab="currentTab"
            :on-change="handleTabChange"
        />

        <div v-if="!isBlocked" class="min-h-[650px]">
            <div v-if="currentTab === 'posts'" class="bg-primary">
                <EmptyState
                    icon="📝"
                    :title="t('profile.emptyState.noPosts.title')"
                    :description="t('profile.emptyState.noPosts.description')"
                />
            </div>

            <div v-else-if="currentTab === 'replies'" class="bg-primary">
                <EmptyState
                    icon="💬"
                    :title="t('profile.emptyState.noReplies.title')"
                    :description="t('profile.emptyState.noReplies.description')"
                />
            </div>

            <div v-else-if="currentTab === 'media'" class="bg-primary">
                <EmptyState
                    icon="📷"
                    :title="t('profile.emptyState.noMedia.title')"
                    :description="t('profile.emptyState.noMedia.description')"
                />
            </div>

            <div v-else-if="currentTab === 'likes' && isMyProfile" class="bg-primary">
                <EmptyState
                    icon="❤️"
                    :title="t('profile.emptyState.noLikes.title')"
                    :description="t('profile.emptyState.noLikes.description')"
                />
            </div>
        </div>
        <ProfileBlockedContent v-if="isBlocked" :username="username" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'

import { useUserInfo } from '~/modules/profile/composables/useUserInfo'
import { useProfileStore } from '../../stores/profileStore'
import EmptyState from './SubComponents/EmptyState.vue'
import ProfileBlockedContent from './SubComponents/ProfileBlockedContent.vue'

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

    if (segments.length > 2) {
        basePath = `/${segments.slice(0, 2).join('/')}`
    } else {
        basePath = '/' + segments[0] + '/' + segments[1]
    }

    if (tab !== 'posts') {
        const newPath = `${basePath}/${tab}`
        router.push(newPath)
    } else {
        router.push(basePath)
    }
}
</script>

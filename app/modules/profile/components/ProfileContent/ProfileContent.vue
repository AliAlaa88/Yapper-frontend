<template>
    <div class="bg-primary">
        <!-- Tabs Navigation -->
        <Tabs
            v-if="!isBlocked"
            :tabs="tabsConfig"
            :active-tab="currentTab"
            :on-change="handleTabChange"
        />

        <!-- Content Area - switches based on route -->
        <div v-if="!isBlocked" class="min-h-[650px]">
            <!-- Posts Tab (default route) -->
            <div v-if="currentTab === 'posts'" class="bg-primary">
                <EmptyState
                    icon="📝"
                    :title="t('profile.emptyState.noPosts.title')"
                    :description="t('profile.emptyState.noPosts.description')"
                />
            </div>

            <!-- Replies Tab -->
            <div v-else-if="currentTab === 'replies'" class="bg-primary">
                <EmptyState
                    icon="💬"
                    :title="t('profile.emptyState.noReplies.title')"
                    :description="t('profile.emptyState.noReplies.description')"
                />
            </div>

            <!-- Media Tab -->
            <div v-else-if="currentTab === 'media'" class="bg-primary">
                <EmptyState
                    icon="📷"
                    :title="t('profile.emptyState.noMedia.title')"
                    :description="t('profile.emptyState.noMedia.description')"
                />
            </div>

            <!-- Likes Tab -->
            <div v-else-if="currentTab === 'likes'" class="bg-primary">
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
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'
import EmptyState from './SubComponents/EmptyState.vue'
import ProfileBlockedContent from './SubComponents/ProfileBlockedContent.vue'
import { useUserInfo } from '~/modules/profile/composables/useUserInfo'

const route = useRoute()
const router = useRouter()
const userId = inject<Ref<string>>('user-id')!
const { isBlocked, username } = useUserInfo(userId)

// Determine current tab based on route path
const currentTab = computed(() => {
    const path = route.path
    if (path.endsWith('/replies')) return 'replies'
    if (path.endsWith('/media')) return 'media'
    if (path.endsWith('/likes')) return 'likes'
    return 'posts' // default
})

const { t } = useI18n()

const tabsConfig = computed(() => [
    { label: t('profile.tabs.posts'), value: 'posts', test_id: 'tab-posts' },
    { label: t('profile.tabs.replies'), value: 'replies', test_id: 'tab-replies' },
    { label: t('profile.tabs.media'), value: 'media', test_id: 'tab-media' },
    { label: t('profile.tabs.likes'), value: 'likes', test_id: 'tab-likes' },
])

const handleTabChange = (tab: string) => {
    // Split current path
    const segments = route.path.split('/').filter(Boolean)
    let basePath = ''

    if (segments.length > 2) {
        basePath = `/${segments.slice(0, 2).join('/')}`
    } else {
        basePath = '/' + segments[0] + '/' + segments[1]
    }

    if (tab !== 'posts') {
        // Build new path with tab
        const newPath = `${basePath}/${tab}`

        router.push(newPath)
    } else {
        router.push(basePath)
    }
}
</script>

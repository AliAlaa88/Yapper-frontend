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
                    title="No posts yet"
                    description="When this user posts, they'll show up here."
                />
            </div>

            <!-- Replies Tab -->
            <div v-else-if="currentTab === 'replies'" class="bg-primary">
                <EmptyState
                    icon="💬"
                    title="No replies yet"
                    description="When this user replies to posts, they'll show up here."
                />
            </div>

            <!-- Media Tab -->
            <div v-else-if="currentTab === 'media'" class="bg-primary">
                <EmptyState
                    icon="📷"
                    title="No media yet"
                    description="Photos and videos will appear here."
                />
            </div>

            <!-- Likes Tab -->
            <div v-else-if="currentTab === 'likes'" class="bg-primary">
                <EmptyState
                    icon="❤️"
                    title="No likes yet"
                    description="When this user likes posts, they'll show up here."
                />
            </div>
        </div>
        <ProfileBlockedContent v-if="isBlocked" :username="username" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

const tabsConfig = [
    { label: 'Posts', value: 'posts', test_id: 'tab-posts' },
    { label: 'Replies', value: 'replies', test_id: 'tab-replies' },
    { label: 'Media', value: 'media', test_id: 'tab-media' },
    { label: 'Likes', value: 'likes', test_id: 'tab-likes' },
]

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

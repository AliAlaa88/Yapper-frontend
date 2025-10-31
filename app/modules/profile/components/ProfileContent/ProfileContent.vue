<template>
    <div class="bg-black">
        <!-- Tabs Navigation -->
        <ProfileTabs
            v-if="!isBlocked"
            :tabs="tabs" />

        <!-- Content Area - switches based on route -->
        <div
            v-if="!isBlocked"
            class="min-h-[650px]">
            <!-- Posts Tab (default route) -->
            <div v-if="currentTab === 'posts'" class="bg-black">
                <EmptyState
                    icon="📝"
                    title="No posts yet"
                    description="When this user posts, they'll show up here."
                />
            </div>

            <!-- Replies Tab -->
            <div v-else-if="currentTab === 'replies'" class="bg-black">
                <EmptyState
                    icon="💬"
                    title="No replies yet"
                    description="When this user replies to posts, they'll show up here."
                />
            </div>

            <!-- Media Tab -->
            <div v-else-if="currentTab === 'media'" class="bg-black">
                <EmptyState
                    icon="📷"
                    title="No media yet"
                    description="Photos and videos will appear here."
                />
            </div>

            <!-- Likes Tab -->
            <div v-else-if="currentTab === 'likes'" class="bg-black">
                <EmptyState
                    icon="❤️"
                    title="No likes yet"
                    description="When this user likes posts, they'll show up here."
                />
            </div>
        </div>
        <ProfileBlockedContent
            v-if="isBlocked"
            :username="username"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfileTabs from './SubComponents/ProfileTabs.vue'
import EmptyState from './SubComponents/EmptyState.vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
import ProfileBlockedContent from './SubComponents/ProfileBlockedContent.vue'
import { useUserInfo } from '~/modules/profile/composables/useUserInfo'


const route = useRoute()
const userId = inject<Ref<string>>('user-id')!
const {
    isBlocked,
    username,
} = useUserInfo(userId)

// Determine current tab based on route path
const currentTab = computed(() => {
    const path = route.path
    if (path.endsWith('/replies')) return 'replies'
    if (path.endsWith('/media')) return 'media'
    if (path.endsWith('/likes')) return 'likes'
    return 'posts' // default
})

const tabs = [
    { id: 'posts', label: 'Posts', to: '' },
    { id: 'replies', label: 'Replies', to: 'replies' },
    { id: 'media', label: 'Media', to: 'media' },
    { id: 'likes', label: 'Likes', to: 'likes' },
]
</script>

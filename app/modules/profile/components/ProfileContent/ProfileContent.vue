<template>
    <div class="bg-black">
        <!-- Tabs Navigation -->
        <ProfileTabs :tabs="tabs" />

        <!-- Content Area - switches based on route -->
        <div class="min-h-[400px]">
            <!-- Posts Tab (default route) -->
            <div v-if="currentTab === 'posts'" class="bg-black">
                <TweetsList :fetchingSource="'user'" />
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
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfileTabs from './SubComponents/ProfileTabs.vue'
import EmptyState from './SubComponents/EmptyState.vue'

const route = useRoute()

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

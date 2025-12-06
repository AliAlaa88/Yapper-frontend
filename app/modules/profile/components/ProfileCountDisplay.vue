<template>
    <span class="text-sm text-secondary">
        {{ selectedCountLabel }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profileStore'

const { t } = useI18n()
const route = useRoute()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const currentTab = computed(() => {
    const path = route.path
    if (path.endsWith('/replies')) return 'replies'
    if (path.endsWith('/media')) return 'media'
    if (path.endsWith('/likes')) return 'likes'
    return 'posts'
})

const selectedCount = computed(() => {
    const p = profile.value as any
    switch (currentTab.value) {
        case 'posts':
            return p?.num_posts ?? 0
        case 'replies':
            return p?.num_replies ?? 0
        case 'media':
            return p?.num_media ?? 0
        case 'likes':
            return p?.num_likes ?? 0
        default:
            return 0
    }
})

const selectedCountLabel = computed(() => {
    switch (currentTab.value) {
        case 'posts':
            return t('profile.counts.posts', { count: selectedCount.value })
        case 'replies':
            return t('profile.counts.replies', { count: selectedCount.value })
        case 'media':
            return t('profile.counts.media', { count: selectedCount.value })
        case 'likes':
            return t('profile.counts.likes', { count: selectedCount.value })
        default:
            return ''
    }
})
</script>

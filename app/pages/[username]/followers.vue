<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <FollowLists />
</template>

<script setup lang="ts">
import FollowLists from '../../modules/profile/components/FollowLists/FollowLists.vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()
const route = useRoute()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

// Set initial SEO with username from route
const username = route.params.username as string
useSeo({
    title: `People following @${username} / Yapper`,
    description: t('seo.default.description'),
    keywords: t('seo.default.keywords'),
})

// Update SEO when profile data loads
watch(
    profile,
    (newProfile) => {
        if (newProfile) {
            useSeo({
                title: t('seo.followers.title', { name: newProfile.name, username: newProfile.username }),
                description: t('seo.followers.description', { name: newProfile.name }),
                keywords: t('seo.followers.keywords', { username: newProfile.username }),
            })
        }
    },
    { immediate: true }
)

definePageMeta({
    middleware: ['auth'],
})
</script>

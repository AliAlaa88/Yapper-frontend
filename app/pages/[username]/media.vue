<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <ProfileContent />
</template>

<script setup lang="ts">
import ProfileContent from '../../modules/profile/components/ProfileContent/ProfileContent.vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()
const route = useRoute()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

// Set initial SEO with username from route
const username = route.params.username as string
useSeo({
    title: `Media posts by @${username} / Yapper`,
    description: t('seo.default.description'),
    keywords: t('seo.default.keywords'),
})

// Update SEO when profile data loads
watch(
    profile,
    (newProfile) => {
        if (newProfile) {
            useSeo({
                title: t('seo.media.title', { name: newProfile.name, username: newProfile.username }),
                description: t('seo.media.description', { name: newProfile.name, username: newProfile.username }),
                keywords: t('seo.media.keywords', { username: newProfile.username }),
            })
        }
    },
    { immediate: true }
)

definePageMeta({
    layout: 'profile',
    middleware: ['auth'],
})
</script>

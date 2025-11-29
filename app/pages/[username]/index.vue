<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <ProfileContent />
</template>

<script setup lang="ts">
import ProfileContent from '../../modules/profile/components/ProfileContent/ProfileContent.vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useSeo, useProfileSeo } from '~/modules/Common/composables/useSeo'

const { t } = useI18n()
const route = useRoute()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

// Set initial SEO with username from route
const username = route.params.username as string
useSeo({
    title: `@${username} / Yapper`,
    description: t('seo.default.description'),
    keywords: t('seo.default.keywords'),
})

// Update SEO when profile data loads
watch(
    profile,
    (newProfile) => {
        if (newProfile) {
            useProfileSeo({
                name: newProfile.name,
                username: newProfile.username,
                bio: newProfile.bio,
                profile_image: newProfile.profile_image,
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

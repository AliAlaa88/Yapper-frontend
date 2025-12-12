<template>
    <div class="bg-primary">
        <div class="sticky top-0 z-10 bg-primary/80 backdrop-blur-md">
            <div class="flex items-center gap-8 px-4 py-3">
                <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover"
                    :aria-label="$t('navigation.back')"
                    @click="router.back()"
                >
                    <ArrowLeft :size="20" class="text-primary" />
                </button>
                <div class="flex flex-col">
                    <h2 class="text-xl font-bold text-primary">
                        {{ profile?.name }}
                    </h2>
                    <p class="text-[13px] text-muted">@{{ profile?.username }}</p>
                </div>
            </div>
            <Tabs :tabs="tabsConfig" :active-tab="currentTab" :on-change="handleTabChange" />
        </div>

        <div class="min-h-screen">
            <FollowersList v-if="currentTab === 'followers' && profile" />
            <FollowingList v-else-if="currentTab === 'following' && profile" />
            <MutualFollowersList v-else-if="currentTab === 'followers_you_follow' && profile" />
        </div>

        <SnackBar />
        <ConfirmtionModal />
    </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

import Tabs from '~/modules/Common/components/Tabs/Tabs.vue'
import FollowersList from './SubComponents/FollowersList.vue'
import FollowingList from './SubComponents/FollowingList.vue'
import MutualFollowersList from './SubComponents/MutualFollowersList.vue'
import SnackBar from '~/modules/profile/components/ProfileContent/SubComponents/SnackBar.vue'
import ConfirmtionModal from '~/modules/profile/components/ProfileHeader/SubComponents/ConfirmtionModal.vue'
import { useProfile } from '~/modules/profile/composables/useProfile'
import { useProfileProviders } from '~/modules/profile/composables/useProfileProviders'
import { useProfileStore } from '~/modules/profile/stores/profileStore'

useProfileProviders()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const username = computed(() => route.params.username as string)

useProfile(username.value)

const profileStore = useProfileStore()
const { profile, isMyProfile } = storeToRefs(profileStore)
const config = useRuntimeConfig()
if (config.public.env === 'development')
    console.log('isMyProfile:', isMyProfile.value, profile.value)
const currentTab = computed(() => {
    const path = route.path
    if (path.endsWith('/following')) return 'following'
    if (path.endsWith('/followers_you_follow')) return 'followers_you_follow'
    return 'followers'
})

const tabsConfig = computed(() => {
    const tabs = [
        { label: t('profile.followers'), value: 'followers', test_id: 'tab-followers' },
        { label: t('profile.following'), value: 'following', test_id: 'tab-following' },
    ]

    if (!isMyProfile.value) {
        tabs.push({
            label: t('profile.followersYouFollow'),
            value: 'followers_you_follow',
            test_id: 'tab-followers-you-follow',
        })
    }

    return tabs
})

const handleTabChange = (tab: string) => {
    const username = route.params.username as string
    const newPath = `/${username}/${tab}`
    router.push(newPath)
}
</script>

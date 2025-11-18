<template>
    <div class="pb-4">
        <div class="flex flex-col">
            <h1 class="text-xl font-bold text-primary">
                {{ displayName }}
            </h1>
            <p class="text-sm text-secondary">@{{ username }}</p>
        </div>

        <p v-if="bio" class="mt-3 text-[15px] text-primary whitespace-pre-wrap break-words">
            {{ bio }}
        </p>

        <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-secondary">
            <div v-if="location" class="flex items-center gap-1">
                <MapPin :size="18" />
                <span>{{ location }}</span>
            </div>
            <div class="flex items-center gap-1">
                <Calendar :size="18" />
                <span>{{ formattedDate }}</span>
            </div>
        </div>

        <div class="mt-3 flex gap-5 text-sm">
            <NuxtLink
                :to="`/profile/${username}/following`"
                class="hover:underline"
            >
                <span class="font-bold text-primary">{{ followingCount }}</span>
                <span class="text-secondary ml-1">{{ t('profile.following') }}</span>
            </NuxtLink>
            <NuxtLink
                :to="`/profile/${username}/followers`"
                class="hover:underline"
            >
                <span class="font-bold text-primary">{{ followersCount }}</span>
                <span class="text-secondary ml-1">{{ t('profile.followers') }}</span>
            </NuxtLink>
        </div>

        <div
            v-if="!isMyProfile && mutualFollowersCount > 0"
            class="mt-3 flex items-center gap-2 text-sm text-secondary"
        >
            <div class="flex -space-x-2">
                <img
                    v-for="follower in topMutualFollowers.slice(0, 3)"
                    :key="follower.avatar_url"
                    :src="follower.avatar_url"
                    :alt="follower.name"
                    class="h-6 w-6 rounded-full border-2 border-primary"
                >
            </div>
            <span>
                {{ t('profile.mutualFollowers.followedBy') }}
                <span class="font-semibold text-primary">
                    {{ formatMutualFollowers }}
                </span>
            </span>
        </div>

        <ProfileMuteMessage />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MapPin, Calendar } from 'lucide-vue-next'
import { useProfileStore } from '../../../stores/profileStore'
import { storeToRefs } from 'pinia'
import type { OtherUser } from '../../../types/user'
import ProfileMuteMessage from './ProfileMuteMessage.vue'

const { t } = useI18n()
const profileStore = useProfileStore()
const { profile, isMyProfile } = storeToRefs(profileStore)

const displayName = computed(() => profile.value?.name ?? '')
const username = computed(() => profile.value?.username ?? '')
const bio = computed(() => profile.value?.bio ?? '')
const location = computed(() => profile.value?.country ?? null)
const followingCount = computed(() => profile.value?.following_count ?? 0)
const followersCount = computed(() => profile.value?.followers_count ?? 0)
const mutualFollowersCount = computed(() => {
    const count = (profile.value as OtherUser)?.mutual_followers_count
    return count ? Number(count) : 0
})

const topMutualFollowers = computed(
    () => (profile.value as OtherUser)?.top_mutual_followers ?? [],
)

const formattedDate = computed(() => {
    if (!profile.value?.created_at) return ''
    const date = new Date(profile.value.created_at)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
})

const formatMutualFollowers = computed(() => {
    const count = mutualFollowersCount.value
    const followers = topMutualFollowers.value

    if (count === 0 || followers.length === 0) return ''

    if (count === 1 && followers[0]) {
        return followers[0].name
    }

    if (count === 2 && followers[0] && followers[1]) {
        return `${followers[0].name} ${t('profile.mutualFollowers.and')} ${followers[1].name}`
    }

    if (followers[0]) {
        const othersCount = count - 1
        return `${followers[0].name} ${t('profile.mutualFollowers.and')} ${othersCount} ${t('profile.mutualFollowers.others')}`
    }

    return ''
})
</script>

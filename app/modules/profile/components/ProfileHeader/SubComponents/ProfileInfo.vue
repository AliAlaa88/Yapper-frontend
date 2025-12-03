<template>
    <div class="pb-4">
        <div class="flex flex-col">
            <h1 class="text-xl font-bold text-primary">
                {{ user?.name }}
            </h1>
            <p class="text-sm text-secondary">@{{ user?.username }}</p>
        </div>

        <p v-if="user?.bio" class="mt-3 text-[15px] text-primary whitespace-pre-wrap break-words">
            {{ user.bio }}
        </p>

        <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-primary">
            <div v-if="user?.country" class="flex items-center gap-1">
                <MapPin :size="18" />
                <span>{{ user.country }}</span>
            </div>
            <div v-if="formattedBirthDate" class="flex items-center gap-1">
                <Cake :size="18" />
                <span>{{ t('profile.born') }} {{ formattedBirthDate }}</span>
            </div>
            <div class="flex items-center gap-1">
                <Calendar :size="18" />
                <span>{{ t('profile.joined') }} {{ formattedJoinedDate }}</span>
            </div>
        </div>

        <div class="mt-3 flex gap-5 text-sm">
            <NuxtLink
                :to="`/${user?.username}/following`"
                class="hover:underline flex gap-1 items-center"
            >
                <span class="font-bold text-primary" dir="ltr">{{ formatNumber(user?.following_count ?? 0) }}</span>
                <span class="text-secondary">{{ t('profile.following') }}</span>
            </NuxtLink>
            <NuxtLink
                :to="`/${user?.username}/followers`"
                class="hover:underline flex gap-1 items-center"
            >
                <span class="font-bold text-primary" dir="ltr">{{ formatNumber(user?.followers_count ?? 0) }}</span>
                <span class="text-secondary">{{ t('profile.followers') }}</span>
            </NuxtLink>
        </div>

        <div
            v-if="!isMyProfile && mutualFollowersCount > 0"
            class="mt-3 flex items-center gap-2 text-sm text-secondary"
        >
            <div class="flex -space-x-2 rtl:space-x-reverse">
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
import { MapPin, Calendar, Cake } from 'lucide-vue-next'
import type { Me, OtherUser } from '../../../types/user'
import ProfileMuteMessage from './ProfileMuteMessage.vue'

const props = defineProps<{
    user: Me | OtherUser | null
    isMyProfile: boolean
}>()

const { t, locale } = useI18n()

const formatNumber = (num: number) => {
    return num.toLocaleString(locale.value === 'ar' ? 'ar-EG' : 'en-US', { useGrouping: false })
}

const mutualFollowersCount = computed(() => {
    const count = (props.user as OtherUser)?.mutual_followers_count
    return count ? Number(count) : 0
})

const topMutualFollowers = computed(
    () => (props.user as OtherUser)?.top_mutual_followers ?? [],
)

const monthNames = computed(() => [
    t('months.january'),
    t('months.february'),
    t('months.march'),
    t('months.april'),
    t('months.may'),
    t('months.june'),
    t('months.july'),
    t('months.august'),
    t('months.september'),
    t('months.october'),
    t('months.november'),
    t('months.december'),
])

const formattedJoinedDate = computed(() => {
    if (!props.user?.created_at) return ''
    const date = new Date(props.user.created_at)
    const month = monthNames.value[date.getMonth()]
    const year = formatNumber(date.getFullYear())
    return `${month} ${year}`
})

const formattedBirthDate = computed(() => {
    if (!props.user?.birth_date) return ''
    const date = new Date(props.user.birth_date)
    const month = monthNames.value[date.getMonth()]
    const day = formatNumber(date.getDate())
    const year = formatNumber(date.getFullYear())
    return `${month} ${day}, ${year}`
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

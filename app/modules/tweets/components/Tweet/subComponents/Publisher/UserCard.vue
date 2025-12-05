<template>
    <div class="w-[300px] p-4 space-y-3 bg-primary">
        <!-- Header with avatar and follow button -->
        <div class="flex items-start justify-between">
            <NuxtLink :id="`user-card-avatar-link-${id}`" :to="profileLink">
                <img
                    v-if="!isLoading"
                    :id="`user-card-avatar-${id}`"
                    :src="avatarSrc"
                    :alt="name"
                    class="w-16 h-16 rounded-full hover:opacity-90 transition-opacity"
                    @error="(event) => handleImageError(name, event)"
                />
                <div v-else class="w-16 h-16 rounded-full bg-hover animate-pulse" />
            </NuxtLink>
            <ProfileFollowAction :userId="id" :username="username" />
        </div>

        <!-- Name and Username -->
        <div>
            <NuxtLink
                :id="`user-card-name-link-${id}`"
                :to="profileLink"
                class="font-bold text-primary hover:underline text-base leading-5 block"
            >
                {{ name }}
            </NuxtLink>
            <span class="text-secondary text-sm">@{{ username }}</span>
        </div>

        <!-- Bio (if available) -->
        <p v-if="bio" class="text-primary text-sm leading-5">
            {{ bio }}
        </p>

        <!-- Follower stats -->
        <div class="flex gap-4 text-sm">
            <div>
                <span class="font-bold text-primary">{{ formatNumber(followingCount) }}</span>
                <span class="text-secondary ml-1">Following</span>
            </div>
            <div>
                <span class="font-bold text-primary">{{ formatNumber(followersCount) }}</span>
                <span class="text-secondary ml-1">Followers</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, onBeforeMount } from 'vue'
import { getProfileUrl } from '../../../../utils/navigation'
import { handleImageError } from '~/utils/helpers'
import { useUserActionsQuery } from '~/modules/profile/queries/useUserActionsQuery'
import ProfileFollowAction from '~/modules/profile/components/ProfileHeader/SubComponents/ProfileFollowAction.vue';
const props = defineProps<{
    id: string
    name: string
    username: string
    avatar: string
    bio: string | null
    followersCount: number | null
    followingCount: number | null
    is_following?: boolean
}>()

const avatarSrc = ref(props.avatar)
const isLoading = ref(true)

const { followMutation, unfollowMutation, userQuery } = useUserActionsQuery(toRef(props.id))

// Use the query data if available, otherwise use prop as fallback
const localeIsFollowing = computed(() => {
    if (userQuery.data.value?.is_following !== undefined) {
        return userQuery.data.value.is_following
    }
    return !!props.is_following
})

const profileLink = computed(() =>
    getProfileUrl({
        username: props.username,
        link: null,
    }),
)

const formatNumber = (num?: number | null): string => {
    if (!num && num !== 0) return '0'
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toString()
}

const handleFollowToggle = async () => {
    if (localeIsFollowing.value) {
        localeIsFollowing.value = false
        try {
            await unfollowMutation.mutateAsync()
        } catch {
            localeIsFollowing.value = true
        }
    } else {
        localeIsFollowing.value = true
        try {
            await followMutation.mutateAsync()
        } catch {
            localeIsFollowing.value = false
        }
    }
}

// Preload image before mount
onBeforeMount(() => {
    const img = new Image()
    img.onload = () => {
        avatarSrc.value = props.avatar
        isLoading.value = false
    }
    img.onerror = () => {
        avatarSrc.value = `https://ui-avatars.com/api/?name=${props.name}`
        isLoading.value = false
    }
    img.src = props.avatar
})
</script>

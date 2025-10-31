<template>
    <div class="w-[300px] p-4 space-y-3 bg-white dark:bg-[var(--color-x-bg-dark-secondary)]">
        <!-- Header with avatar and follow button -->
        <div class="flex items-start justify-between">
            <NuxtLink :id="`user-card-avatar-link-${id}`" :to="profileLink">
                <img :id="`user-card-avatar-${id}`" :src="avatar" :alt="name" class="w-16 h-16 rounded-full hover:opacity-90 transition-opacity" />
            </NuxtLink>
            <button 
                :id="`user-card-follow-button-${id}`"
                class="px-4 py-1.5 rounded-full font-bold text-sm bg-[var(--color-x-black)] dark:bg-white text-white dark:text-[var(--color-x-bg-dark)] hover:bg-[var(--color-x-dark)] dark:hover:bg-gray-200 transition-colors"
            >
                Follow
            </button>
        </div>

        <!-- Name and Username -->
        <div>
            <NuxtLink :id="`user-card-name-link-${id}`" :to="profileLink" class="font-bold text-[var(--color-x-black)] dark:text-[var(--color-x-text-dark)] hover:underline text-[17px] leading-5 block">
                {{ name }}
            </NuxtLink>
            <span class="text-[var(--color-x-gray-dark)] dark:text-[var(--color-x-text-dark-secondary)] text-[15px]">@{{ username }}</span>
        </div>

        <!-- Bio (if available) -->
        <p v-if="bio" class="text-[var(--color-x-black)] dark:text-[var(--color-x-text-dark)] text-[15px] leading-5">
            {{ bio }}
        </p>

        <!-- Follower stats -->
        <div class="flex gap-4 text-[14px]">
            <div>
                <span class="font-bold text-[var(--color-x-black)] dark:text-[var(--color-x-text-dark)]">{{ formatNumber(followingCount) }}</span>
                <span class="text-[var(--color-x-gray-dark)] dark:text-[var(--color-x-text-dark-secondary)] ml-1">Following</span>
            </div>
            <div>
                <span class="font-bold text-[var(--color-x-black)] dark:text-[var(--color-x-text-dark)]">{{ formatNumber(followersCount) }}</span>
                <span class="text-[var(--color-x-gray-dark)] dark:text-[var(--color-x-text-dark-secondary)] ml-1">Followers</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getProfileUrl } from '../../../../utils/navigation'

const props = defineProps<{
    id: string
    name: string
    username: string
    avatar: string
    bio?: string
    followersCount?: number
    followingCount?: number
}>()

const profileLink = computed(() => getProfileUrl({ 
    id: props.id, 
    username: props.username,
    name: props.name,
    avatar: props.avatar
}))

const formatNumber = (num?: number): string => {
    if (!num && num !== 0) return '0'
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toString()
}
</script>

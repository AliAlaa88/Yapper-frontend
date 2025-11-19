<template>
    <div class="w-[300px] p-4 space-y-3 bg-white">
        <!-- Header with avatar and follow button -->
        <div class="flex items-start justify-between">
            <NuxtLink :id="`user-card-avatar-link-${id}`" :to="profileLink">
                <img v-if="!isLoading" :id="`user-card-avatar-${id}`" :src="avatarSrc" :alt="name" class="w-16 h-16 rounded-full hover:opacity-90 transition-opacity"
                    @error="handleImageError"   
                />
                <div v-else class="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
            </NuxtLink>
            <button 
                :id="`user-card-follow-button-${id}`"
                class="px-4 py-1.5 rounded-full font-bold text-sm bg-alternate text-alternate hover:brightness-90 transition-all cursor-pointer"
            >
                Follow
            </button>
        </div>

        <!-- Name and Username -->
        <div>
            <NuxtLink :id="`user-card-name-link-${id}`" :to="profileLink" class="font-bold text-primary hover:underline text-base leading-5 block">
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
import { computed, ref } from 'vue'
import { getProfileUrl } from '../../../../utils/navigation'

const props = defineProps<{
    id: string
    name: string
    username: string
    avatar: string
    bio: string | null;
    followersCount: number | null;
    followingCount: number | null;
}>()

const profileLink = computed(() => getProfileUrl({ 
    id: props.id, 
    username: props.username,
    name: props.name,
    avatar: props.avatar
}))

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
</script>

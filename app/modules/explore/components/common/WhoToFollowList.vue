<template>
    <div class="w-full">
        <UserCard
            v-for="user in mappedUsers"
            :key="user.user_id"
            :user="user"
            :hide-bio="hideBio"
        />
    </div>
</template>

<script setup lang="ts">
import UserCard from '~/modules/Common/components/UserCard/UserCard.vue'
import type { FollowUser } from '~/modules/profile/types/user'

interface ApiUser {
    id: string
    user_id?: string
    username: string
    name: string
    bio?: string
    avatar_url: string
    verified?: boolean
    is_following?: boolean
    is_followed_by?: boolean
    is_follower?: boolean
    is_muted?: boolean
    is_blocked?: boolean
}

const props = defineProps<{
    users: ApiUser[]
    hideBio?: boolean | null
}>()

// Map API response to FollowUser interface expected by UserCard
const mappedUsers = computed<FollowUser[]>(() => {
    return props.users.map((user) => ({
        user_id: user.user_id || user.id,
        name: user.name,
        username: user.username,
        bio: user.bio || '',
        avatar_url: user.avatar_url,
        is_following: user.is_following || false,
        is_follower: user.is_follower ?? user.is_followed_by ?? false,
        is_muted: user.is_muted || false,
        is_blocked: user.is_blocked || false,
    }))
})
</script>

<template>
    <div class="border-b border-[#2f3336] bg-black">
        <!-- Cover Image -->
        <CoverImage :cover-url="user.coverUrl" />

        <!-- Profile Info -->
        <div class="px-4">
            <div class="-mt-[70px] mb-3 flex items-end justify-between">
                <!-- Avatar -->
                <ProfileAvatar :avatar-url="user.avatarUrl" :display-name="user.displayName" />

                <!-- Actions -->
                <ProfileActions />
            </div>

            <!-- User Details -->
            <div class="pb-4">
                <ProfileUserInfo
                    :display-name="user.displayName"
                    :username="user.username"
                    :verified="user.verified"
                />
                <ProfileBio :bio="user.bio" />
                <ProfileStats
                    :following-count="user.followingCount"
                    :followers-count="user.followersCount"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UserProfile } from '../../types/user'
import CoverImage from './SubComponents/CoverImage.vue'
import ProfileAvatar from './SubComponents/ProfileAvatar.vue'
import ProfileActions from './SubComponents/ProfileActions.vue'
import ProfileUserInfo from './SubComponents/ProfileUserInfo.vue'
import ProfileBio from './SubComponents/ProfileBio.vue'
import ProfileStats from './SubComponents/ProfileStats.vue'

defineProps<{
    user: UserProfile
}>()
</script>

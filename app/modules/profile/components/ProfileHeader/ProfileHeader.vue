<template>
    <div class="border-b border-[#2f3336] bg-black">
        <!-- Cover Image -->
        <CoverImage :cover-url="user?.cover_url ?? ''" />

        <!-- Profile Info -->
        <div class="px-4">
            <div class="-mt-[70px] mb-3 flex items-end justify-between">
                <!-- Avatar -->
                <ProfileAvatar
                    :avatar-url="user?.avatar_url ?? ''"
                    :display-name="user?.name ?? ''"
                />
                <div v-if="isMe" class="flex gap-3">
                    <ProfileEditButton />
                </div>
                <!-- Actions -->
                <div v-else class="flex gap-3">
                    <ProfileActions v-if="user?.id" />
                    <!-- TODO: Add the chat icon here later -->

                    <ProfileFollowAction v-if="user?.id" />

                    <ProfileBlockedAction />
                </div>
            </div>

            <!-- User Details -->
            <div class="pb-4">
                <ProfileUserInfo
                    :display-name="user?.name ?? ''"
                    :username="user?.username ?? ''"
                />
                <ProfileBio :bio="user?.bio ?? ''" />
                <ProfileCreatedAt :created-at="user?.created_at ?? ''" />
                <ProfileStats
                    :following-count="user?.following_count ?? 0"
                    :followers-count="user?.followers_count ?? 0"
                />
                <ProfileMuteMessage />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CoverImage from './SubComponents/CoverImage.vue'
import ProfileAvatar from './SubComponents/ProfileAvatar.vue'
import ProfileEditButton from './SubComponents/ProfileEditButton.vue'
import ProfileFollowAction from './SubComponents/ProfileFollowAction.vue'
import ProfileUserInfo from './SubComponents/ProfileUserInfo.vue'
import ProfileBio from './SubComponents/ProfileBio.vue'
import ProfileCreatedAt from './SubComponents/ProfileCreatedAt.vue'
import ProfileStats from './SubComponents/ProfileStats.vue'
import ProfileActions from './SubComponents/ProfileActions.vue'
import ProfileMuteMessage from './SubComponents/ProfileMuteMessage.vue'
import ProfileBlockedAction from './SubComponents/ProfileBlockedAction.vue'
import { useRoute } from 'vue-router'
import { useUserInfoQuery } from '../../queries/useUserInfoQuery'
import { useMe } from '../../composables/useMe'

const route = useRoute()
const username = route.params.username as string
const { isMe } = useMe(username)
const userQuery = useUserInfoQuery(username)
const user = computed(() => userQuery.data.value)
</script>

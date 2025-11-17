<template>
    <div class="border-b border-primary bg-primary">
        <!-- Cover Image -->
        <CoverImage :cover-url="user?.cover_url ?? ''" />

        <!-- Profile Info -->
        <div class="px-4">
            <div class="-mt-[42px] sm:-mt-[67px] mb-3 flex items-end justify-between">
                <!-- Avatar -->
                <ProfileAvatar
                    :avatar-url="user?.avatar_url ?? ''"
                    :display-name="user?.name ?? ''"
                />
                <!-- Actions -->
                <div class="mt-3 flex gap-2">
                    <div v-if="isMee" class="flex gap-2">
                        <ProfileEditButton />
                    </div>
                    <div v-else class="flex flex-wrap gap-2">
                        <ProfileActions v-if="user?.user_id" />
                        <ProfileFollowAction v-if="user?.user_id" />
                        <ProfileBlockedAction />
                    </div>
                </div>
            </div>

            <!-- User Details -->
            <div class="pb-4">
                <ProfileUserInfo
                    :display-name="user?.name ?? ''"
                    :username="user?.username ?? ''"
                />
                <ProfileBio :bio="user?.bio ?? ''" />
                <ProfileMetadata
                    :location="user?.country ?? null"
                    :created-at="user?.created_at ?? ''"
                />
                <ProfileStats
                    :following-count="user?.following_count ?? 0"
                    :followers-count="user?.followers_count ?? 0"
                />
                <ProfileMutualFollowers
                    v-if="!isMee"
                    :mutual-followers-count="Number((user as OtherUser)?.mutual_followers_count) ?? 0"
                    :mutual-followers="(user as OtherUser)?.top_mutual_followers ?? []"
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
import ProfileMetadata from './SubComponents/ProfileMetadata.vue'
import ProfileStats from './SubComponents/ProfileStats.vue'
import ProfileActions from './SubComponents/ProfileActions.vue'
import ProfileMuteMessage from './SubComponents/ProfileMuteMessage.vue'
import ProfileBlockedAction from './SubComponents/ProfileBlockedAction.vue'
import ProfileMutualFollowers from './SubComponents/ProfileMutualFollowers.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserInfoQuery } from '../../queries/useUserInfoQuery'
import { useMe } from '../../composables/useMe'
import type { OtherUser } from '../../types/user'

const route = useRoute()
const username = route.params.username as string
const { userQuery, myQuery } = useUserInfoQuery(username)
const { isMe: isMeComputed } = useMe(username)
const isMee = computed(() => isMeComputed.value)
const user = computed(() => {
    if (isMee.value) {
        console.log('isMee:', myQuery.data.value)
        return myQuery.data.value
    }
    console.log('isMee:', userQuery.data.value)
    return userQuery.data.value
})
</script>

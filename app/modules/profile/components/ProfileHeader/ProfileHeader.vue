<template>
    <div class="border-b border-primary bg-primary">
        <CoverImage :cover-url="user?.cover_url ?? ''" />

        <div class="px-4">
            <div class="-mt-[42px] sm:-mt-[67px] mb-3 flex items-end justify-between">
                <ProfileAvatar
                    :avatar-url="user?.avatar_url ?? ''"
                    :display-name="user?.name ?? ''"
                />
                <div class="mt-3 flex gap-2">
                    <div v-if="isMee" class="flex gap-2">
                        <ProfileEditButton />
                    </div>
                    <div v-else class="flex flex-wrap gap-2">
                        <ProfileMessageButton v-if="user?.user_id" />
                        <ProfileActions v-if="user?.user_id" :is-tweet="false" />
                        <ProfileFollowAction v-if="user?.user_id" :user-id="user.user_id" :username="user.username" />
                        <ProfileBlockedAction />
                    </div>
                </div>
            </div>

            <ProfileInfo :user="user" :is-my-profile="isMee" />
        </div>
    </div>
</template>

<script setup lang="ts">
import CoverImage from './SubComponents/CoverImage.vue'
import ProfileActions from './SubComponents/ProfileActions.vue'
import ProfileAvatar from './SubComponents/ProfileAvatar.vue'
import ProfileBlockedAction from './SubComponents/ProfileBlockedAction.vue'
import ProfileEditButton from './SubComponents/ProfileEditButton.vue'
import ProfileFollowAction from './SubComponents/ProfileFollowAction.vue'
import ProfileMessageButton from './SubComponents/ProfileMessageButton.vue'
import ProfileInfo from './SubComponents/ProfileInfo.vue'
import { useProfileStore } from '../../stores/profileStore'
import { storeToRefs } from 'pinia'

const profileStore = useProfileStore()
const { profile: user, isMyProfile: isMee } = storeToRefs(profileStore)
</script>

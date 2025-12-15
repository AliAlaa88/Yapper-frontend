<template>
    <UserList
        :fetching-source="`/users/${userId}/followers?following=false`"
        query-key-prefix="followers"
        :loading-text="$t('messages.loading')"
        :error-text="$t('messages.error')"
        :retry-text="$t('messages.tryAgain')"
        :empty-title="$t('profile.followLists.emptyState.noFollowers.title')"
        :empty-description="$t('profile.followLists.emptyState.noFollowers.description')"
    >
        <template #default="{ users }">
            <FollowListUserCard
                v-for="user in users as FollowUser[]"
                :key="user.user_id"
                :user="user"
                :show-tooltip="isMyProfile"
            />
        </template>

        <template #empty>
            <EmptyState
                icon="👥"
                :title="$t('profile.followLists.emptyState.noFollowers.title')"
                :description="$t('profile.followLists.emptyState.noFollowers.description')"
            />
        </template>
    </UserList>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { UserList } from '~/modules/Common/components/UserList'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'
import FollowListUserCard from '../../../../Common/components/UserCard/UserCard.vue'
import type { FollowUser } from '~/modules/profile/types/user'

const profileStore = useProfileStore()
const { isMyProfile } = storeToRefs(profileStore)
const userId = computed(() => profileStore.getProfileId() || '')
</script>

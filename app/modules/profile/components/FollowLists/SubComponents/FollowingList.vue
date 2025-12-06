<template>
    <UserList
        :fetching-source="`/users/${userId}/following`"
        query-key-prefix="following"
        :loading-text="$t('messages.loading')"
        :error-text="$t('messages.error')"
        :retry-text="$t('messages.tryAgain')"
        :empty-title="$t('profile.followLists.emptyState.noFollowing.title')"
        :empty-description="$t('profile.followLists.emptyState.noFollowing.description')"
    >
        <template #default="{ users }">
            <FollowListUserCard
                v-for="user in (users as FollowUser[])"
                :key="user.user_id"
                :user="user"
            />
        </template>

        <template #empty>
            <EmptyState
                icon="👤"
                :title="$t('profile.followLists.emptyState.noFollowing.title')"
                :description="$t('profile.followLists.emptyState.noFollowing.description')"
            />
        </template>
    </UserList>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { UserList } from '~/modules/Common/components/UserList'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'
import FollowListUserCard from '../../../../Common/components/UserCard/UserCard.vue'
import type { FollowUser } from '~/modules/profile/types/user'

const profileStore = useProfileStore()
const userId = computed(() => profileStore.getProfileId() || '')
</script>

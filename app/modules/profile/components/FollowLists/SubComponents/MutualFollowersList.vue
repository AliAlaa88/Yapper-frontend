<template>
    <div>
        <div v-if="followersQuery.isLoading.value" class="p-4 text-center text-muted">
            {{ $t('messages.loading') }}
        </div>

        <div v-else-if="followersQuery.isError.value" class="p-4 text-center text-red-500">
            {{ $t('messages.error') }}
        </div>

        <div v-else-if="mutualFollowers && mutualFollowers.length === 0">
            <EmptyState
                icon="👥"
                :title="$t('profile.followLists.emptyState.noMutualFollowers.title')"
                :description="$t('profile.followLists.emptyState.noMutualFollowers.description')"
            />
        </div>

        <div v-else>
            <FollowListUserCard
                v-for="user in mutualFollowers"
                :key="user.user_id"
                :user="user"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'
import FollowListUserCard from '../../../../Common/components/UserCard/UserCard.vue'
import { useFollowListsQuery } from '~/modules/profile/queries/useFollowListsQuery'

const profileStore = useProfileStore()
// const { isMyProfile } = storeToRefs(profileStore)
const userId = computed(() => profileStore.getProfileId() || '')

const { followersQuery } = useFollowListsQuery(userId, true)
const mutualFollowers = computed(() => followersQuery.data.value || [])
</script>

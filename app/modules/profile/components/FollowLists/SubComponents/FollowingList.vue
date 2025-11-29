<template>
    <div>
        <div v-if="followingQuery.isLoading.value" class="p-4 text-center text-muted">
            {{ $t('messages.loading') }}
        </div>

        <div v-else-if="followingQuery.isError.value" class="p-4 text-center text-red-500">
            {{ $t('messages.error') }}
        </div>

        <div v-else-if="following && following.length === 0">
            <EmptyState
                icon="👤"
                :title="$t('profile.followLists.emptyState.noFollowing.title')"
                :description="$t('profile.followLists.emptyState.noFollowing.description')"
            />
        </div>

        <div v-else>
            <FollowListUserCard
                v-for="user in following"
                :key="user.user_id"
                :user="user"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useFollowListsQuery } from '~/modules/profile/queries/useFollowListsQuery'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'
import FollowListUserCard from '../../../../Common/components/UserCard/UserCard.vue'

const profileStore = useProfileStore()
const userId = computed(() => profileStore.getProfileId() || '')

const { followingQuery } = useFollowListsQuery(userId, false)
const following = computed(() => followingQuery.data.value || [])
</script>

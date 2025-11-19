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
            <div
                v-for="user in following"
                :key="user.user_id"
                class="p-4 hover:bg-hover transition-colors cursor-pointer"
            >
                <FollowListUserCard :user="user" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useFollowListsQuery } from '~/modules/profile/queries/useFollowListsQuery'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'
import FollowListUserCard from './FollowListUserCard.vue'

const profileStore = useProfileStore()
const userId = computed(() => profileStore.getProfileId() || '')

const { followingQuery } = useFollowListsQuery(userId)
const following = computed(() => followingQuery.data.value || [])
</script>

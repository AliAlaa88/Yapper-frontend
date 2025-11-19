<template>
    <div>
        <div v-if="followersQuery.isLoading.value" class="p-4 text-center text-muted">
            {{ $t('messages.loading') }}
        </div>

        <div v-else-if="followersQuery.isError.value" class="p-4 text-center text-red-500">
            {{ $t('messages.error') }}
        </div>

        <div v-else-if="followers && followers.length === 0">
            <EmptyState
                icon="👥"
                :title="$t('profile.followLists.emptyState.noFollowers.title')"
                :description="$t('profile.followLists.emptyState.noFollowers.description')"
            />
        </div>

        <div v-else>
            <div
                v-for="user in followers"
                :key="user.user_id"
                class="p-4 hover:bg-hover transition-colors cursor-pointer"
            >
                <FollowListUserCard :user="user" :show-tooltip="isMyProfile" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useFollowListsQuery } from '~/modules/profile/queries/useFollowListsQuery'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'
import FollowListUserCard from './FollowListUserCard.vue'

const profileStore = useProfileStore()
const { isMyProfile } = storeToRefs(profileStore)
const userId = computed(() => profileStore.getProfileId() || '')

const { followersQuery } = useFollowListsQuery(userId)
const followers = computed(() => followersQuery.data.value || [])
</script>

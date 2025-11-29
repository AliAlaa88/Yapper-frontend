<template>
    <div>
        <div v-if="!profile">
            <div class="p-4 text-center text-muted">
                {{ $t('messages.loading') }}
            </div>
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
import type { OtherUser } from '~/modules/profile/types/user'

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const mutualFollowers = computed(() => {
    if (!profile.value) return []
    return (profile.value as OtherUser).top_mutual_followers || []
})
</script>

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
                <div class="flex items-start gap-3">
                    <img
                        :src="user.avatar_url || '/default-avatar.png'"
                        :alt="user.name"
                        class="h-12 w-12 rounded-full object-cover"
                    >
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <div class="min-w-0 flex-1">
                                <p class="font-bold text-primary truncate">{{ user.name }}</p>
                                <p class="text-sm text-muted truncate">@{{ user.username }}</p>
                            </div>
                        </div>
                        <p v-if="user.bio" class="mt-1 text-sm text-primary line-clamp-2">
                            {{ user.bio }}
                        </p>
                    </div>
                    <!-- follow button here -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useFollowListsQuery } from '~/modules/profile/queries/useFollowListsQuery'
import EmptyState from '~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue'

const profileStore = useProfileStore()
const userId = computed(() => profileStore.getProfileId() || '')

const { followersQuery } = useFollowListsQuery(userId)
const followers = computed(() => followersQuery.data.value || [])
</script>

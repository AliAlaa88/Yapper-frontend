<template>
    <div class="flex items-start hover:bg-hover gap-3 p-4 transition-colors cursor-pointer">
        <NuxtLink :to="`/${user.username}`" class="flex items-start gap-3 flex-1 min-w-0">
            <NuxtImg
                :src="
                    user?.avatar_url ||
                    'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)
                "
                :alt="user.name"
                class="h-12 w-12 rounded-full object-cover"
            />
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                    <div class="min-w-0 flex-1">
                        <p class="font-bold text-primary truncate">{{ user.name }}</p>
                        <p class="text-sm text-muted truncate">
                            @{{ user.username }}
                            <span
                                v-if="user.is_follower"
                                class="ml-1 text-xs bg-gray-200 dark:bg-gray-700 text-muted px-1.5 py-0.5 rounded"
                                >Follows you</span
                            >
                        </p>
                    </div>

                    <!-- <div class="flex items-center gap-2">
                        <FollowActionButton :user-id="user.user_id" />
                        <Tooltip v-if="showTooltip" :user-id="user.user_id">
                            <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full"
                            :aria-label="$t('profile.actions.more')"
                            >
                            <MoreHorizontal :size="20" class="text-primary" />
                        </button>
                    </Tooltip>
                </div> -->
                </div>
                <p v-if="user.bio" class="mt-1 text-sm text-primary line-clamp-2">
                    {{ user.bio }}
                </p>
            </div>
        </NuxtLink>
        <div @click.stop>
            <ProfileFollowAction
                v-if="user?.user_id || user?.id"
                :user-id="user.user_id || user?.id"
                :username="user.username"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
// import { MoreHorizontal } from 'lucide-vue-next'
// import Tooltip from '~/modules/Common/components/Tooltip/Tooltip.vue'
import type { FollowUser } from '~/modules/profile/types/user'
import ProfileFollowAction from '~/modules/profile/components/ProfileHeader/SubComponents/ProfileFollowAction.vue'

defineProps<{
    user: FollowUser
    showTooltip?: boolean | null
}>()
</script>

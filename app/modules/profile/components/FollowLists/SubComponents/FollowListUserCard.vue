<template>
    <div class="flex items-start gap-3">
        <img
            :src="user.avatar_url || '/default-avatar.png'"
            :alt="user.name"
            class="h-12 w-12 rounded-full object-cover"
        >
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                    <p class="font-bold text-primary truncate">{{ user.name }}</p>
                    <p class="text-sm text-muted truncate">@{{ user.username }}</p>
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
    </div>
</template>

<script setup lang="ts">
// import { MoreHorizontal } from 'lucide-vue-next'
import type { FollowUser } from '~/modules/profile/types/user'
// import Tooltip from '~/modules/Common/components/Tooltip/Tooltip.vue'

defineProps<{
    user: FollowUser
    showTooltip?: boolean
}>()
</script>

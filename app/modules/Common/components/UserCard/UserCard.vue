<template>
    <div class="flex items-start hover:bg-hover gap-3 p-4 transition-colors cursor-pointer">
        <NuxtLink :to="`/${user.username}`" class="flex items-start gap-3 flex-1 min-w-0">
            <UserImage :image-url="props.user?.avatar_url" :name="props.user?.name" :compact="true"/>
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
                </div>
                <p v-if="user.bio && !props.hideBio" class="mt-1 text-sm text-primary line-clamp-2">
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
import UserImage from '../UserImage/UserImage.vue'

const props = defineProps<{
    user: FollowUser
    showTooltip?: boolean | null
    hideBio?: boolean | null
}>()

console.log('hide bio:', props.hideBio)
console.log('user card user:', props.user)
</script>

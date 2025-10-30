<template>
    <div
        v-if="!isBlocked"
        class="pb-3">
        <button
            class="cursor-pointer font-bold text-[15px] leading-[20px] flex
            items-center justify-center whitespace-nowrap
            rounded-full transition-colors duration-200"
            :class="buttonClass"
            @click="handleClick"
            @mouseover="handleMouseOver"
            @mouseout="handleMouseOut"
        >
            {{ buttonText }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useFollow } from '../../../composables/useFollow'
import { useUserInfo } from '../../../composables/useUserInfo'
import { useUserInteractions } from '../../../composables/useUserInteractions'
import { inject } from 'vue'
const userId = inject<Ref<string>>('user-id')!
if (!userId) {
    throw new Error('Missing required provide: user-id')
}
const {
    isBlocked,
    isFollowing,
} = useUserInfo(userId)

const {
    buttonClass,
    buttonText,
    handleMouseOut,
    handleMouseOver,
} = useFollow(userId)

const userInteractions = useUserInteractions(userId)
const {
    handleFollowAction,
    handleUnfollowWithConfirmation,
} = userInteractions

function handleClick() {
    if (!isFollowing.value) handleFollowAction()
    else handleUnfollowWithConfirmation()
}
</script>

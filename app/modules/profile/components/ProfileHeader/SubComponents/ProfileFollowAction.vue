<template>
    <div v-if="!isBlocked" class="pb-3">
        <button
            id="follow-button"
            class="cursor-pointer font-bold text-[15px] leading-5 flex items-center justify-center whitespace-nowrap rounded-full transition-all duration-200"
            :class="buttonClass"
            :disabled="isFollowCooldown"
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
import { inject, ref } from 'vue'

const userId = inject<Ref<string>>('user-id')!
const { isBlocked, isFollowing } = useUserInfo(userId)

const { buttonClass, buttonText, handleMouseOut, handleMouseOver } = useFollow(userId)

const userInteractions = useUserInteractions(userId)
const { handleFollowAction, handleUnfollowWithConfirmation } = userInteractions
const isFollowCooldown = ref(false)
const COOLDOWN_TIME = 2000

async function handleClick() {
    if (isFollowCooldown.value) return

    if (!isFollowing.value) {
        await handleFollowAction()

        isFollowCooldown.value = true
        setTimeout(() => {
            isFollowCooldown.value = false
        }, COOLDOWN_TIME)
    } else {
        handleUnfollowWithConfirmation()
    }
}
</script>

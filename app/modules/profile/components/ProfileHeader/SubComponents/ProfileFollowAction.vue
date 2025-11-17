<template>
    <div v-if="!isBlocked" class="pb-3">
        <!-- <button
            id="follow-button"
            class="cursor-pointer font-bold text-[15px] leading-5 flex items-center
            justify-center whitespace-nowrap rounded-full transition-colors duration-200"
            :class="buttonClass"
            :disabled=""
            @click="handleClick"
            @mouseover="handleMouseOver"
            @mouseout="handleMouseOut"
        >
            {{ buttonText }}
        </button> -->
        <Button
            id="follow-button"
            class="cursor-pointer font-bold text-[15px] leading-5 flex items-center
            justify-center whitespace-nowrap rounded-full transition-colors duration-200"
            :button-class="buttonClass"
            :button-text="buttonText"
            :is-loading="isFollowLoading"
            loading-text="Following"
            @click="handleClick"
            @mouseover="handleMouseOver"
            @mouseout="handleMouseOut"
        />

    </div>
</template>

<script setup lang="ts">
import { useFollow } from '../../../composables/useFollow'
import { useUserInfo } from '../../../composables/useUserInfo'
import { useUserInteractions } from '../../../composables/useUserInteractions'
import Button from '~/components/ui/Button.vue'
import { inject } from 'vue'

const userId = inject<Ref<string>>('user-id')!
const { isBlocked, isFollowing } = useUserInfo(userId)

const { buttonClass, buttonText, handleMouseOut, handleMouseOver } = useFollow(userId)

const userInteractions = useUserInteractions(userId)
const { handleFollowAction, handleUnfollowWithConfirmation, isFollowLoading } = userInteractions
// const isFollowCooldown = ref(false)
// const COOLDOWN_TIME = 2000

// async function handleClick() {
//     if (isFollowCooldown.value) return

//     if (!isFollowing.value) {
//         await handleFollowAction()

//         isFollowCooldown.value = true
//         setTimeout(() => {
//             isFollowCooldown.value = false
//         }, COOLDOWN_TIME)
//     } else {
//         handleUnfollowWithConfirmation()
//     }
// }

async function handleClick() {
    if (isFollowLoading.value) return
    if (!isFollowing.value) {
        await handleFollowAction()
    } else {
        handleUnfollowWithConfirmation()
    }
}
</script>

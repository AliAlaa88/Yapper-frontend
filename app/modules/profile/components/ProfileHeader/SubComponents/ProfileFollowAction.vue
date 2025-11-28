<template>
    <div v-if="!isBlocked" class="pb-3">
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
import { computed } from 'vue'
import { useFollow } from '../../../composables/useFollow'
import { useUserInfo } from '../../../composables/useUserInfo'
import { useUserInteractions } from '../../../composables/useUserInteractions'
import Button from '~/modules/Common/components/Button/Button.vue'

const props = defineProps<{
    userId: string
}>()

const userId = computed(() => props.userId)
const { isBlocked, isFollowing } = useUserInfo(userId)

const { buttonClass, buttonText, handleMouseOut, handleMouseOver } = useFollow(userId)
const userInteractions = useUserInteractions(userId)
const { handleFollowAction, handleUnfollowWithConfirmation, isFollowLoading } = userInteractions

async function handleClick() {
    if (isFollowLoading.value) return
    if (!isFollowing.value) {
        await handleFollowAction()
    } else {
        handleUnfollowWithConfirmation()
    }
}
</script>

<template>
    <div v-if="!isBlocked && me?.user_id !== userId" class="pb-3">
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
import { computed, toRef } from 'vue'
import { useFollow } from '../../../composables/useFollow'
import { useUserInfo } from '../../../composables/useUserInfo'
import { useUserInteractions } from '../../../composables/useUserInteractions'
import Button from '~/modules/Common/components/Button/Button.vue'
import {useUserStore} from '~/modules/auth/stores/userStore'
const userStore = useUserStore()
const me = userStore.getUser()

const props = defineProps<{
    userId: string
    username: string    
    enabled?: boolean

}>()

const userId = computed(() => props.userId)
const username = computed(() => props.username)
const meId = computed(() => me?.user_id)
const enabledRef = toRef(() => props.enabled ?? true)
const { isBlocked, isFollowing } = useUserInfo(userId, enabledRef)

const { buttonClass, buttonText, handleMouseOut, handleMouseOver } = useFollow(userId, enabledRef)
const userInteractions = useUserInteractions(userId, username, meId, enabledRef)
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

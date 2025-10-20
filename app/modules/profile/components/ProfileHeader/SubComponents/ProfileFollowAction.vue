<template>
    <div class="pb-3">
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
        <UnfollowConfirmModal
            :show-confirm="showConfirm"
            :username="username ?? ''"
            @unfollow="confirmUnfollow"
            @cancel="cancelUnfollow" />
    </div>
</template>

<script setup lang="ts">
import { useFollow } from '~/modules/profile/composables/useFollow'
import UnfollowConfirmModal from './UnfollowConfirmModal.vue'

const props = defineProps<{userId: string}>()
const {
    buttonClass,
    buttonText,
    handleMouseOut,
    handleMouseOver,
    handleClick,
    showConfirm,
    username,
    confirmUnfollow,
    cancelUnfollow,
} = useFollow(props.userId)
</script>

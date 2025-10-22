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
        <ConfirmtionModal
            :show-confirm="showConfirm"
            :username="username ?? ''"
            header-text="Unfollow"
            background-color="bg-[#ebf1f1]"
            text-color="text-black"
            action="Unfollow"
            hover-color="hover:bg-gray-200/90"
            @click="confirmUnfollow"
            @cancel="cancelUnfollow"
        >
            <p class="text-gray-200/50 text-[15px] leading-snug">
                Their posts will no longer show up in your Following timeline.
                You can still view their profile, unless their posts are protected.
            </p>
        </ConfirmtionModal>
    </div>
</template>

<script setup lang="ts">
import { useFollow } from '~/modules/profile/composables/useFollow'
import ConfirmtionModal from './ConfirmtionModal.vue'

const props = defineProps<{userId: string}>()
const {
    buttonClass,
    buttonText,
    showConfirm,
    username,
    handleMouseOut,
    handleMouseOver,
    handleClick,
    confirmUnfollow,
    cancelUnfollow,
} = useFollow(props.userId)
</script>

<template>
    <div class="relative inline-block text-left">
        <button
            class="w-9 h-9 flex items-center justify-center cursor-pointer
            rounded-full border border-white/40 hover:bg-gray-200/15 transition"
            @click="handleShowList"
        >
            <span
                class="text-white text-xl font-bold leading-none">⋯</span>
        </button>
        <ProfileActionsMenu
            v-if="showList"
            @action-type="handleShowConfirmation"
            @handle-mute="handleMuteAndUnmute"
        />
        <ConfirmtionModal
            :show-confirm="showConfirm"
            :username="confirmData.username"
            :header-text="confirmData.header"
            :background-color="confirmData.bgColor"
            :text-color="confirmData.text"
            :action="confirmData.action"
            :hover-color="confirmData.hover"
            @click="handleConfirm"
            @cancel="handleCancel"
        >
            <p class="text-gray-200/50 text-[15px] leading-snug">
                {{ confirmData.message }}
            </p>
        </ConfirmtionModal>
    </div>
</template>

<script setup lang="ts">
import ProfileActionsMenu from './ProfileActionsMenu.vue'
import ConfirmtionModal from './ConfirmtionModal.vue'
import { useUserInteractions } from '~/modules/profile/composables/useUserInteractions'
const props = defineProps<{userId: string}>()
const {
    showList,
    showConfirm,
    confirmData,
    handleCancel,
    handleConfirm,
    handleShowConfirmation,
    handleShowList,
    handleMuteAndUnmute,
} = useUserInteractions(props.userId)

</script>

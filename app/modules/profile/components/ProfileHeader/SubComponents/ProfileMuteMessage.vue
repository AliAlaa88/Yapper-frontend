<template>
    <div v-if="showMuteMessage" class="mt-3">
        <span class="text-muted text-[15px]"> You have muted posts from this account. </span>
        <span
            id="unmute-button"
            class="cursor-pointer hover:underline text-blue"
            @click="handleClick"
        >
            Unmute
        </span>
    </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '../../../composables/useUserInfo'
import { useUserInteractions } from '../../../composables/useUserInteractions'
import { inject, ref, watch } from 'vue'

const userId = inject<Ref<string>>('user-id')!
const { isMuted } = useUserInfo(userId)

const showMuteMessage = ref(false)
const userInteractions = useUserInteractions(userId)
const { handleUnmuteWithConfirmation } = userInteractions

watch(
    () => isMuted.value,
    (newVal) => {
        if (newVal) {
            console.log('muted new value from message', newVal)
            showMuteMessage.value = true
        } else showMuteMessage.value = false
    },
)

function handleClick() {
    handleUnmuteWithConfirmation()
}
</script>

<template>
    <div v-if="showMuteMessage" class="mt-3">
        <span class="text-muted text-[15px]">{{ $t('profile.muted.message') }}</span>
        <span
            id="unmute-button"
            class="cursor-pointer hover:underline text-blue"
            @click="handleClick"
        >
            {{ $t('profile.muted.action') }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '../../../composables/useUserInfo'
import { useUserInteractions } from '../../../composables/useUserInteractions'
import { ref, watch, computed } from 'vue'
import { useProfileStore } from '../../../stores/profileStore'

const profileStore = useProfileStore()
const userId = computed(() => profileStore.getProfileId() || '')
const { isMuted } = useUserInfo(userId)

const showMuteMessage = ref(false)
const userInteractions = useUserInteractions(userId)
const { handleUnmuteWithConfirmation } = userInteractions

watch(
    () => isMuted.value,
    (newVal) => {
        if (newVal) {
            showMuteMessage.value = true
        } else showMuteMessage.value = false
    },
)

function handleClick() {
    handleUnmuteWithConfirmation()
}
</script>

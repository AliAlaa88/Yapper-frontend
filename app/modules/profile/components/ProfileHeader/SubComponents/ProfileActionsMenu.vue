<template>
    <div
        v-if="showList"
        ref="dropdownRef"
        class="absolute top-[-8px] right-0 mt-2 w-56 bg-primary rounded-xl shadow-[0_0_7px_rgba(255,255,255,0.4)] z-50"
    >
        <button
            v-if="!isBlocked"
            id="mute-button"
            class="cursor-pointer w-full text-primary font-semibold text-left px-4 py-3 hover:bg-hover transition flex items-center first:rounded-t-xl"
            @click="handleMuteAndUnmute"
        >
            <MegaphoneOff v-if="!isMuted" class="w-4 h-4 mr-3" />
            <Megaphone v-else class="w-4 h-4 mr-3" />
            {{ isMuted ? 'Unmute' : 'Mute' }}
        </button>
        <button
            v-if="isFollower && !isBlocked"
            id="remove-follower-button"
            class="w-full text-primary text-left  font-semibold px-4 py-3 hover:bg-hover transition flex items-center cursor-pointer"
            @click="handleRemove"
        >
            <UserRoundX class="w-4 h-4 mr-3" />
            Remove this follower
        </button>
        <button
            id="block-button"
            class="w-full text-primary text-left px-4 py-3 font-semibold hover:bg-hover transition flex items-center last:rounded-b-xl cursor-pointer first:rounded-t-xl"
            @click="handleBlockAndUnblock"
        >
            <Ban v-if="!isBlocked" class="w-4 h-4 mr-3" />
            <CircleCheckBig v-else class="w-4 h-4 mr-3" />
            {{ isBlocked ? 'Unblock' : 'Block' }}
            <span class="font-normal ml-1">@</span>
            {{ username }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { Ban, MegaphoneOff, UserRoundX, Megaphone, CircleCheckBig } from 'lucide-vue-next'
import { useUserInfo } from '~/modules/profile/composables/useUserInfo'
import { useUserInteractions } from '~/modules/profile/composables/useUserInteractions'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
const showList = inject<Ref<boolean>>('show-list')!

const userId = inject<Ref<string>>('user-id')!
if (!userId) {
    throw new Error('Missing required provide: user-id')
}
const { isBlocked, isMuted, isFollower, username } = useUserInfo(userId)
const dropdownRef = ref<HTMLElement | null>(null)

const userInteractions = useUserInteractions(userId)
const {
    handleBlockWithConfirmation,
    handleMuteWithSnackbar,
    handleRemoveFollowerWithConfirmation,
    handleUnmuteWithSnackbar,
    handleUnblockWithConfirmation,
} = userInteractions

function handleMuteAndUnmute() {
    if (isMuted.value) handleUnmuteWithSnackbar(showList)
    else handleMuteWithSnackbar(showList)
}

function handleBlockAndUnblock() {
    if (isBlocked.value) {
        console.log('el value --> ', isBlocked)
        handleUnblockWithConfirmation(showList)
    } else handleBlockWithConfirmation(showList)
}

function handleRemove() {
    handleRemoveFollowerWithConfirmation(showList)
}
function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        showList.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div
        v-if="showList"
        class="absolute top-[-8px] right-0 mt-2 w-56 bg-black
        rounded-xl shadow-[0_0_7px_rgba(255,255,255,0.4)] z-50"
    >
        <button
            v-if="!isBlocked"
            id="mute-button"
            class="cursor-pointer w-full text-white font-semibold text-left px-4 py-3
            hover:bg-gray-200/10 transition flex items-center first:rounded-t-xl"
            @click="handleMuteAndUnmute"
        >
            <MegaphoneOff v-if="!isMuted" class="w-4 h-4 mr-3" />
            <Megaphone v-else class="w-4 h-4 mr-3" />
            {{ isMuted ? 'Unmute' : 'Mute' }}
        </button>
        <button
            v-if="isFollower && !isBlocked"
            id="remove-follower-button"
            class="w-full text-white text-left font-semibold px-4 py-3
            hover:bg-gray-200/10
            transition flex items-center cursor-pointer"
            @click="handleRemove"
        >
            <UserRoundX class="w-4 h-4 mr-3" />
            Remove this follower
        </button>
        <button
            id="block-button"
            class="w-full text-white text-left px-4 py-3 font-semibold
            hover:bg-gray-200/10
            transition flex items-center last:rounded-b-xl cursor-pointer first:rounded-t-xl"
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
import { useUserInfo } from '../../../composables/useUserInfo'
import { useUserInteractions } from '../../../composables/useUserInteractions'
import type { Ref } from 'vue'
import { inject } from 'vue'
const showList = inject<Ref<boolean> | undefined>('show-list')

const userId = inject<Ref<string>>('user-id')!
if (!userId) {
    throw new Error('Missing required provide: user-id')
}
const {
    isBlocked,
    isMuted,
    isFollower,
    username,
} = useUserInfo(userId)

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

</script>

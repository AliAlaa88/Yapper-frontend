<template>
    <div
        v-if="showList"
        ref="dropdownRef"
        class="sm:absolute right-0 mt-2 bg-primary rounded-xl fixed bottom-0 sm:bottom-auto
        sm:shadow-[0_0_7px_rgba(255,255,255,0.4)] shadow-none z-50 transition-allduration-200
        sm:w-56 sm:top-[-8px] left-1/2 sm:left-auto transform sm:transform-none -translate-x-1/2
        sm:translate-x-0 w-full sm:rounded-xl rounded-t-2xl sm:max-h-none max-h-[50vh]
        overflow-y-auto">
        <Button
            v-if="!isBlocked"
            id="mute-button"
            button-class="cursor-pointer w-full text-primary font-semibold text-left
            px-4 py-3 hover:bg-hover transition flex items-center first:rounded-t-xl"
            :is-loading="isMuteLoading"
            @click="handleMuteAndUnmute"
        >
            <template #icon-left>
                <MegaphoneOff v-if="!isMuted" class="w-4 h-4 mr-3" />
                <Megaphone v-else class="w-4 h-4 mr-3" />
            </template>
            {{ isMuted ? $t('profile.unmuteButton') : $t('profile.muteButton') }}
        </Button>

        <Button
            v-if="isFollower && !isBlocked"
            id="remove-follower-button"
            button-class="cursor-pointer w-full text-primary font-semibold text-left px-4
            py-3 hover:bg-hover transition flex items-center first:rounded-t-xl last:rounded-b-xl"
            @click="handleRemove"
        >
            <template #icon-left>
                <UserRoundX class="w-4 h-4 mr-3" />
            </template>
            {{ $t('profile.removeFollowerButton') }}
        </Button>

        <Button
            id="block-button"
            button-class="w-full text-primary text-left px-4 py-3 font-semibold hover:bg-hover
            transition flex items-center last:rounded-b-xl cursor-pointer"
            @click="handleBlockAndUnblock">
            <template #icon-left>
                <Ban v-if="!isBlocked" class="w-4 h-4 mr-3" />
                <CircleCheckBig v-else class="w-4 h-4 mr-3" />
            </template>
            {{ isBlocked ? $t('profile.unblockButton') : $t('profile.blockButton') }}
            <span class="font-normal ml-1">@</span>
            {{ username }}
        </Button>

        <div class="px-4">
            <Button
                id="cancel-menu-button"
                button-class="w-full cursor-pointer border border-primary text-center
                font-semibold py-2.5 hover:bg-hover rounded-full transition mt-2 mb-3
                text-primary sm:hidden"
                @click="showList = false"
            >
                {{ $t('profile.cancelButton') }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ban, MegaphoneOff, UserRoundX, Megaphone, CircleCheckBig } from 'lucide-vue-next'
import { useUserInfo } from '~/modules/profile/composables/useUserInfo'
import { useUserInteractions } from '~/modules/profile/composables/useUserInteractions'
import { ref, onMounted, onBeforeUnmount, inject, computed } from 'vue'
import type { Ref } from 'vue'
import Button from '~/components/ui/Button.vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'

const showList = inject<Ref<boolean>>('show-list')!

const profileStore = useProfileStore()
const userId = computed(() => profileStore.getProfileId() || '')
const { isBlocked, isMuted, isFollower, username } = useUserInfo(userId)
const dropdownRef = ref<HTMLElement | null>(null)

const userInteractions = useUserInteractions(userId)
const {
    handleBlockWithConfirmation,
    handleMuteWithSnackbar,
    handleRemoveFollowerWithConfirmation,
    handleUnmuteWithSnackbar,
    handleUnblockWithConfirmation,
    isMuteLoading,
} = userInteractions

function handleMuteAndUnmute() {
    if (isMuted.value) handleUnmuteWithSnackbar(showList)
    else handleMuteWithSnackbar(showList)
}

function handleBlockAndUnblock() {
    if (isBlocked.value) {
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

<template>
    <div
        v-if="showList"
        ref="dropdownRef"
        data-menu-container
        class="fixed bottom-0 inset-x-0 z-100 bg-primary
        rounded-t-2xl max-h-[50vh] overflow-y-auto
        sm:absolute sm:bottom-auto sm:top-[-8px]
        sm:w-70 sm:rounded-xl
        sm:shadow-[0_0_7px_rgba(255,255,255,0.4)]
        ltr:sm:right-0 rtl:sm:left-0"
        @click.stop
    >
        <Button
            v-if="isTweet && !isBlocked"
            id="follow-tweeet-button"
            button-class="cursor-pointer w-full text-primary font-semibold text-left
            px-4 py-3 hover:bg-hover transition flex items-center first:rounded-t-xl"
            :is-loading="isFollowLoading || isUnfollowLoading"
            @click="handleFollowAndUnfollow"
        >
            <template #icon-left>
                <UserRoundPlus v-if="!isFollowing" class="w-4 h-4 mr-3"/>
                <UserRoundMinus v-else class="w-4 h-4 mr-3" />
            </template>
            {{ isFollowing ? $t('profile.unfollowButton') : $t('profile.followButton') }}
            <span class="font-normal ml-1">@</span>
            {{ username }}
        </Button>

        <Button
            v-if="!isBlocked"
            id="mute-button"
            button-class="cursor-pointer w-full text-primary font-semibold text-left
            px-4 py-3 hover:bg-hover transition flex items-center first:rounded-t-xl"
            :is-loading="isMuteLoading || isUnmuteLoading"
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
import { Ban, MegaphoneOff, UserRoundX, Megaphone, CircleCheckBig, UserRoundPlus, UserRoundMinus } from 'lucide-vue-next'
import { useUserInfo } from '~/modules/profile/composables/useUserInfo'
import { useUserInteractions } from '~/modules/profile/composables/useUserInteractions'
import { ref, onMounted, onBeforeUnmount, inject, computed } from 'vue'
import type { Ref } from 'vue'
import Button from '~/modules/Common/components/Button/Button.vue'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useUserStore } from '~/modules/auth/stores/userStore'

const props = defineProps<{
    userid?: string | null,
    isTweet: boolean
}>()

const emit = defineEmits<{
    'user-action': [action: 'mute' | 'block' | 'unmute' | 'unblock']
}>()

const showList = inject<Ref<boolean>>('show-list')!

const profileStore = useProfileStore()
const userStore = useUserStore()
const userId = computed(() => props.userid ? props.userid : profileStore.getProfileId() || '')
const meId = computed(() => userStore.getUser()?.user_id)
const { isBlocked, isMuted, isFollower, username, isFollowing } = useUserInfo(userId)
const dropdownRef = ref<HTMLElement | null>(null)

const userInteractions = useUserInteractions(userId, username, meId)
const {
    handleBlockWithConfirmation,
    handleMuteWithSnackbarWithAction,
    handleRemoveFollowerWithConfirmation,
    handleUnmuteWithSnackbar,
    handleUnblockWithConfirmation,
    handleFolloweWithSnackbar,
    handleUnfollowWithSnackbar,
    isMuteLoading,
    isFollowLoading,
    isUnfollowLoading,
    isUnmuteLoading,
} = userInteractions

async function handleMuteAndUnmute() {
    if (isMuted.value) {
        await handleUnmuteWithSnackbar(false, showList)
        emit('user-action', 'unmute')
    } else {
        await handleMuteWithSnackbarWithAction()
        emit('user-action', 'mute')
    }
}
function handleFollowAndUnfollow() {
    if (isFollowing.value) handleUnfollowWithSnackbar(showList)
    else handleFolloweWithSnackbar(showList)
}

function handleBlockAndUnblock() {
    if (isBlocked.value) {
        handleUnblockWithConfirmation(showList, () => {
            emit('user-action', 'unblock')
        })
    } else {
        handleBlockWithConfirmation(showList, () => {
            emit('user-action', 'block')
        })
    }
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

<template>
    <div
        class="absolute top-[-8px] right-0 mt-2 w-56 bg-black
        rounded-xl shadow-[0_0_7px_rgba(255,255,255,0.4)] z-50"
    >
        <button
            v-if="!isBlocked"
            class="cursor-pointer w-full text-white font-semibold text-left px-4 py-3
            hover:bg-gray-200/10 transition flex items-center first:rounded-t-xl"
            @click="$emit('handle-mute')"
        >
            <MegaphoneOff v-if="!isMuted" class="w-4 h-4 mr-3" />
            <Megaphone v-else class="w-4 h-4 mr-3" />
            {{ isMuted ? 'Unmute' : 'Mute' }}
        </button>
        <button
            v-if="isFollower && !isBlocked"
            class="w-full text-white text-left font-semibold px-4 py-3 hover:bg-gray-200/10
            transition flex items-center cursor-pointer"
            @click="$emit('action-type', 'remove')"
        >
            <UserRoundX class="w-4 h-4 mr-3" />
            Remove this follower
        </button>
        <button
            class="w-full text-white text-left px-4 py-3 font-semibold hover:bg-gray-200/10
            transition flex items-center last:rounded-b-xl cursor-pointer first:rounded-t-xl"
            @click="isBlocked ? $emit('action-type', 'unblock') : $emit('action-type', 'block')"
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

const userId = inject<Ref<string>>('user-id')
const {
    isFollower,
    isBlocked,
    isMuted,
    username,
} = useUserInfo(userId?.value ?? '')


defineEmits(['action-type', 'handle-mute'])

</script>

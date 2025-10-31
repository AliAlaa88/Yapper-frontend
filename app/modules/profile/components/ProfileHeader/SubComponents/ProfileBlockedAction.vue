<template>
    <div
        v-if="isBlocked"
        class="pb-3">
        <button
            class="cursor-pointer font-bold text-[15px] leading-[20px] flex
            items-center justify-center whitespace-nowrap
            rounded-full transition-colors duration-200
            bg-red-500 hover:bg-red-500/85 text-white
            px-[45px] py-[10px] w-[88px] h-[36px]"
            @click="handleUnblockWithConfirmation()"
            @mouseover="hover = true"
            @mouseout="hover = false"
        >
            {{ buttonText }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '../../../composables/useUserInfo'
import { useUserInteractions } from '../../../composables/useUserInteractions'
import { inject, ref, computed } from 'vue'

const userId = inject<Ref<string>>('user-id')!
const {
    isBlocked,
} = useUserInfo(userId)
const hover = ref(false)
const buttonText = computed(() => {
    if (hover.value) return 'Unblock'
    else return 'Blocked'
})

const userInteractions = useUserInteractions(userId)
const {
    handleUnblockWithConfirmation,
} = userInteractions

</script>

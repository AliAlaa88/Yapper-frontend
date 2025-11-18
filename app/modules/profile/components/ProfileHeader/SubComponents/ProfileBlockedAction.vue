<template>
    <div
        v-if="isBlocked"
        class="pb-3">
        <!-- <button
            id="profile-block-button"
            class="cursor-pointer font-bold text-[15px] leading-[20px] flex
            items-center justify-center whitespace-nowrap
            rounded-full transition-colors duration-200
            bg-red hover:opacity-95 text-primary
            px-[45px] py-[10px] w-[88px] h-[36px]"
            @click="handleUnblockWithConfirmation()"
            @mouseover="hover = true"
            @mouseout="hover = false"
        >
            {{ buttonText }}
        </button> -->
        <Button
            id="profile-block-button"
            class="cursor-pointer font-bold text-[15px] leading-5 flex items-center
            justify-center whitespace-nowrap rounded-full transition-colors duration-200"
            :button-class="`bg-red hover:opacity-95 text-primary
            px-[45px] py-[10px] w-[88px] h-[36px]`"
            :button-text="buttonText"
            @click="handleUnblockWithConfirmation"
            @mouseover="hover = true"
            @mouseout="hover = false"
        />
    </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
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

<template>
    <div
        v-if="isBlocked"
        class="pb-3">
        <!-- <button
            id="profile-block-button"
            class="cursor-pointer font-bold text-[15px] leading-5 flex items-center justify-center whitespace-nowrap rounded-full transition-all duration-200 px-4 py-1.5 h-9 min-w-[109px]"
            :class="hover ? 'bg-[#f4212e1a] border border-[#67070f] text-[#f4212e]' : 'bg-transparent border border-[#536471] text-primary hover:bg-[#181818]'"
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProfileStore } from '../../../stores/profileStore'

const profileStore = useProfileStore()
const userId = computed(() => profileStore.getProfileId() || '')
const {
    isBlocked,
} = useUserInfo(userId)
const hover = ref(false)
const { t } = useI18n()
const buttonText = computed(() => {
    if (hover.value) return t('profile.unblockButton')
    else return t('profile.blockedButton')
})

const userInteractions = useUserInteractions(userId)
const {
    handleUnblockWithConfirmation,
} = userInteractions

</script>

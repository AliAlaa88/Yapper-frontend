<template>
    <div v-if="isBlocked">
        <button
            id="profile-block-button"
            class="cursor-pointer font-bold text-[15px] leading-5 flex items-center justify-center whitespace-nowrap rounded-full transition-all duration-200 px-4 py-1.5 h-9 min-w-[109px]"
            :class="hover ? 'bg-[#f4212e1a] border border-[#67070f] text-[#f4212e]' : 'bg-transparent border border-[#536471] text-primary hover:bg-[#181818]'"
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
import { useI18n } from 'vue-i18n'

const userId = inject<Ref<string>>('user-id')!
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

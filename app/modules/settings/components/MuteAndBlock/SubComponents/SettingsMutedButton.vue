<template>
    <Button
        id="settings-mute-button"
        class="w-9 h-9 flex items-center justify-center cursor-pointer rounded-full"
        :is-loading="isLoading"
        :button-class="buttonClass"
        @click="handleClick"
    >
        <MegaphoneOff  v-if="isMuted" :size="16" />
        <Megaphone v-else :size="16" />
    </Button>
</template>

<script setup lang="ts">
import Button from '~/modules/Common/components/Button/Button.vue'
import { useUserInteractions } from '~/modules/profile/composables/useUserInteractions'
import { MegaphoneOff, Megaphone } from 'lucide-vue-next'

const props = defineProps<{
    userId: string
    isMuted?: boolean
}>()

const userIdRef = ref(props.userId)
const isMutedRef = computed(() => props.isMuted)
const {
    handleMuteWithSnackbar,
    handleUnmuteWithSnackbar,
    isMuteLoading,
    isUnmuteLoading,
} = useUserInteractions(userIdRef)

const buttonClass = computed(() => {
    if (isMutedRef.value) {
        return 'bg-red/10 border border-red text-red hover:bg-red-20 transition ml-3 hover:text-red-400'
    }
    return 'bg-transparent border border-accent hover:opacity-95 text-accent hover:text-accent-dark transition ml-3'
})

const isLoading = computed(() => isMuteLoading.value || isUnmuteLoading.value)

const handleClick = async () => {
    if (isMutedRef.value) {
        await handleUnmuteWithSnackbar(true)
    } else {
        await handleMuteWithSnackbar()
    }
}
</script>

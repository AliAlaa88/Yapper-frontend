<template>
    <Button
        id="settings-mute-button"
        class="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full"
        :button-class="buttonClass"
        :is-loading="isLoading"
        @click="handleClick"
    >
        <MegaphoneOff v-if="isMuted" :size="16" />
        <Megaphone v-else :size="16" />

    </Button>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import { useUserInteractions } from '~/modules/profile/composables/useUserInteractions'
import { MegaphoneOff, Megaphone } from 'lucide-vue-next'

const props = defineProps<{
    userId: string
    isMuted?: boolean
}>()

const userIdRef = ref(props.userId)
const isMutedRef = ref(props.isMuted ?? false)
const {
    handleMuteWithSnackbar,
    handleUnmuteWithSnackbar,
    isMuteLoading,
    isUnmuteLoading,
} = useUserInteractions(userIdRef)

const buttonClass = computed(() => {
    if (isMutedRef.value) {
        return 'bg-red/10 border border-red text-red hover:bg-red-20 transition ml-3 text-red hover:text-red-400'
    }
    return 'bg-primary border border-red hover:opacity-95 text-primary px-[45px] py-[10px] w-[88px] h-[36px]'
})

const isLoading = computed(() => isMuteLoading.value || isUnmuteLoading.value)

const handleClick = () => {
    if (isMutedRef.value) {
        handleUnmuteWithSnackbar()
    } else {
        handleMuteWithSnackbar()
    }
}
</script>

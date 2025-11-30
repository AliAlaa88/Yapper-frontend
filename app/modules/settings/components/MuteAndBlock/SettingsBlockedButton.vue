<template>
    <Button
        id="settings-block-button"
        class="cursor-pointer font-bold text-[15px] leading-5 flex items-center
        justify-center whitespace-nowrap rounded-full transition-colors duration-200"
        :button-class="buttonClass"
        :button-text="buttonText"
        :is-loading="isLoading"
        @click="handleClick" />
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import { useUserInteractions } from '~/modules/profile/composables/useUserInteractions'

const props = defineProps<{
    userId: string
    isBlocked?: boolean
}>()

const userIdRef = ref(props.userId)
const isBlockedRef = ref(props.isBlocked ?? false)
const {
    handleBlockWithSnackbar,
    handleUnblockWithSnackbar,
    isBlockLoading,
    isUnblockLoading,
} = useUserInteractions(userIdRef)

const buttonText = computed(() => isBlockedRef.value ? 'Blocked' : 'Block')

const buttonClass = computed(() => {
    if (isBlockedRef.value) {
        return 'bg-red hover:opacity-95 text-primary px-[45px] py-[10px] w-[88px] h-[36px]'
    }
    return 'bg-primary border border-red hover:opacity-95 text-primary px-[45px] py-[10px] w-[88px] h-[36px]'
})

const isLoading = computed(() => isBlockLoading.value || isUnblockLoading.value)

const handleClick = () => {
    if (isBlockedRef.value) {
        handleUnblockWithSnackbar()
    } else {
        handleBlockWithSnackbar()
    }
}
</script>

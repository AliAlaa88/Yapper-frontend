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
import Button from '~/modules/Common/components/Button/Button.vue'
import { useUserInteractions } from '~/modules/profile/composables/useUserInteractions'

const props = defineProps<{
    userId: string
    isBlocked?: boolean
}>()

const userIdRef = ref(props.userId)
const isBlockedRef = computed(() => props.isBlocked)
watch(()=> isBlockedRef.value , (val) => {
    console.log('is blockedkkkk', val)
})
const {
    handleBlockWithSnackbar,
    handleUnblockWithSnackbar,
    isBlockLoading,
    isUnblockLoading,
} = useUserInteractions(userIdRef)

const buttonText = computed(() => isBlockedRef.value ? $t('profile.blockedButton') : $t('profile.blockButton'))

const buttonClass = computed(() => {
    if (isBlockedRef.value) {
        return 'bg-red hover:opacity-95 text-primary px-[45px] py-[10px] w-[88px] h-[36px]'
    }
    return 'bg-transparent border border-red hover:opacity-95 text-red px-[45px] py-[10px] w-[88px] h-[36px]'
})

const isLoading = computed(() => isBlockLoading.value || isUnblockLoading.value)

const handleClick = async () => {
    if (isBlockedRef.value) {
        await handleUnblockWithSnackbar()

    } else {
        await handleBlockWithSnackbar()
    }
}

</script>
